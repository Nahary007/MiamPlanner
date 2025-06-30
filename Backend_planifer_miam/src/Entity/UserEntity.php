<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;

#[ORM\Entity]
class User
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

    // Getters / Setters ...
}
