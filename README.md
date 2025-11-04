#  MiamPlanner

**MiamPlanner** est une application web pour planifier vos repas, gérer vos recettes, vos ingrédients, votre stock, et générer automatiquement votre liste de courses.  
Le projet est composé d’un **frontend React** et d’un **backend Symfony**.

---

##  Prérequis

Avant de commencer, assurez-vous d’avoir installé :

- [Node.js](https://nodejs.org/) version **18 ou plus**
- [PHP](https://www.php.net/) version **8.2 ou plus**
- [Composer](https://getcomposer.org/)
- [Symfony CLI](https://symfony.com/download)

---

##  Étapes d'installation

```bash
1. Cloner le dépôt
git clone https://github.com/Nahary007/MiamPlanner.git MiamPlanner
cd MiamPlanner
2. Installer le frontend (React)
bash
Copier
Modifier
cd Frontend_planifer_miam
npm install
npm run dev
3. Installer le backend (Symfony)
bash
Copier
Modifier
cd ../backend
composer install
cp .env.example .env
Modifier la ligne suivante dans .env avec vos informations MySQL :

env
Copier
Modifier
DATABASE_URL="mysql://username:password@127.0.0.1:3306/nom_de_la_base"
4. Créer la base de données et exécuter les migrations
bash
Copier
Modifier
php bin/console doctrine:database:create
php bin/console doctrine:migrations:migrate
5. Lancer le serveur Symfony
bash
Copier
Modifier
symfony server:start
🔒Important
⚠️ Avant de modifier ou contribuer au projet, merci de me contacter par email :
📧 toavina.rabenajanaharisoa@gmail.com

