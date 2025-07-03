<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;

#[ORM\Entity]
class Ingredient
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    private string $nameIngredient;

    #[ORM\Column(length: 100)]
    private string $unit;

    #[ORM\OneToMany(mappedBy: 'ingredient', targetEntity: IngredientQuantityEntity::class)]
    private Collection $ingredientQuantities;

    #[ORM\OneToMany(mappedBy: 'ingredient', targetEntity: StockItem::class)]
    private Collection $stockItems;

    public function __construct()
    {
        $this->ingredientQuantities = new ArrayCollection();
        $this->stockItems = new ArrayCollection();
    }

    // Getters / Setters ...
}
