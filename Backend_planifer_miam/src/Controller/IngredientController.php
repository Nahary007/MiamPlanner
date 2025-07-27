<?php

namespace App\Controller;

use App\Entity\Ingredient;
use App\Repository\IngredientRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Security\Http\Attribute\IsGranted;

#[IsGranted('IS_AUTHENTICATED_FULLY')]
class IngredientController extends AbstractController
{
    #[Route('/api/ingredients', methods: ['GET'])]
    public function getAll(Request $request, IngredientRepository $ingredientRepository): JsonResponse
    {
        $user = $this->getUser();
        $search = $request->query->get('search');

        $qb = $ingredientRepository->createQueryBuilder('i')
            ->where('i.user = :user')
            ->setParameter('user', $user);

        if ($search) {
            $qb->andWhere('i.nameIngredient LIKE :search')
               ->setParameter('search', '%' . $search . '%');
        }

        $ingredients = $qb->getQuery()->getResult();

        return $this->json($ingredients, 200, [], ['groups' => 'ingredient:read']);
    }

    #[Route('/api/ingredients/{id}', methods: ['GET'])]
    public function getOne(Ingredient $ingredient): JsonResponse
    {
        $this->denyAccessUnlessGranted('view', $ingredient);

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
        $ingredient->setUser($this->getUser());

        $em->persist($ingredient);
        $em->flush();

        return $this->json($ingredient, 201, [], ['groups' => 'ingredient:read']);
    }

    #[Route('/api/ingredients/{id}', methods: ['PUT'])]
    public function update(Request $request, Ingredient $ingredient, EntityManagerInterface $em): JsonResponse
    {
        $this->denyAccessUnlessGranted('edit', $ingredient);

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
        $this->denyAccessUnlessGranted('delete', $ingredient);

        $em->remove($ingredient);
        $em->flush();

        return new JsonResponse(null, 204);
    }
}
