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

class PlannedMealController extends AbstractController
{
<<<<<<< HEAD
    #[Route('', methods: ['GET'])]
    public function getAll(Request $request, PlannedMealRepository $plannedMealRepository): JsonResponse
=======
    #[Route('/api/planned_meals', name: 'api_getall', methods: ['GET'])]
    public function getAll(PlannedMealRepository $plannedMealRepository): JsonResponse
>>>>>>> dev-Backend
    {
        /** @var User|null $user */
        $user = $this->getUser();

        if (!$user instanceof User) {
            return $this->json(['error' => 'Utilisateur non authentifié'], 401);
        }

        // Récupérer les paramètres de date pour filtrer par semaine
        $startDate = $request->query->get('start_date');
        $endDate = $request->query->get('end_date');
        
        if ($startDate && $endDate) {
            $meals = $plannedMealRepository->findByUserAndWeek(
                $user, 
                new \DateTime($startDate), 
                new \DateTime($endDate)
            );
        } else {
            $meals = $plannedMealRepository->findBy(['user' => $user]);
        }

        return $this->json($meals, 200, [], ['groups' => 'meal:read']);
    }

    #[Route('/api/planned_meals/week', name: 'api_getWeek', methods: ['GET'])]
    public function getWeek(Request $request, PlannedMealRepository $plannedMealRepository): JsonResponse
    {
        /** @var User|null $user */
        $user = $this->getUser();

        if (!$user instanceof User) {
            return $this->json(['error' => 'Utilisateur non authentifié'], 401);
        }

        // Optionnel : récupérer la date de début via query param
        $startDate = $request->query->get('start');
        if ($startDate) {
            $start = new \DateTime($startDate);
        } else {
            $start = new \DateTime('monday this week');
        }
        $end = (clone $start)->modify('+6 days')->setTime(23, 59, 59);

        $meals = $plannedMealRepository->createQueryBuilder('m')
            ->where('m.user = :user')
            ->andWhere('m.date BETWEEN :start AND :end')
            ->setParameter('user', $user)
            ->setParameter('start', $start)
            ->setParameter('end', $end)
            ->getQuery()
            ->getResult();

        return $this->json($meals, 200, [], ['groups' => 'meal:read']);
    }

    #[Route('/api/planned_meals/create', name: 'api_createPlan', methods: ['POST'])]
    public function create(Request $request, EntityManagerInterface $em, RecipeRepository $recipeRepo): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        /** @var User|null $user */
        $user = $this->getUser();

        if (!$user instanceof User) {
            return $this->json(['error' => 'Utilisateur non authentifié'], 401);
        }

        // Champs en camelCase venant du frontend
        if (!isset($data['recipeId'], $data['date'], $data['mealType'])) {
            return $this->json(['error' => 'Champs requis manquants'], 400);
        }

        $recipe = $recipeRepo->find($data['recipeId']);
        if (!$recipe) {
            return $this->json(['error' => 'Recette introuvable'], 404);
        }

        if (!in_array($data['mealType'], ['breakfast', 'lunch', 'dinner'], true)) {
            return $this->json(['error' => 'Type de repas invalide'], 400);
        }

        $meal = new PlannelMealEntity();
        $meal->setUser($user);
        $meal->setRecipe($recipe);
        $meal->setDate(new \DateTime($data['date']));
        $meal->setMealType($data['mealType']);

        $em->persist($meal);
        $em->flush();

        return $this->json($meal, 201, [], ['groups' => 'meal:read']);
    }

    #[Route('/api/planned_meals/delete/{id}', name: 'api_deletePlan', methods: ['DELETE'])]
    public function delete(int $id, EntityManagerInterface $em): JsonResponse
    {
        $meal = $em->getRepository(PlannelMealEntity::class)->find($id);

        if (!$meal) {
            return $this->json(['error' => 'Repas non trouvé'], 404);
        }

        if ($meal->getUser() !== $this->getUser()) {
            return $this->json(['error' => 'Accès interdit'], 403);
        }

        $em->remove($meal);
        $em->flush();

        return $this->json(['message' => 'Repas supprimé avec succès']);
    }
}
