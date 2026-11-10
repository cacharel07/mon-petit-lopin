# Mon petit lopin

Application web personnelle pour suivre l'aménagement et l'entretien de mon extérieur :
travaux, arbres, calendriers d'entretien et journal des interventions.

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

1. Créer un site de type **Node.js**.
2. Cloner le dépôt dans le compte (SSH), puis :
   ```bash
   npm ci && npm run build
   npm run db:seed   # première installation uniquement
   ```
3. Créer le fichier `.env` (voir plus haut), avec en plus :
   ```
   ORIGIN=https://mon-domaine.example
   BODY_SIZE_LIMIT=50M
   ```
   `ORIGIN` est nécessaire derrière le proxy HTTPS de l'hébergeur (protection CSRF des formulaires
   et cookies `secure`).
4. Commande de lancement du site : `npm start` (ou `node --env-file-if-exists=.env build`).
   alwaysdata fournit le port via `PORT`, lu automatiquement par adapter-node.
5. Mise à jour : `git pull && npm ci && npm run build`, puis redémarrer le site.

### VPS (alternative)

Même principe : `npm ci && npm run build`, puis lancer `npm start` derrière un reverse proxy
(Caddy ou nginx) avec un service systemd.

### Sauvegarde

```bash
sqlite3 data/lopin.db ".backup data/backup.db"   # copie cohérente même app lancée
```

Puis copier `data/backup.db` et `data/photos/` hors du serveur.

## Photos

Les photos sont envoyées telles quelles depuis le téléphone, puis redimensionnées côté serveur
(sharp) : une version 1600 px et une miniature 400 px, en WebP, orientées selon l'EXIF. La date de
prise de vue (EXIF) est conservée, sinon la date d'envoi. Les fichiers sont dans `PHOTOS_DIR` et
servis uniquement aux personnes connectées.
