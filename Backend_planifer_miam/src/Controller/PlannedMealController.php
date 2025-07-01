<?php

namespace App\Controller;

use App\Entity\User;
use App\Entity\PlannelMealEntity;
use App\Repository\PlannedMealRepository;
use App\Repository\RecipeRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;

#[Route('/api/planned-meals')]
class PlannedMealController extends AbstractController
{
    #[Route('', methods: ['GET'])]
    public function getAll(PlannedMealRepository $plannedMealRepository): JsonResponse
    {
        /** @var User|null $user */
        $user = $this->getUser();
        
        if (!$user instanceof User) {
            return $this->json(['error' => 'Utilisateur non authentifié'], 401);
        }
        
        $meals = $plannedMealRepository->findBy(['user' => $user]);

        return $this->json($meals, 200, [], ['groups' => 'meal:read']);
    }

    #[Route('', methods: ['POST'])]
    public function create(Request $request, EntityManagerInterface $em, RecipeRepository $recipeRepo): JsonResponse
    {
        $data = json_decode($request->getContent(), true);
        
        /** @var User|null $user */
        $user = $this->getUser();
        
        if (!$user instanceof User) {
            return $this->json(['error' => 'Utilisateur non authentifié'], 401);
        }

        $recipe = $recipeRepo->find($data['recipe_id']);
        if (!$recipe) {
            return $this->json(['error' => 'Recette introuvable'], 404);
        }

        // Validation du champ meal_type s'il est fourni
        if (isset($data['meal_type']) && !in_array($data['meal_type'], ['breakfast', 'lunch', 'dinner', 'snack'])) {
            return $this->json(['error' => 'Type de repas invalide'], 400);
        }

        $meal = new PlannelMealEntity();
        $meal->setUser($user);
        $meal->setRecipe($recipe);
        $meal->setDate(new \DateTime($data['planned_date']));
        
        // Définir le type de repas si fourni, sinon valeur par défaut
        if (isset($data['meal_type'])) {
            $meal->setMealType($data['meal_type']);
        } else {
            $meal->setMealType('lunch'); // valeur par défaut
        }

        $em->persist($meal);
        $em->flush();

        return $this->json($meal, 201, [], ['groups' => 'meal:read']);
    }
}