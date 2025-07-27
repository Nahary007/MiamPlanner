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
use Symfony\Component\Security\Core\User\UserInterface;

class RecipeController extends AbstractController
{
    #[Route('/api/recipes', methods: ['GET'])]
    public function getAll(RecipeRepository $recipeRepository): JsonResponse
    {
        /** @var \App\Entity\User $user */
        $user = $this->getUser();
        $recipes = $recipeRepository->findBy(['user' => $user]);

        return $this->json($recipes, 200, [], ['groups' => 'recipe:read']);
    }

    #[Route('/api/recipes/{id}', methods: ['GET'])]
    public function getOne(Recipe $recipe): JsonResponse
    {
        /** @var \App\Entity\User $user */
        $user = $this->getUser();
        if ($recipe->getUser() !== $user) {
            return new JsonResponse(['message' => 'Access denied'], 403);
        }

        return $this->json($recipe, 200, [], ['groups' => 'recipe:read']);
    }

    #[Route('/api/recipes', methods: ['POST'])]
    public function create(
        Request $request,
        EntityManagerInterface $em,
        IngredientRepository $ingredientRepo
    ): JsonResponse {
        $data = json_decode($request->getContent(), true);
        /** @var \App\Entity\User $user */
        $user = $this->getUser();

        $recipe = new Recipe();
        $recipe->setNameRecipe($data['name_recipe'] ?? '');
        $recipe->setDescription($data['description'] ?? '');
        $recipe->setInstructions($data['instructions'] ?? '');
        $recipe->setServings((int)($data['servings'] ?? 1));
        $recipe->setUser($user); // 🔥 Ajout du user

        if (!empty($data['ingredients']) && is_array($data['ingredients'])) {
            foreach ($data['ingredients'] as $ingData) {
                if (!isset($ingData['ingredient_id'], $ingData['quantity'])) {
                    continue;
                }

                $ingredient = $ingredientRepo->find($ingData['ingredient_id']);

                if ($ingredient && $ingredient->getUser() === $user) {
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
        /** @var \App\Entity\User $user */
        $user = $this->getUser();
        if ($recipe->getUser() !== $user) {
            return new JsonResponse(['message' => 'Access denied'], 403);
        }

        $data = json_decode($request->getContent(), true);

        $recipe->setNameRecipe($data['name_recipe'] ?? $recipe->getNameRecipe());
        $recipe->setDescription($data['description'] ?? $recipe->getDescription());
        $recipe->setInstructions($data['instructions'] ?? $recipe->getInstructions());
        $recipe->setServings((int)($data['servings'] ?? $recipe->getServings()));

        foreach ($recipe->getIngredientQuantities() as $oldIq) {
            $em->remove($oldIq);
        }
        $recipe->getIngredientQuantities()->clear();

        if (!empty($data['ingredients']) && is_array($data['ingredients'])) {
            foreach ($data['ingredients'] as $ingData) {
                if (!isset($ingData['ingredient_id'], $ingData['quantity'])) {
                    continue;
                }

                $ingredient = $ingredientRepo->find($ingData['ingredient_id']);

                if ($ingredient && $ingredient->getUser() === $user) {
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
        /** @var \App\Entity\User $user */
        $user = $this->getUser();
        if ($recipe->getUser() !== $user) {
            return new JsonResponse(['message' => 'Access denied'], 403);
        }

        $em->remove($recipe);
        $em->flush();

        return new JsonResponse(null, 204);
    }
}
