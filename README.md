# Preno — agent IA pour commerces locaux — plan de lancement

Nom de marque : **Preno**. Offre : agents IA (prise de RDV, SAV, qualification de leads) pour petits
commerces locaux (salons, artisans, cabinets, restaurants). Revenu = installation ponctuelle + maintenance
mensuelle récurrente.

**Marché cible : Bamako, Mali.** Tarifs en FCFA (pas en euros — le budget de démarrage plus bas reste en
euros car les outils/API sont facturés à l'international, mais l'offre commerciale doit être en FCFA).

**Site en ligne : https://preno.netlify.app**

**Téléphone de contact : +223 70 44 75 82**

## Ce qui existe déjà dans ce dossier

- `index.html` / `css/styles.css` / `js/app.js` — page de présentation commerciale avec une démo
  fonctionnelle **multi-secteurs** : un sélecteur permet de basculer entre 4 agents (salon de coiffure,
  cabinet médical, restaurant, entretien/réparation auto), chacun avec son propre script adapté au métier
  (prise de RDV sur créneau pour salon/cabinet/restaurant, qualification + rappel pour le garage auto).
  Même moteur JS derrière les 4 — un seul fichier (`js/app.js`), une config par métier (objet `NICHES`).
  La démo tourne en pur JS local (aucune clé API nécessaire). C'est l'outil à montrer à un prospect en 2 minutes,
  en sélectionnant l'onglet correspondant à son métier.
- Pour la lancer en local : `py -m http.server 5174` dans ce dossier, puis ouvrir `http://localhost:5174`.
- Pour ajouter un 5e métier : ajouter une entrée dans l'objet `NICHES` de `js/app.js` (voir les 4 existantes
  comme modèle) et un bouton correspondant dans `#nicheTabs` de `index.html`. Coût : quelques minutes, pas
  une reconstruction.

## Le site est en ligne

**Statut (2026-08-23) : déployé sur Netlify Drop, site réclamé (claim) sous le nom `preno` → https://preno.netlify.app**

Décision : démarrage avec le sous-domaine gratuit Netlify. Un vrai domaine (`preno.com`/`preno.fr`,
vérifiés disponibles au moment du choix du nom) sera acheté plus tard, une fois l'activité prend de
l'ampleur (premiers clients signés). Ne pas acheter le domaine avant que ce soit décidé explicitement.

Le dossier est aussi un dépôt git avec un historique de commits. Pour mettre à jour le site en ligne après
une modification locale : refaire un glisser-déposer du dossier entier sur https://app.netlify.com/drop
en étant connecté au même compte Netlify (le nom de site `preno` sera proposé à nouveau automatiquement).

### Déploiement continu — en place depuis le 2026-08-23

Le dépôt local est connecté à **https://github.com/jp-assale/preno** et ce dépôt est lié au site Netlify
`preno`. Chaque `git push` sur `main` republie automatiquement `preno.netlify.app` en 1-2 minutes — plus
besoin de glisser-déposer manuellement.
   Aucune configuration de build nécessaire (site 100% statique, déjà pris en charge par `netlify.toml`).
4. Chaque futur `git push` republie le site automatiquement — plus besoin de glisser-déposer à la main.
5. Le jour où le domaine `preno.com`/`preno.fr` est acheté, il se branche en 2 clics dans Site
   configuration → Domain management, sans redéployer.

### Option B — GitHub + déploiement continu (plus durable, se met à jour tout seul)

1. Créer un dépôt sur https://github.com/new (toi-même, avec ton compte)
2. Dans ce dossier, lier et pousser le dépôt local :
   ```bash
   git remote add origin <URL_DE_TON_DEPOT_GITHUB>
   git branch -M main
   git push -u origin main
   ```
3. Sur https://app.netlify.com (ou https://vercel.com), créer un compte, choisir "Importer un projet depuis
   GitHub", sélectionner ce dépôt. Aucune configuration de build nécessaire (site 100% statique, déjà
   pris en charge par `netlify.toml`).
4. Chaque futur `git push` republie le site automatiquement — pratique quand on ajoutera un 5e métier
   ou qu'on ajustera l'offre.
5. Une fois prêt, on pourra brancher un vrai nom de domaine (~10-15€/an) sur ce même déploiement.

## Différence démo vs produit livré à un client payant

La démo de ce dossier est scriptée (règles + mots-clés), volontairement — pas besoin de clé API pour
la montrer, zéro coût, zéro risque de sécurité. **Le produit livré à un vrai client**, lui, doit être
branché sur :
- Un vrai modèle de langage (API Claude ou équivalent) pour gérer les phrases imprévues.
- Un vrai agenda (Google Calendar, Calendly, ou logiciel métier du client).
- Un vrai canal (widget sur le site du client, WhatsApp Business, SMS).
- Un orchestrateur no-code (n8n ou Make) pour relier tout ça sans réécrire un backend à chaque fois.

## Budget de démarrage (tu as indiqué avoir un budget à investir)

