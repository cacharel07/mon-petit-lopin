# Mon petit lopin

Application web personnelle pour suivre l'aménagement et l'entretien de mon extérieur :
travaux, arbres, calendriers d'entretien et journal des interventions.

## Fonctionnalités

- **Tableau de bord** : tâches en retard, de la semaine et du mois (tailles, arrosages,
  traitements, récoltes, tâches de travaux), bouton « Fait », travaux en cours.
- **Arbres** : fiche complète, photos de suivi, journal des interventions, calendrier
  d'entretien hérité d'un modèle d'espèce et personnalisable arbre par arbre.
- **Catalogue intégré** d'une trentaine d'espèces (fruitiers, fruits à coque, petits fruits,
  ornementaux, haies) adaptées à 850 m : à la création d'un arbre, on choisit l'espèce et la fiche
  est préremplie (variétés et porte-greffes proposés, alerte si l'espèce est risquée en altitude).
- **Modèles d'espèces** : règles d'entretien (période, fréquence, âge), marquées « à vérifier »
  tant qu'elles ne sont pas validées.
- **Travaux** : liste filtrable, Kanban, checklist, photos avant / pendant / après, budget.
- **Zones** du terrain.
- **Export** (menu Plus) : archive ZIP (JSON + CSV + photos), JSON seul ou CSV par table.

Stack : SvelteKit 3 (adapter-node) · SQLite (better-sqlite3) · Drizzle ORM · sharp · Vitest.

## Prérequis

- Node.js ≥ 22.18 (exécution native des scripts TypeScript)
- npm

## Installation

```bash
npm install
cp .env.example .env
npm run hash-password -- 'mon mot de passe'   # copier la valeur dans ADMIN_PASSWORD_HASH
npm run db:seed                                 # données initiales (une seule fois, base vide)
```

Variables d'environnement (`.env`) :

| Variable              | Défaut          | Rôle                                                     |
| --------------------- | --------------- | -------------------------------------------------------- |
| `DATABASE_URL`        | `data/lopin.db` | Fichier SQLite                                           |
| `PHOTOS_DIR`          | `data/photos`   | Dossier des photos téléversées                           |
| `ADMIN_USERNAME`      | `admin`         | Identifiant du compte unique                             |
| `ADMIN_PASSWORD_HASH` | —               | Hash du mot de passe (`npm run hash-password`)           |
| `BODY_SIZE_LIMIT`     | `512K`          | Taille max d'un envoi : **mettre `50M`** pour les photos |

## Lancement en développement

```bash
npm run dev
```

L'app est servie sur http://localhost:5173. Les migrations sont appliquées automatiquement au démarrage.

## Scripts utiles

| Commande              | Rôle                                                                       |
| --------------------- | -------------------------------------------------------------------------- |
| `npm test`            | Tests unitaires (Vitest)                                                   |
| `npm run check`       | Vérification TypeScript / Svelte                                           |
| `npm run format`      | Formatage Prettier                                                         |
| `npm run db:seed`     | Insère les données initiales (refuse si la base contient déjà des données) |
| `npm run db:generate` | Génère une migration après modification du schéma                          |
| `npm run db:studio`   | Explore la base avec Drizzle Studio                                        |
| `npm run build`       | Build de production dans `build/`                                          |
| `npm start`           | Lance le build de production (lit `.env` s'il existe)                      |

## Déploiement

L'app est un simple processus Node qui écrit dans un dossier `data/` (base SQLite + photos).
Tout ce qu'il faut sauvegarder se trouve dans ce dossier.

### alwaysdata

La session SSH d'alwaysdata n'a pas assez de mémoire pour `npm ci` ni `vite build`. L'app est
donc **compilée par GitHub** : à chaque push sur `main`, le workflow
`.github/workflows/release.yml` installe, teste, compile et publie une copie prête à lancer
(build, migrations, scripts et dépendances de production) sur la branche **`deploy`**. Le serveur
ne fait que récupérer cette branche.

**Première installation** (dans le clone du dépôt sur le serveur) :

```bash
cd ~/www/mon-petit-lopin
git fetch --depth 1 origin deploy
git checkout -f -B deploy FETCH_HEAD
```

Puis créer `.env` (voir plus haut) avec en plus :

```
ORIGIN=https://mon-petit-lopin.alwaysdata.net
BODY_SIZE_LIMIT=50M
```

`ORIGIN` est nécessaire derrière le proxy HTTPS de l'hébergeur (protection CSRF des formulaires et
cookies `secure`). Ensuite :

Première installation : se connecter à l'app, puis **Plus → Importer les données initiales**
(le bouton n'apparaît que si la base est vide). `npm run db:seed` fait la même chose en ligne de
commande, mais la session SSH d'alwaysdata n'a pas assez de mémoire pour le lancer.

Configuration du site (Web → Sites) : type **Node.js**, commande `npm start`, répertoire de
travail `/home/<compte>/www/mon-petit-lopin`, Node.js 24. alwaysdata fournit `HOST` et `PORT`,
lus automatiquement par adapter-node.

**Mise à jour automatique** : le script `scripts/auto-update.sh` récupère la branche `deploy` si
elle a changé, l'installe et redémarre le site. Il ne fait rien s'il n'y a pas de nouvelle version.

1. Dans l'admin alwaysdata, créer un token d'API (Profil → Gestion des tokens), puis ajouter au
   `.env` :
   ```
   ALWAYSDATA_API_KEY=le-token
   ALWAYSDATA_ACCOUNT=mon-petit-lopin
   ALWAYSDATA_SITE_ID=123456
   ```
   L'identifiant du site est le nombre visible dans l'URL de la page du site dans l'admin
   (Web → Sites → modifier).
2. Tester une fois à la main : `sh scripts/update.sh` doit afficher « Mis à jour et site
   redémarré ».
3. Créer une tâche planifiée (Avancé → Tâches planifiées) : type « Commande », commande
   `sh /home/mon-petit-lopin/www/mon-petit-lopin/scripts/auto-update.sh`, fréquence
   `*/15 * * * *` (toutes les 15 minutes).

Sans les variables d'API, la mise à jour se fait quand même, mais il faut redémarrer le site à la
main.

**Accès au dépôt privé sans mot de passe (clé de déploiement)** : la tâche planifiée tourne sans
personne pour taper un mot de passe ou un code 2FA. Le serveur utilise donc une clé SSH en lecture
seule, propre à ce dépôt (même principe que pour RR43 Tournament). Une seule fois, en SSH sur le
serveur :

```bash
ssh-keygen -t ed25519 -N "" -C "alwaysdata-mon-petit-lopin" -f ~/.ssh/github_deploy
printf 'Host github.com\n  IdentityFile ~/.ssh/github_deploy\n  IdentitiesOnly yes\n' >> ~/.ssh/config
ssh-keyscan github.com >> ~/.ssh/known_hosts
cat ~/.ssh/github_deploy.pub
```

Sur GitHub, dans le dépôt : _Settings_ → _Deploy keys_ → _Add deploy key_, coller la clé publique,
**sans** cocher « Allow write access ». Puis, sur le serveur :

```bash
cd ~/www/mon-petit-lopin
git remote set-url origin git@github.com:cacharel07/mon-petit-lopin.git
git fetch --depth 1 origin deploy   # ne doit rien demander
```

GitHub n'accepte pas la même clé de déploiement sur deux dépôts : il faut bien une nouvelle clé,
pas celle de RR43 Tournament.

### VPS (alternative)

Même principe : `npm ci && npm run build`, puis lancer `npm start` derrière un reverse proxy
(Caddy ou nginx) avec un service systemd.

### Sauvegarde

Le plus simple : télécharger régulièrement l'archive ZIP depuis Plus → Exporter. Côté serveur :

```bash
sqlite3 data/lopin.db ".backup data/backup.db"   # copie cohérente même app lancée
```

Puis copier `data/backup.db` et `data/photos/` hors du serveur.

## Calcul des échéances

La logique est dans `src/lib/domain/schedule.ts` (fonctions pures, testées) :

- chaque règle définit une période annuelle (qui peut chevaucher le 1er janvier) ;
- seuls les arbres **plantés** ont des échéances ; l'âge (années pleines depuis la plantation)
  doit respecter les bornes de la règle (minimum inclus, maximum exclu) ;
- règle ponctuelle : « à venir » avant la période, « à faire » pendant, « en retard » pendant
  60 jours après, « faite » si une intervention du même type est datée dans la période (ou si
  elle a été créée par le bouton « Fait » pour cette règle) ;
- règle répétée (ex. arrosage tous les 10 jours) : prochaine date = dernière intervention +
  intervalle, uniquement pendant la période ;
- travaux : tâches non cochées avec échéance et fin prévue des projets non terminés.

## Photos

Les photos sont envoyées telles quelles depuis le téléphone, puis redimensionnées côté serveur
(sharp) : une version 1600 px et une miniature 400 px, en WebP, orientées selon l'EXIF. La date de
prise de vue (EXIF) est conservée, sinon la date d'envoi. Les fichiers sont dans `PHOTOS_DIR` et
servis uniquement aux personnes connectées.
