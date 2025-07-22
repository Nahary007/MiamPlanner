<?php

namespace App\Controller;

use App\Entity\Ingredient;
use App\Repository\IngredientRepository;
use Doctrine\ORM\EntityManagerInterface;
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

    #[Route('/api/ingredients/{id}', methods: ['GET'])]
    public function getOne(Ingredient $ingredient): JsonResponse
    {
        return $this->json($ingredient, 200, [], ['groups' => 'ingredient:read']);
    }

    #[Route('/api/ingredients', methods: ['POST'])]
    public function create(Request $request, EntityManagerInterface $em): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        if (!isset($data['name_ingredient']) || !isset($data['unit'])) {
            return $this->json(['error' => 'Nom et unité requis'], 400);
        }

        $ingredient = new Ingredient();
        $ingredient->setNameIngredient($data['name_ingredient']);
        $ingredient->setUnit($data['unit']);

        $em->persist($ingredient);
        $em->flush();

        return $this->json($ingredient, 201, [], ['groups' => 'ingredient:read']);
    }

    #[Route('/api/ingredients/{id}', methods: ['PUT'])]
    public function update(Request $request, Ingredient $ingredient, EntityManagerInterface $em): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        if (isset($data['name_ingredient'])) {
            $ingredient->setNameIngredient($data['name_ingredient']);
        }

        if (isset($data['unit'])) {
            $ingredient->setUnit($data['unit']);
        }

        $em->flush();

        return $this->json($ingredient, 200, [], ['groups' => 'ingredient:read']);
    }

    #[Route('/api/ingredients/{id}', methods: ['DELETE'])]
    public function delete(Ingredient $ingredient, EntityManagerInterface $em): JsonResponse
    {
        $em->remove($ingredient);
        $em->flush();

        return new JsonResponse(null, 204);
    }
}