<?php

namespace App\Controller;

use App\Entity\Recipe;
use App\Repository\RecipeRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;

class RecipeController extends AbstractController
{
    #[Route('/api/recipes', methods: ['GET'])]
    public function getAll(RecipeRepository $recipeRepository): JsonResponse
    {
        $recipes = $recipeRepository->findAll();

        return $this->json($recipes, 200, [], ['groups' => 'recipe:read']);
    }

    #[Route('/api/recipes/{id}', methods: ['GET'])]
    public function getOne(Recipe $recipe): JsonResponse
    {
        return $this->json($recipe, 200, [], ['groups' => 'recipe:read']);
    }

    #[Route('/api/recipes', methods: ['POST'])]
    public function create(Request $request, EntityManagerInterface $em): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        $recipe = new Recipe();
        $recipe->setNameRecipe($data['name_recipe'] ?? '');
        $recipe->setDescription($data['description'] ?? '');
        $recipe->setInstructions($data['instructions'] ?? '');
        $recipe->setServings($data['servings'] ?? 1);

        $em->persist($recipe);
        $em->flush();

        return $this->json($recipe, 201, [], ['groups' => 'recipe:read']);
    }

    #[Route('/api/recipes/{id}', methods: ['PUT'])]
    public function update(Request $request, Recipe $recipe, EntityManagerInterface $em): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        $recipe->setNameRecipe($data['name'] ?? $recipe->getNameRecipe());
        $recipe->setDescription($data['description'] ?? $recipe->getDescription());

        $em->flush();

        return $this->json($recipe, 200, [], ['groups' => 'recipe:read']);
    }

    #[Route('/api/recipes/{id}', methods: ['DELETE'])]
    public function delete(Recipe $recipe, EntityManagerInterface $em): JsonResponse
    {
        $em->remove($recipe);
        $em->flush();

        return new JsonResponse(null, 204);
    }
}
