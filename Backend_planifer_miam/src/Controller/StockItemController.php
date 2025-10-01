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

class StockItemController extends AbstractController
{
    #[Route('/api/stock', methods: ['GET'])]
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

    #[Route('/api/stock', methods: ['POST'])]
    public function create(Request $request, EntityManagerInterface $em): JsonResponse 
    {
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
        $item->setIngredient($ingredient);
        $item->setQuantity($data['quantity'] ?? 0);
        $item->setUnit($data['unit'] ?? '');
        $item->setUser($user);
        
        // Gérer la date d'expiration (optionnelle maintenant)
        if (isset($data['expirationDate']) && !empty($data['expirationDate'])) {
            try {
                $expirationDate = new \DateTime($data['expirationDate']);
                $item->setExpirationDate($expirationDate);
            } catch (\Exception $e) {
                return $this->json(['error' => 'Invalid expiration date format'], 400);
            }
        }
        // Si pas de date d'expiration fournie, elle reste null (ce qui est maintenant autorisé)

        $em->persist($item);
        $em->flush();

        return $this->json($item, 201, [], ['groups' => 'stock:read']);
    }

    #[Route('/api/stock/{id}', methods: ['PUT'])]
    public function update(
        int $id, 
        Request $request, 
        EntityManagerInterface $em, 
        StockItemRepository $stockItemRepository
    ): JsonResponse {
        /** @var User $user */
        $user = $this->getUser();
        if (!$user) {
            return $this->json(['error' => 'User not authenticated'], 401);
        }

        $item = $stockItemRepository->find($id);
        if (!$item || $item->getUser() !== $user) {
            return $this->json(['error' => 'Stock item not found or access denied'], 404);
        }

        $data = json_decode($request->getContent(), true);

        // Met à jour l'ingrédient si nécessaire
        if (isset($data['ingredient_id'])) {
            $ingredient = $em->getRepository(Ingredient::class)->find($data['ingredient_id']);
            if (!$ingredient) {
                return $this->json(['error' => 'Ingredient not found'], 404);
            }
            $item->setIngredient($ingredient);
        }

        if (isset($data['quantity'])) {
            $item->setQuantity($data['quantity']);
        }

        if (isset($data['unit'])) {
            $item->setUnit($data['unit']);
        }

        // Gérer la date d'expiration
        if (array_key_exists('expirationDate', $data)) {
            if (!empty($data['expirationDate'])) {
                try {
                    $expirationDate = new \DateTime($data['expirationDate']);
                    $item->setExpirationDate($expirationDate);
                } catch (\Exception $e) {
                    return $this->json(['error' => 'Invalid expiration date format'], 400);
                }
            } else {
                // Si la date d'expiration est vide, on la supprime
                $item->setExpirationDate(null);
            }
        }

        $em->flush();

        return $this->json($item, 200, [], ['groups' => 'stock:read']);
    }

    #[Route('/api/stock/{id}', methods: ['DELETE'])]
    public function delete(
        int $id, 
        EntityManagerInterface $em, 
        StockItemRepository $stockItemRepository
    ): JsonResponse {
        /** @var User $user */
        $user = $this->getUser();
        if (!$user) {
            return $this->json(['error' => 'User not authenticated'], 401);
        }

        $item = $stockItemRepository->find($id);
        if (!$item || $item->getUser() !== $user) {
            return $this->json(['error' => 'Stock item not found or access denied'], 404);
        }

        $em->remove($item);
        $em->flush();

        return $this->json(null, 204);
    }

}