<?php

namespace App\Controller;

use App\Entity\User;
use App\Repository\PlannedMealRepository;
use App\Repository\StockItemRepository;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;

#[Route('/api/dashboard')]
class DashboardController extends AbstractController
{
    #[Route('/stats', methods: ['GET'])]
    public function getStats(
        PlannedMealRepository $plannedMealRepository,
        StockItemRepository $stockItemRepository
    ): JsonResponse {
        /** @var User|null $user */
        $user = $this->getUser();
        
        if (!$user instanceof User) {
            return $this->json(['error' => 'Utilisateur non authentifié'], 401);
        }

        // Calculer le début et la fin de la semaine courante
        $startOfWeek = new \DateTime('monday this week');
        $endOfWeek = new \DateTime('sunday this week');

        // Compter les repas planifiés cette semaine
        $plannedMealsThisWeek = $plannedMealRepository->createQueryBuilder('pm')
            ->select('COUNT(pm.id)')
            ->where('pm.user = :user')
            ->andWhere('pm.date BETWEEN :startOfWeek AND :endOfWeek')
            ->setParameter('user', $user)
            ->setParameter('startOfWeek', $startOfWeek->format('Y-m-d'))
            ->setParameter('endOfWeek', $endOfWeek->format('Y-m-d'))
            ->getQuery()
            ->getSingleScalarResult();

        // Compter le nombre total d'articles en stock
        $stockItemsCount = $stockItemRepository->createQueryBuilder('si')
            ->select('COUNT(si.id)')
            ->where('si.user = :user')
            ->setParameter('user', $user)
            ->getQuery()
            ->getSingleScalarResult();

        // Compter les articles qui expirent dans les 3 prochains jours
        $threeDaysFromNow = new \DateTime('+3 days');
        $expiringItemsCount = $stockItemRepository->createQueryBuilder('si')
            ->select('COUNT(si.id)')
            ->where('si.user = :user')
            ->andWhere('si.expirationDate <= :threeDaysFromNow')
            ->andWhere('si.expirationDate >= :today')
            ->setParameter('user', $user)
            ->setParameter('threeDaysFromNow', $threeDaysFromNow)
            ->setParameter('today', new \DateTime())
            ->getQuery()
            ->getSingleScalarResult();

        return $this->json([
            'plannedMealsThisWeek' => (int) $plannedMealsThisWeek,
            'stockItemsCount' => (int) $stockItemsCount,
            'expiringItemsCount' => (int) $expiringItemsCount,
        ]);
    }

    #[Route('/recent-meals', methods: ['GET'])]
    public function getRecentMeals(PlannedMealRepository $plannedMealRepository): JsonResponse
    {
        /** @var User|null $user */
        $user = $this->getUser();
        
        if (!$user instanceof User) {
            return $this->json(['error' => 'Utilisateur non authentifié'], 401);
        }

        // Récupérer les 5 derniers repas planifiés
        $recentMeals = $plannedMealRepository->createQueryBuilder('pm')
            ->where('pm.user = :user')
            ->setParameter('user', $user)
            ->orderBy('pm.date', 'DESC')
            ->setMaxResults(5)
            ->getQuery()
            ->getResult();

        return $this->json($recentMeals, 200, [], ['groups' => 'meal:read']);
    }

    #[Route('/expiring-items', methods: ['GET'])]
    public function getExpiringItems(StockItemRepository $stockItemRepository): JsonResponse
    {
        /** @var User|null $user */
        $user = $this->getUser();
        
        if (!$user instanceof User) {
            return $this->json(['error' => 'Utilisateur non authentifié'], 401);
        }

        // Récupérer les articles qui expirent dans les 7 prochains jours
        $sevenDaysFromNow = new \DateTime('+7 days');
        $expiringItems = $stockItemRepository->createQueryBuilder('si')
            ->where('si.user = :user')
            ->andWhere('si.expirationDate <= :sevenDaysFromNow')
            ->andWhere('si.expirationDate >= :today')
            ->setParameter('user', $user)
            ->setParameter('sevenDaysFromNow', $sevenDaysFromNow)
            ->setParameter('today', new \DateTime())
            ->orderBy('si.expirationDate', 'ASC')
            ->getQuery()
            ->getResult();

        return $this->json($expiringItems, 200, [], ['groups' => 'stock:read']);
    }
}