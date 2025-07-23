<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Symfony\Component\Serializer\Annotation\Groups;

#[ORM\Entity]
class Ingredient
{
    #[Groups(['ingredient:read', 'recipe:read'])]
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[Groups(['ingredient:read', 'recipe:read'])]
    #[ORM\Column(length: 255)]
    private string $nameIngredient;

    #[Groups(['ingredient:read', 'recipe:read'])]
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

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getNameIngredient(): string
    {
        return $this->nameIngredient;
    }

    public function setNameIngredient(string $nameIngredient): self
    {
        $this->nameIngredient = $nameIngredient;
        return $this;
    }

    public function getUnit(): string
    {
        return $this->unit;
    }

    public function setUnit(string $unit): self
    {
        $this->unit = $unit;
        return $this;
    }

    public function getIngredientQuantities(): Collection
    {
        return $this->ingredientQuantities;
    }

    public function addIngredientQuantity(IngredientQuantityEntity $ingredientQuantity): self
    {
        if (!$this->ingredientQuantities->contains($ingredientQuantity)) {
            $this->ingredientQuantities->add($ingredientQuantity);
            $ingredientQuantity->setIngredient($this);
        }
        return $this;
    }

    public function removeIngredientQuantity(IngredientQuantityEntity $ingredientQuantity): self
    {
        if ($this->ingredientQuantities->removeElement($ingredientQuantity)) {
            if ($ingredientQuantity->getIngredient() === $this) {
                $ingredientQuantity->setIngredient(null);
            }
        }
        return $this;
    }

    public function getStockItems(): Collection
    {
        return $this->stockItems;
    }

    public function addStockItem(StockItem $stockItem): self
    {
        if (!$this->stockItems->contains($stockItem)) {
            $this->stockItems->add($stockItem);
            $stockItem->setIngredient($this);
        }
        return $this;
    }

    public function removeStockItem(StockItem $stockItem): self
    {
        if ($this->stockItems->removeElement($stockItem)) {
            if ($stockItem->getIngredient() === $this) {
                $stockItem->setIngredient(null);
            }
        }
        return $this;
    }
}
