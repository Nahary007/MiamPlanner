<?php

namespace App\Controller;

use App\Entity\StockItem;
use App\Entity\User;
use App\Entity\Ingredient;
use App\Repository\StockItemRepository;

use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;

#[Route('/api/stock')]
class StockItemController extends AbstractController
{
    #[Route('', methods: ['GET'])]
    public function getAll(StockItemRepository $stockItemRepository): JsonResponse
    {
        /** @var User $user */
        $user = $this->getUser();
        
        if (!$user) {
            return $this->json(['error' => 'User not authenticated'], 401);
        }
        
        $items = $stockItemRepository->findBy(['user' => $user]);

        return $this->json($items, 200, [], ['groups' => 'stock:read']);
    }

    #[Route('', methods: ['POST'])]
    public function create(Request $request, EntityManagerInterface $em): JsonResponse {
        $data = json_decode($request->getContent(), true);
        
        /** @var User $user */
        $user = $this->getUser();
        
        if (!$user) {
            return $this->json(['error' => 'User not authenticated'], 401);
        }

        // Récupérer l'ingrédient via l'EntityManager
        $ingredient = $em->getRepository(Ingredient::class)->find($data['ingredient_id'] ?? null);
        if (!$ingredient) {
            return $this->json(['error' => 'Ingredient not found'], 404);
        }

        $item = new StockItem();
        $item->setIngredient($ingredient); // Utiliser setIngredient au lieu de setName
        $item->setQuantity($data['quantity'] ?? 0);
        $item->setUnit($data['unit'] ?? '');
        $item->setUser($user);
        
        // Gérer la date d'expiration
        if (isset($data['expiration_date'])) {
            $expirationDate = new \DateTime($data['expiration_date']);
            $item->setExpirationDate($expirationDate);
        }

        $em->persist($item);
        $em->flush();

        return $this->json($item, 201, [], ['groups' => 'stock:read']);
    }
}