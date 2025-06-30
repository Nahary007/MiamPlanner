<?php

namespace App\Controller;

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
        $user = $this->getUser();
        $meals = $plannedMealRepository->findBy(['user' => $user]);

        return $this->json($meals, 200, [], ['groups' => 'meal:read']);
    }

    #[Route('', methods: ['POST'])]
    public function create(Request $request, EntityManagerInterface $em, RecipeRepository $recipeRepo): JsonResponse
    {
        $data = json_decode($request->getContent(), true);
        $user = $this->getUser();

        $recipe = $recipeRepo->find($data['recipe_id']);
        if (!$recipe) {
            return $this->json(['error' => 'Recette introuvable'], 404);
        }

        $meal = new PlannelMealEntity();
        $meal->setUser($user);
        $meal->setRecipe($recipe);
        $meal->setDate(new \DateTime($data['planned_date']));

        $em->persist($meal);
        $em->flush();

        return $this->json($meal, 201, [], ['groups' => 'meal:read']);
    }
}
