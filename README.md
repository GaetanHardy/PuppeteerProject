# PuppeteerProject

Trello du projet : https://trello.com/b/4JMEhTfo/m08

## But du projet

L'objectif du projet est de pouvoir récupérer des adresses de service présentes sur un nombre de sites web définis par l'utilisateur et regrouper les adresses récupérées en fonction de leur site d'origine.

### Technologies utilisées 
- Puppeteer </br>
- Node.js </br>
- Express JS </br>
- excel4node

### Fonctionnement 
Ce projet repose sur un système d'API permettant d'appeler les fonctions via un navigateur en passant les paramètres directement dans l'URL. On peut interagir avec le programme par le biais d'une API web, on peut passer le nombre de sites à "scraper" et les mots-clés de recherche en paramètre dans l'URL

## Comment lancer le projet

Pour lancer le projet, il faut avoir node.js d'installer sur son ordinateur (https://nodejs.org/en/download/)

Il faut installer yarn pour cela dans un invite de commande faite :
- npm install --global yarn

Ensuite dans le projet **back**, dans un invite de commande, taper :
- npm install (cela créer le répertoire node_module)
- npm run dev (lance l'api)

Enfin dans le projet **front**, dans un invite de commande taper :
- yarn (cela créer le répertoire node_modules)
- quasar dev (cela lance un site web sur le port 8080)

PS: lorsque vous ecrivez les commandes pour la back et le front, lancer le bien dans leur repertoire respectif
