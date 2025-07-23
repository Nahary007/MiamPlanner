<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20250723145634 extends AbstractMigration
{
    public function getDescription(): string
    {
        return 'Make expiration_date nullable in stock_item table';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE stock_item ALTER ingredient_id DROP NOT NULL');
        $this->addSql('ALTER TABLE stock_item ALTER expiration_date DROP NOT NULL');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE SCHEMA public');
        $this->addSql('ALTER TABLE stock_item ALTER ingredient_id SET NOT NULL');
        $this->addSql('ALTER TABLE stock_item ALTER expiration_date SET NOT NULL');
    }
}