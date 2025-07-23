<?php

namespace App\Controller;

use App\Entity\Recipe;
use App\Entity\IngredientQuantityEntity;
use App\Repository\IngredientRepository;
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
    public function create(
        Request $request,
        EntityManagerInterface $em,
        IngredientRepository $ingredientRepo
    ): JsonResponse {
        $data = json_decode($request->getContent(), true);

        // Création de la recette
        $recipe = new Recipe();
        $recipe->setNameRecipe($data['name_recipe'] ?? '');
        $recipe->setDescription($data['description'] ?? '');
        $recipe->setInstructions($data['instructions'] ?? '');
        $recipe->setServings((int)($data['servings'] ?? 1));

        // Ajout des ingrédients/quantités
        if (!empty($data['ingredients']) && is_array($data['ingredients'])) {
            foreach ($data['ingredients'] as $ingData) {
                if (!isset($ingData['ingredient_id'], $ingData['quantity'])) {
                    continue;
                }
                $ingredient = $ingredientRepo->find($ingData['ingredient_id']);
                if ($ingredient) {
                    $iq = new IngredientQuantityEntity();
                    $iq->setIngredient($ingredient);
                    $iq->setQuantity((float) $ingData['quantity']);
                    $iq->setRecipe($recipe);
                    $recipe->addIngredientQuantity($iq);
                }
            }
        }

        $em->persist($recipe);
        $em->flush();

        return $this->json($recipe, 201, [], ['groups' => 'recipe:read']);
    }

    #[Route('/api/recipes/{id}', methods: ['PUT'])]
    public function update(
        Request $request,
        Recipe $recipe,
        EntityManagerInterface $em,
        IngredientRepository $ingredientRepo
    ): JsonResponse {
        $data = json_decode($request->getContent(), true);

        $recipe->setNameRecipe($data['name_recipe'] ?? $recipe->getNameRecipe());
        $recipe->setDescription($data['description'] ?? $recipe->getDescription());
        $recipe->setInstructions($data['instructions'] ?? $recipe->getInstructions());
        $recipe->setServings((int)($data['servings'] ?? $recipe->getServings()));

        // Suppression des anciennes quantités d'ingrédients
        foreach ($recipe->getIngredientQuantities() as $oldIq) {
            $em->remove($oldIq);
        }
        $recipe->getIngredientQuantities()->clear();

        // Ajout des nouveaux ingrédients/quantités
        if (!empty($data['ingredients']) && is_array($data['ingredients'])) {
            foreach ($data['ingredients'] as $ingData) {
                if (!isset($ingData['ingredient_id'], $ingData['quantity'])) {
                    continue;
                }
                $ingredient = $ingredientRepo->find($ingData['ingredient_id']);
                if ($ingredient) {
                    $iq = new IngredientQuantityEntity();
                    $iq->setIngredient($ingredient);
                    $iq->setQuantity((float) $ingData['quantity']);
                    $iq->setRecipe($recipe);
                    $recipe->addIngredientQuantity($iq);
                }
            }
        }

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
