<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Symfony\Component\Security\Core\User\UserInterface;
use Symfony\Component\Security\Core\User\PasswordAuthenticatedUserInterface;

#[ORM\Entity]
#[ORM\Table(name: '`users`')]
class User implements UserInterface, PasswordAuthenticatedUserInterface
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
    private string $password;

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

    // Getters/Setters, UserInterface & PasswordAuthenticatedUserInterface
    public function getId(): ?int
    {
        return $this->id;
    }

    public function getNom(): string
    {
        return $this->nom;
    }

    public function setNom(string $nom): self
    {
        $this->nom = $nom;
        return $this;
    }

    public function getEmail(): string
    {
        return $this->email;
    }

    public function setEmail(string $email): self
    {
        $this->email = $email;
        return $this;
    }

    public function getUserIdentifier(): string
    {
        return (string) $this->email;
    }

    public function getPassword(): string
    {
        return $this->password;
    }

    public function setPassword(string $password): self
    {
        $this->password = $password;
        return $this;
    }

    public function getRoles(): array
    {
        $roles = $this->roles;
        $roles[] = 'ROLE_USER';
        return array_unique($roles);
    }

    public function setRoles(array $roles): self
    {
        $this->roles = $roles;
        return $this;
    }

    public function eraseCredentials(): void
    {
        // Rien à faire ici
    }

    public function getStockItems(): Collection
    {
        return $this->stockItems;
    }

    public function addStockItem(StockItem $stockItem): self
    {
        if (!$this->stockItems->contains($stockItem)) {
            $this->stockItems->add($stockItem);
            $stockItem->setUser($this);
        }
        return $this;
    }

    public function removeStockItem(StockItem $stockItem): self
    {
        if ($this->stockItems->removeElement($stockItem) && $stockItem->getUser() === $this) {
            // $stockItem->setUser(null); // à éviter si nullable=false
        }
        return $this;
    }
}
