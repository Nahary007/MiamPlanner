<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity]
class StockItem
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\ManyToOne(inversedBy: 'stockItems')]
    #[ORM\JoinColumn(nullable: false)]
    private User $user;

    #[ORM\ManyToOne(inversedBy: 'stockItems')]
    #[ORM\JoinColumn(nullable: false)]
    private Ingredient $ingredient;

    #[ORM\Column]
    private float $quantity;

    #[ORM\Column(length: 100)]
    private string $unit;

    #[ORM\Column(type: 'datetime')]
    private \DateTimeInterface $expirationDate;

    // Getters / Setters ...
}
