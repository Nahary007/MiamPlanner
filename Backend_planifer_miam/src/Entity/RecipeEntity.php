<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;

#[ORM\Entity]
class Recipe
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    private string $nameRecipe;

    #[ORM\Column(type: 'text')]
    private string $description;

    #[ORM\Column(type: 'text')]
    private string $instructions;

    #[ORM\Column]
    private int $servings;

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

    // Getters / Setters ...
}
