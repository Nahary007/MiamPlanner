<?php

namespace App\Controller;

use App\Entity\StockItem;
use App\Repository\StockItemRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;

#[Route('/api/stock')]
class StockItemController extends AbstractController
{
    #[Route('', methods: ['GET'])]
    public function getAll(StockItemRepository $stockItemRepository): JsonResponse
    {
        $user = $this->getUser();
        $items = $stockItemRepository->findBy(['user' => $user]);

        return $this->json($items, 200, [], ['groups' => 'stock:read']);
    }

    #[Route('', methods: ['POST'])]
    public function create(Request $request, EntityManagerInterface $em): JsonResponse
    {
        $data = json_decode($request->getContent(), true);
        $user = $this->getUser();

        $item = new StockItem();
        $item->setName($data['name'] ?? '');
        $item->setQuantity($data['quantity'] ?? 0);
        $item->setUser($user);

        $em->persist($item);
        $em->flush();

        return $this->json($item, 201, [], ['groups' => 'stock:read']);
    }
}
