# Agent IA pour commerces locaux — plan de lancement

Offre : agents IA (prise de RDV, SAV, qualification de leads) pour petits commerces locaux
(salons, artisans, cabinets, restaurants). Revenu = installation ponctuelle + maintenance mensuelle récurrente.

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
| Nom de domaine pour ce site | ~10-15 €/an | ex : tonagence.fr — plus crédible qu'un lien localhost pour démarcher |
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
