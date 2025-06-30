<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity]
class IngredientQuantityEntity
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column]
    private float $quantity;

    #[ORM\ManyToOne(inversedBy: 'ingredientQuantities')]
    #[ORM\JoinColumn(nullable: false)]
    private Recipe $recipe;

    #[ORM\ManyToOne(inversedBy: 'ingredientQuantities')]
    #[ORM\JoinColumn(nullable: false)]
    private Ingredient $ingredient;

    // Getters / Setters ...
}
