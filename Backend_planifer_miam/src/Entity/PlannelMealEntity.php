<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;

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

    #[ORM\ManyToOne(inversedBy: 'plannelMeals')]
    #[ORM\JoinColumn(nullable: false)]
    private Recipe $recipe;

    #[ORM\Column(type: 'date')]
    private \DateTimeInterface $date;

    #[ORM\Column(length: 100)]
    private string $mealType; // Exemple: Breakfast, Lunch, Dinner

    // Getters / Setters ...
}
