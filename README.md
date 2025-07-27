Pré-requis:

Node.js >= 18

PHP >= 8.2

Composer

Symfony cli

Quelque étape pour le projet:

git clone https://github.com/Nahary007/MiamPlanner.git MiamPlanner

cd Frontend_planifer_miam

npm install

npm run dev

cd backend

composer install

cp .env.example .env

Editer .env

DATABASE_URL="mysql://username:password@127.0.0.1:3306/nom_de_la_base"

Créer la base de données

php bin/console doctrine:database:create

php bin/console doctrine:migrations:migrate

symfony server:start

N.B : Avant de toucher quelque chose, veuillez me contacter par email : toavina.rabenajanaharisoa@gmail.com
