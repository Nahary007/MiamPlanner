<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Symfony\Component\Serializer\Annotation\Groups;

#[ORM\Entity]
class Recipe
{
    #[Groups(['recipe:read', 'meal:read'])]
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[Groups(['recipe:read', 'meal:read'])]
    #[ORM\Column(length: 255)]
    private string $nameRecipe;

    #[Groups(['recipe:read', 'meal:read'])]
    #[ORM\Column(type: 'text')]
    private string $description;

    #[Groups(['recipe:read', 'meal:read'])]
    #[ORM\Column(type: 'text')]
    private string $instructions;

    #[Groups(['recipe:read', 'meal:read'])]
    #[ORM\Column]
    private int $servings;

    #[Groups(['recipe:read'])] // <-- Tu peux ajouter 'meal:read' ici si tu veux afficher les ingrédients dans le planning
    #[ORM\OneToMany(mappedBy: 'recipe', targetEntity: IngredientQuantityEntity::class, cascade: ['persist', 'remove'])]
    private Collection $ingredientQuantities;

    #[ORM\ManyToMany(targetEntity: User::class, inversedBy: 'recipes')]
    #[ORM\JoinTable(name: 'user_recipe')]
    private Collection $users;

    #[ORM\OneToMany(mappedBy: 'recipe', targetEntity: PlannelMealEntity::class)]
    private Collection $plannelMeals;

    public function __construct()
    {
        $this->ingredientQuantities = new ArrayCollection();
        $this->users = new ArrayCollection();
        $this->plannelMeals = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getNameRecipe(): string
    {
        return $this->nameRecipe;
    }

    public function setNameRecipe(string $nameRecipe): self
    {
        $this->nameRecipe = $nameRecipe;
        return $this;
    }

    public function getDescription(): string
    {
        return $this->description;
    }

    public function setDescription(string $description): self
    {
        $this->description = $description;
        return $this;
    }

    public function getInstructions(): string
    {
        return $this->instructions;
    }

    public function setInstructions(string $instructions): self
    {
        $this->instructions = $instructions;
        return $this;
    }

    public function getServings(): int
    {
        return $this->servings;
    }

    public function setServings(int $servings): self
    {
        $this->servings = $servings;
        return $this;
    }

    /**
     * @return Collection<int, IngredientQuantityEntity>
     */
    public function getIngredientQuantities(): Collection
    {
        return $this->ingredientQuantities;
    }

    public function addIngredientQuantity(IngredientQuantityEntity $ingredientQuantity): self
    {
        if (!$this->ingredientQuantities->contains($ingredientQuantity)) {
            $this->ingredientQuantities->add($ingredientQuantity);
            $ingredientQuantity->setRecipe($this);
        }

        return $this;
    }

    public function removeIngredientQuantity(IngredientQuantityEntity $ingredientQuantity): self
    {
        if ($this->ingredientQuantities->removeElement($ingredientQuantity)) {
            if ($ingredientQuantity->getRecipe() === $this) {
                $ingredientQuantity->setRecipe(null);
            }
        }

        return $this;
    }
}
