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

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getQuantity(): float
    {
        return $this->quantity;
    }

    public function setQuantity(float $quantity): self
    {
        $this->quantity = $quantity;
        return $this;
    }

    public function getRecipe(): Recipe
    {
        return $this->recipe;
    }

    public function setRecipe(Recipe $recipe): self
    {
        $this->recipe = $recipe;
        return $this;
    }

    public function getIngredient(): Ingredient
    {
        return $this->ingredient;
    }

    public function setIngredient(Ingredient $ingredient): self
    {
        $this->ingredient = $ingredient;
        return $this;
    }
}
