<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

#[ORM\Entity]
class PlannelMealEntity
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\ManyToOne(inversedBy: 'plannelMeals')]
    #[ORM\JoinColumn(nullable: false)]
    private User $user;

    #[Groups(['meal:read'])]
    #[ORM\ManyToOne(inversedBy: 'plannelMeals')]
    #[ORM\JoinColumn(nullable: false)]
    private Recipe $recipe;

    #[Groups(['meal:read'])]
    #[ORM\Column(type: 'date')]
    private \DateTimeInterface $date;

    #[Groups(['meal:read'])]
    #[ORM\Column(length: 100)]
    private string $mealType; // Exemple: Breakfast, Lunch, Dinner

    // Getters / Setters ...

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getUser(): User
    {
        return $this->user;
    }

    public function setUser(User $user): self
    {
        $this->user = $user;
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

    public function getDate(): \DateTimeInterface
    {
        return $this->date;
    }

    public function setDate(\DateTimeInterface $date): self
    {
        $this->date = $date;
        return $this;
    }

    public function getMealType(): string
    {
        return $this->mealType;
    }

    public function setMealType(string $mealType): self
    {
        $this->mealType = $mealType;
        return $this;
    }

}
