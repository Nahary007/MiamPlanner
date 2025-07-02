<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Symfony\Component\Security\Core\User\PasswordAuthenticatedUserInterface;

#[ORM\Entity]
#[ORM\Table(name: '`users`')]
class User implements PasswordAuthenticatedUserInterface
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    private string $nom;

    #[ORM\Column(length: 255, unique: true)]
    private string $email;

    #[ORM\Column(length: 255)]
    private string $password; // mot de passe hashé

    #[ORM\Column(type: 'json')]
    private array $roles = [];

    #[ORM\ManyToMany(targetEntity: Recipe::class, mappedBy: 'users')]
    private Collection $recipes;

    #[ORM\OneToMany(mappedBy: 'user', targetEntity: StockItem::class)]
    private Collection $stockItems;

    #[ORM\OneToMany(mappedBy: 'user', targetEntity: PlannelMealEntity::class)]
    private Collection $plannelMeals;

    public function __construct()
    {
        $this->recipes = new ArrayCollection();
        $this->stockItems = new ArrayCollection();
        $this->plannelMeals = new ArrayCollection();
    }

    // Getters et Setters

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getNom(): string
    {
        return $this->nom;
    }

    public function setNom(string $nom): static
    {
        $this->nom = $nom;
        return $this;
    }

    public function getEmail(): string
    {
        return $this->email;
    }

    public function setEmail(string $email): static
    {
        $this->email = $email;
        return $this;
    }

    public function getPassword(): string
    {
        return $this->password;
    }

    public function setPassword(string $password): static
    {
        $this->password = $password;
        return $this;
    }

    public function getRoles(): array
    {
        $roles = $this->roles;
        // Garantit que chaque utilisateur a au moins le rôle ROLE_USER
        $roles[] = 'ROLE_USER';
        return array_unique($roles);
    }

    public function setRoles(array $roles): static
    {
        $this->roles = $roles;
        return $this;
    }

    /**
     * @return Collection<int, Recipe>
     */
    public function getRecipes(): Collection
    {
        return $this->recipes;
    }

    public function addRecipe(Recipe $recipe): static
    {
        if (!$this->recipes->contains($recipe)) {
            $this->recipes->add($recipe);
        }
        return $this;
    }

    public function removeRecipe(Recipe $recipe): static
    {
        $this->recipes->removeElement($recipe);
        return $this;
    }

    /**
     * @return Collection<int, StockItem>
     */
    public function getStockItems(): Collection
    {
        return $this->stockItems;
    }

    public function addStockItem(StockItem $stockItem): static
    {
        if (!$this->stockItems->contains($stockItem)) {
            $this->stockItems->add($stockItem);
            $stockItem->setUser($this);
        }
        return $this;
    }

    public function removeStockItem(StockItem $stockItem): static
    {
        if ($this->stockItems->removeElement($stockItem)) {
            // Définit le côté propriétaire à null (sauf si déjà changé)
            if ($stockItem->getUser() === $this) {
                // Supposons que setUser accepte null, sinon il faut adapter
                // $stockItem->setUser(null);
            }
        }
        return $this;
    }

    /**
     * @return Collection<int, PlannelMealEntity>
     */
    public function getPlannelMeals(): Collection
    {
        return $this->plannelMeals;
    }

    public function addPlannelMeal(PlannelMealEntity $plannelMeal): static
    {
        if (!$this->plannelMeals->contains($plannelMeal)) {
            $this->plannelMeals->add($plannelMeal);
            $plannelMeal->setUser($this);
        }
        return $this;
    }

    // public function removePlannelMeal(PlannelMealEntity $plannelMeal): static
    // {
    //     if ($this->plannelMeals->removeElement($plannelMeal)) {
    //         // Définit le côté propriétaire à null (sauf si déjà changé)
    //         if ($plannelMeal->getUser() === $this) {
    //             $plannelMeal->setUser(null);
    //         }
    //     }
    //     return $this;
    // }
}