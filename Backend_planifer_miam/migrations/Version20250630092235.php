<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20250630092235 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE ingredient (id SERIAL NOT NULL, name_ingredient VARCHAR(255) NOT NULL, unit VARCHAR(100) NOT NULL, PRIMARY KEY(id))');
        $this->addSql('CREATE TABLE ingredient_quantity_entity (id SERIAL NOT NULL, recipe_id INT NOT NULL, ingredient_id INT NOT NULL, quantity DOUBLE PRECISION NOT NULL, PRIMARY KEY(id))');
        $this->addSql('CREATE INDEX IDX_99410D9559D8A214 ON ingredient_quantity_entity (recipe_id)');
        $this->addSql('CREATE INDEX IDX_99410D95933FE08C ON ingredient_quantity_entity (ingredient_id)');
        $this->addSql('CREATE TABLE plannel_meal_entity (id SERIAL NOT NULL, user_id INT NOT NULL, recipe_id INT NOT NULL, date DATE NOT NULL, meal_type VARCHAR(100) NOT NULL, PRIMARY KEY(id))');
        $this->addSql('CREATE INDEX IDX_C3446CE5A76ED395 ON plannel_meal_entity (user_id)');
        $this->addSql('CREATE INDEX IDX_C3446CE559D8A214 ON plannel_meal_entity (recipe_id)');
        $this->addSql('CREATE TABLE recipe (id SERIAL NOT NULL, name_recipe VARCHAR(255) NOT NULL, description TEXT NOT NULL, instructions TEXT NOT NULL, servings INT NOT NULL, PRIMARY KEY(id))');
        $this->addSql('CREATE TABLE user_recipe (recipe_id INT NOT NULL, user_id INT NOT NULL, PRIMARY KEY(recipe_id, user_id))');
        $this->addSql('CREATE INDEX IDX_BFDAAA0A59D8A214 ON user_recipe (recipe_id)');
        $this->addSql('CREATE INDEX IDX_BFDAAA0AA76ED395 ON user_recipe (user_id)');
        $this->addSql('CREATE TABLE stock_item (id SERIAL NOT NULL, user_id INT NOT NULL, ingredient_id INT NOT NULL, quantity DOUBLE PRECISION NOT NULL, unit VARCHAR(100) NOT NULL, expiration_date TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL, PRIMARY KEY(id))');
        $this->addSql('CREATE INDEX IDX_6017DDAA76ED395 ON stock_item (user_id)');
        $this->addSql('CREATE INDEX IDX_6017DDA933FE08C ON stock_item (ingredient_id)');
        $this->addSql('CREATE TABLE "user" (id SERIAL NOT NULL, nom VARCHAR(255) NOT NULL, email VARCHAR(255) NOT NULL, password VARCHAR(255) NOT NULL, roles JSON NOT NULL, PRIMARY KEY(id))');
        $this->addSql('CREATE UNIQUE INDEX UNIQ_8D93D649E7927C74 ON "user" (email)');
        $this->addSql('ALTER TABLE ingredient_quantity_entity ADD CONSTRAINT FK_99410D9559D8A214 FOREIGN KEY (recipe_id) REFERENCES recipe (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE ingredient_quantity_entity ADD CONSTRAINT FK_99410D95933FE08C FOREIGN KEY (ingredient_id) REFERENCES ingredient (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE plannel_meal_entity ADD CONSTRAINT FK_C3446CE5A76ED395 FOREIGN KEY (user_id) REFERENCES "user" (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE plannel_meal_entity ADD CONSTRAINT FK_C3446CE559D8A214 FOREIGN KEY (recipe_id) REFERENCES recipe (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE user_recipe ADD CONSTRAINT FK_BFDAAA0A59D8A214 FOREIGN KEY (recipe_id) REFERENCES recipe (id) ON DELETE CASCADE NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE user_recipe ADD CONSTRAINT FK_BFDAAA0AA76ED395 FOREIGN KEY (user_id) REFERENCES "user" (id) ON DELETE CASCADE NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE stock_item ADD CONSTRAINT FK_6017DDAA76ED395 FOREIGN KEY (user_id) REFERENCES "user" (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE stock_item ADD CONSTRAINT FK_6017DDA933FE08C FOREIGN KEY (ingredient_id) REFERENCES ingredient (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE SCHEMA public');
        $this->addSql('ALTER TABLE ingredient_quantity_entity DROP CONSTRAINT FK_99410D9559D8A214');
        $this->addSql('ALTER TABLE ingredient_quantity_entity DROP CONSTRAINT FK_99410D95933FE08C');
        $this->addSql('ALTER TABLE plannel_meal_entity DROP CONSTRAINT FK_C3446CE5A76ED395');
        $this->addSql('ALTER TABLE plannel_meal_entity DROP CONSTRAINT FK_C3446CE559D8A214');
        $this->addSql('ALTER TABLE user_recipe DROP CONSTRAINT FK_BFDAAA0A59D8A214');
        $this->addSql('ALTER TABLE user_recipe DROP CONSTRAINT FK_BFDAAA0AA76ED395');
        $this->addSql('ALTER TABLE stock_item DROP CONSTRAINT FK_6017DDAA76ED395');
        $this->addSql('ALTER TABLE stock_item DROP CONSTRAINT FK_6017DDA933FE08C');
        $this->addSql('DROP TABLE ingredient');
        $this->addSql('DROP TABLE ingredient_quantity_entity');
        $this->addSql('DROP TABLE plannel_meal_entity');
        $this->addSql('DROP TABLE recipe');
        $this->addSql('DROP TABLE user_recipe');
        $this->addSql('DROP TABLE stock_item');
        $this->addSql('DROP TABLE "user"');
    }
}
