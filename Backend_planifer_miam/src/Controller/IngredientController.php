<?php

namespace App\Controller;

use App\Entity\Ingredient;
use App\Repository\IngredientRepository;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;

class IngredientController extends AbstractController
{
    #[Route('/api/ingredients', methods: ['GET'])]
    public function getAll(Request $request, IngredientRepository $ingredientRepository): JsonResponse
    {
        $search = $request->query->get('search');
        if ($search) {
            $ingredients = $ingredientRepository->createQueryBuilder('i')
                ->where('i.nameIngredient LIKE :search')
                ->setParameter('search', '%' . $search . '%')
                ->getQuery()
                ->getResult();
        } else {
            $ingredients = $ingredientRepository->findAll();
        }

        return $this->json($ingredients, 200, [], ['groups' => 'ingredient:read']);
    }
}