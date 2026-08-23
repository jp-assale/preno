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
  cabinet médical, restaurant, artisan/plombier), chacun avec son propre script adapté au métier
  (prise de RDV sur créneau pour salon/cabinet/restaurant, qualification + rappel pour l'artisan).
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

### Passer en déploiement continu plus tard (optionnel, plus confortable)

1. Créer un dépôt sur https://github.com/new (toi-même, avec ton compte)
2. Dans ce dossier, lier et pousser le dépôt local :
   ```bash
   git remote add origin <URL_DE_TON_DEPOT_GITHUB>
   git branch -M main
   git push -u origin main
   ```
3. Dans les paramètres du site `preno` sur Netlify, choisir "Link repository" / connecter ce dépôt GitHub.
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

## Scripts de prospection

### Email à froid
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

### Message court (Instagram/LinkedIn/DM)
```
Bonjour [Prénom], j'aide les [type de commerce] à ne plus rater d'appels grâce à un agent IA qui prend
les rendez-vous à leur place, même le soir et le week-end. Je peux vous montrer une démo de 2 min si ça
vous intéresse ?
```

### Relance (si pas de réponse après 4-5 jours)
```
Objet : Petite relance — agent IA pour [Nom du commerce]

Bonjour [Prénom], je me permets de relancer mon message d'il y a quelques jours. Si ce n'est pas le bon
moment, aucun souci — dites-moi simplement et je ne vous solliciterai plus. Sinon, la démo prend 2 minutes :
[lien vers le site].
```

## Prochaine étape technique concrète

Le prochain vrai palier de travail (à faire quand tu es prêt) : brancher un premier agent réel sur n8n +
API Claude + Google Calendar pour ta niche choisie, au lieu de la version scriptée de démo. Dis-le moi
et on le construit ensemble.
