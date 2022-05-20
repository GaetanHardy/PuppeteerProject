# PuppeteerProject

Pour installer les dépendances : `yarn` 
Pour lancer le programme : `node index.js`

Trello du projet : https://trello.com/b/4JMEhTfo/m08

<h1> But du projet </h1>
L'objectif du projet est de pouvoir récupérer des adresses de service présentes sur un nombre de sites web définis par l'utilisateur et regrouper les adresses récupérées en fonction de leur site d'origine.

<h2> Technologies utilisées </h2>
- Puppeteer
- Node.js
- Express JS
- excel4node

<h2> Fonctionnement </h2>
Ce projet repose sur un système d'API permettant d'appeler les fonctions via un navigateur en passant les paramètres directement dans l'URL. On peut interagir avec le programme par le biais d'une API web, on peut passer le nombre de sites à "scraper" et les mots-clés de recherche en paramètre dans l'URL
