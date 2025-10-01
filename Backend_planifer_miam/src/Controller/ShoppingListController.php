<?php

namespace App\Controller;

use App\Repository\PlannedMealRepository;
use App\Repository\StockItemRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;
use DateTime;
use DateInterval;
use Symfony\Component\HttpFoundation\Response;
use Dompdf\Dompdf;
use Dompdf\Options;

class ShoppingListController extends AbstractController
{
    #[Route('/api/shopping-list/generate', name: 'shopping_list_generate', methods: ['GET'])]
    public function generate(
        Request $request,
        PlannedMealRepository $plannedMealRepository,
        StockItemRepository $stockItemRepository
    ): JsonResponse
    {
        $user = $this->getUser();
        $startDate = new DateTime($request->query->get('startDate', 'now'));
        $endDate = (clone $startDate)->add(new DateInterval('P6D'));

        $plannedMeals = $plannedMealRepository->findByUserAndWeek($user, $startDate, $endDate);

        // Étape 1 : Calcul des quantités nécessaires par ingrédient
        $needed = [];

        foreach ($plannedMeals as $meal) {
            $recipe = $meal->getRecipe();
            foreach ($recipe->getIngredientQuantities() as $iq) {
                $ingredient = $iq->getIngredient();
                if (!$ingredient) continue;

                $ingredientId = $ingredient->getId();
                if (!isset($needed[$ingredientId])) {
                    $needed[$ingredientId] = [
                        'ingredient' => $ingredient,
                        'totalQuantity' => 0,
                        'unit' => $ingredient->getUnit()
                    ];
                }
                $needed[$ingredientId]['totalQuantity'] += $iq->getQuantity();
            }
        }

        // Étape 2 : Récupération du stock de l'utilisateur
        $userStock = $stockItemRepository->findBy(['user' => $user]);
        $stockMap = [];
        foreach ($userStock as $stockItem) {
            $ingredient = $stockItem->getIngredient();
            if ($ingredient) {
                $stockMap[$ingredient->getId()] = $stockItem->getQuantity();
            }
        }

        // Étape 3 : Calcul des ingrédients manquants
        $shoppingList = [];

        foreach ($needed as $ingredientId => $data) {
            $available = $stockMap[$ingredientId] ?? 0;
            $neededQty = max(0, $data['totalQuantity'] - $available);

            if ($neededQty > 0) {
                $shoppingList[] = [
                    'ingredient' => [
                        'id' => $data['ingredient']->getId(),
                        'nameIngredient' => $data['ingredient']->getNameIngredient(),
                    ],
                    'totalQuantity' => $data['totalQuantity'],
                    'unit' => $data['unit'],
                    'neededQuantity' => $neededQty
                ];
            }
        }

        return $this->json($shoppingList);
    }

    #[Route('/api/shopping-list/download', name: 'shopping_list_download', methods: ['GET'])]
    public function download(
        Request $request,
        PlannedMealRepository $plannedMealRepository,
        StockItemRepository $stockItemRepository
    ): Response {
        $user = $this->getUser();
        $startDate = new DateTime($request->query->get('startDate', 'now'));
        $endDate = (clone $startDate)->add(new DateInterval('P6D'));

        $plannedMeals = $plannedMealRepository->findByUserAndWeek($user, $startDate, $endDate);

        // Reprend la logique de generate()
        $needed = [];

        foreach ($plannedMeals as $meal) {
            $recipe = $meal->getRecipe();
            foreach ($recipe->getIngredientQuantities() as $iq) {
                $ingredient = $iq->getIngredient();
                if (!$ingredient) continue;

                $ingredientId = $ingredient->getId();
                if (!isset($needed[$ingredientId])) {
                    $needed[$ingredientId] = [
                        'ingredient' => $ingredient,
                        'totalQuantity' => 0,
                        'unit' => $ingredient->getUnit()
                    ];
                }
                $needed[$ingredientId]['totalQuantity'] += $iq->getQuantity();
            }
        }

        $userStock = $stockItemRepository->findBy(['user' => $user]);
        $stockMap = [];
        foreach ($userStock as $stockItem) {
            $ingredient = $stockItem->getIngredient();
            if ($ingredient) {
                $stockMap[$ingredient->getId()] = $stockItem->getQuantity();
            }
        }

        $shoppingList = [];

        foreach ($needed as $ingredientId => $data) {
            $available = $stockMap[$ingredientId] ?? 0;
            $neededQty = max(0, $data['totalQuantity'] - $available);

            if ($neededQty > 0) {
                $shoppingList[] = [
                    'ingredient' => [
                        'id' => $data['ingredient']->getId(),
                        'nameIngredient' => $data['ingredient']->getNameIngredient(),
                    ],
                    'totalQuantity' => $data['totalQuantity'],
                    'unit' => $data['unit'],
                    'neededQuantity' => $neededQty
                ];
            }
        }

        // Génère le contenu HTML du PDF
        $html = $this->renderView('pdf/shopping_list.html.twig', [
            'shoppingList' => $shoppingList,
            'startDate' => $startDate,
            'endDate' => $endDate,
        ]);

        // Configuration de Dompdf
        $options = new Options();
        $options->set('defaultFont', 'Arial');

        $dompdf = new Dompdf($options);
        $dompdf->loadHtml($html);
        $dompdf->setPaper('A4', 'portrait');
        $dompdf->render();

        return new Response(
            $dompdf->output(),
            200,
            [
                'Content-Type' => 'application/pdf',
                'Content-Disposition' => 'attachment; filename="liste_courses.pdf"',
            ]
        );
    }

}
