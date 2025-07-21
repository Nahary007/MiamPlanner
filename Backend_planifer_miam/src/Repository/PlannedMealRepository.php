<?php

namespace App\Repository;

use App\Entity\PlannelMealEntity;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<PlannelMealEntity>
 */
class PlannedMealRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, PlannelMealEntity::class);
    }

    public function findByUserAndWeek($user, $startDate, $endDate)
    {
        return $this->createQueryBuilder('p')
            ->andWhere('p.user = :user')
            ->andWhere('p.date >= :startDate')
            ->andWhere('p.date <= :endDate')
            ->setParameter('user', $user)
            ->setParameter('startDate', $startDate)
            ->setParameter('endDate', $endDate)
            ->orderBy('p.date', 'ASC')
            ->getQuery()
            ->getResult();
    }
}