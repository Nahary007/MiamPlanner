<?php

namespace App\Repository;

use App\Entity\IngredientQuantityEntity;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<IngredientQuantityEntity>
 */
class IngredientQuantityEntityRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, IngredientQuantityEntity::class);
    }

    // Exemple de méthode personnalisée :
    public function findByRecipeId(int $recipeId): array
    {
        return $this->createQueryBuilder('iq')
            ->andWhere('iq.recipe = :recipeId')
            ->setParameter('recipeId', $recipeId)
            ->getQuery()
            ->getResult();
    }
}