| Poste | Coût indicatif | Notes |
|---|---|---|
| n8n (self-host sur petit VPS) | ~5-10 €/mois | Alternative : n8n Cloud ~20-50 €/mois si tu ne veux pas gérer de serveur |
| API modèle de langage (Claude/GPT) | ~10-30 €/mois au début | Facturé à l'usage, monte avec le nombre de clients actifs |
| WhatsApp Business API / Twilio | ~15-25 €/mois | Nécessaire si tu vends le canal WhatsApp/SMS (très demandé par les artisans) |
| Nom de domaine pour ce site | ~10-15 €/an | ex : preno.com — plus crédible qu'un sous-domaine gratuit une fois l'activité lancée |
| Hébergement du site vitrine | Gratuit (Netlify/Vercel/GitHub Pages) | Le site est 100% statique, aucun serveur nécessaire |

Total pour démarrer : **environ 50-100 €** le premier mois, avant le premier client signé.

## Plan des 30 premiers jours

1. **Semaine 1** — Déployer ce site sur un vrai domaine. Enregistrer un compte n8n. La démo couvre déjà
   4 métiers (salon, cabinet, restaurant, artisan) : pas besoin de choisir une seule niche pour démarcher,
   tu adaptes l'onglet montré selon le prospect en face de toi.
2. **Semaine 2** — Démarcher 15-20 commerces locaux, tous secteurs confondus au départ (voir scripts
   ci-dessous), en montrant l'onglet du bon métier à chaque fois. Objectif : 3-5 appels de 15 minutes
   avec démo à l'appui. Le ou les secteurs qui répondent le mieux deviennent ta priorité pour la suite —
   laisse le marché trancher plutôt que de deviner à l'avance.
3. **Semaine 3** — Dès qu'un prospect est chaud : construire pour lui le premier agent réel (n8n + API
   Claude + son agenda réel), à partir du script de sa niche déjà écrit dans la démo.
4. **Semaine 4** — Signer et livrer ce premier client sur l'offre installation + maintenance. Documenter
   le processus pour le répéter plus vite avec le client suivant, y compris dans une autre niche.

## Trouver 15-20 prospects à Bamako

Méthode simple sans outil payant : sur Google Maps, recherche par catégorie + "Bamako" (ex : "salon de
coiffure Bamako", "restaurant Bamako", "cabinet dentaire Bamako", "plombier Bamako", "électricien Bamako").
Pour chaque résultat pertinent, note : nom du commerce, quartier, numéro de téléphone (souvent aussi le
numéro WhatsApp), et s'il y a un compte Facebook/Instagram actif. Vise un mélange des 4 secteurs déjà
couverts par la démo plutôt que de tout miser sur un seul, pour voir lequel répond le mieux (voir semaine 2
du plan plus haut). Une feuille de calcul simple (nom, secteur, téléphone, statut du contact, date de
relance) suffit pour suivre l'avancement.

## Scripts de prospection

**Canal principal recommandé : WhatsApp**, pas l'email — c'est là que les commerçants à Bamako sont le
plus facilement joignables et réactifs. Utilise le numéro relevé sur Google Maps ou la fiche
Facebook/Instagram du commerce.

### Message WhatsApp (premier contact)
```
Bonjour, je m'appelle [Ton prénom]. Je remarque que [Nom du commerce] doit recevoir beaucoup d'appels
pour des demandes de rendez-vous. Je mets en place des agents IA qui répondent 24/7 à la place du
téléphone : ils comprennent la demande, proposent des créneaux et prennent le rendez-vous directement
dans l'agenda — même le soir ou le week-end.

J'ai une courte démo à vous montrer (2 minutes), sans engagement : [lien preno.netlify.app]

Ça vous intéresse d'en discuter ?
```

### Relance WhatsApp (si pas de réponse après 3-4 jours)
```
Bonjour [Prénom], je me permets de relancer mon message d'il y a quelques jours au sujet de l'agent IA
pour [Nom du commerce]. Si ce n'est pas le bon moment, aucun souci, dites-le-moi simplement. Sinon la
démo prend 2 minutes : [lien preno.netlify.app]
```

### Email à froid (si l'email est plus adapté pour ce contact)
```
Objet : Un agent qui répond au téléphone pour [Nom du commerce]

Bonjour [Prénom],

Je remarque que [Nom du commerce] doit recevoir beaucoup d'appels pour des demandes de rendez-vous.
Je mets en place des agents IA qui répondent 24/7 à la place du téléphone : ils comprennent la demande,
proposent des créneaux et prennent le rendez-vous directement dans l'agenda — sans qu'un client tombe
sur un répondeur.

J'ai une démo de 2 minutes à vous montrer, sans engagement. Un créneau de 15 min cette semaine ?

[Ton prénom]
```

## Prochaine étape technique concrète

Le prochain vrai palier de travail (à faire quand tu es prêt) : brancher un premier agent réel sur n8n +
API Claude + Google Calendar pour ta niche choisie, au lieu de la version scriptée de démo. Dis-le moi
et on le construit ensemble.
