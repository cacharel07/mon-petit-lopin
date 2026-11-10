# CLAUDE.md — conventions du projet

## Contexte

Application personnelle (une seule utilisatrice) de suivi d'un terrain de ~2000 m² en Haute-Loire,
à 850 m d'altitude (gelées tardives, hivers froids). Usage principal **sur mobile, au jardin**.
Le brief complet et les décisions sont résumés ci-dessous ; demander avant tout choix structurant.

## Langues

- Interface : **français**.
- Code, noms de variables, de fichiers, de tables, commits : **anglais**.
- URLs : françaises (`/arbres`, `/travaux`) car visibles par l'utilisatrice.
- Valeurs d'énumérations stockées en anglais, libellés français dans `src/lib/domain/enums.ts`.

## Stack

- SvelteKit 3 (runes, adapter-node), TypeScript strict.
- SQLite via better-sqlite3 + Drizzle ORM. Migrations dans `drizzle/`, appliquées au démarrage.
- sharp pour les photos (redimensionnement côté serveur).
- Vitest pour les tests unitaires.
- Pas de PWA, pas de framework CSS : CSS maison dans `src/app.css` + styles de composants.

## Organisation

```
src/env.ts                 variables d'environnement (defineEnvVars)
src/hooks.server.ts        authentification (toutes les routes sauf /login)
src/lib/domain/            logique métier PURE (pas d'I/O) — testée
src/lib/components/        composants Svelte partagés (formulaires, photos, calendrier)
src/lib/server/db/         schéma Drizzle, connexion, seed (seed-data.ts = valeurs d'entretien)
src/lib/server/*.ts        services : trees.ts, projects.ts (requêtes), schedule.ts (charge les
                           données du moteur d'échéances), photos.ts (sharp), export.ts,
                           forms.ts (parsing)
src/lib/server/auth/       mot de passe (scrypt) et sessions
src/routes/                pages (URLs en français) :
                           /arbres, /arbres/[id], /arbres/[id]/modifier,
                           /arbres/[id]/entretien(/[ruleId|nouvelle][?remplace=X]),
                           /arbres/[id]/journal/[interventionId],
                           /especes, /especes/[id], /especes/[id]/regles/[ruleId|nouvelle],
                           /travaux(?vue=kanban|?statut=…), /travaux/nouveau,
                           /travaux/[id], /travaux/[id]/modifier,
                           / (tableau de bord), /echeances/fait (POST du bouton « Fait »),
                           /export, /export/lopin.zip, /export/lopin.json, /export/csv/[table],
                           /zones, /plus, /photos/[name] (fichiers, authentifiés)
scripts/                   hash-password.js, seed.ts, auto-update.sh (tâche planifiée),
                           update.sh (mise à jour manuelle)
.github/workflows/         release.yml : build GitHub → branche deploy
deploy/gitignore           .gitignore de la branche deploy
drizzle/                   migrations SQL générées
data/                      base et photos (ignoré par git)
```

## Conventions

- Imports **toujours avec l'extension** : alias `#lib/...` (`#lib/server/db/index.ts`, exigé par
  les subpath imports de SvelteKit 3) et imports relatifs (`./schema.ts`, pour que les scripts
  Node comme `scripts/seed.ts` tournent sans bundler).
- Dans `src/lib/`, utiliser des imports relatifs ; dans `src/routes/` et les composants, `#lib/...`.
- Dates calendaires stockées en texte ISO `YYYY-MM-DD` ; horodatages en ISO UTC ; montants en
  centimes (entiers).
- Mobile d'abord : cibles tactiles ≥ 44 px, navigation en barre basse, formulaires simples
  (form actions SvelteKit, fonctionnent sans JS).
- Toute logique de calcul (échéances, âge des arbres, héritage des règles) va dans
  `src/lib/domain/` sous forme de fonctions pures, avec des tests `*.spec.ts` à côté.
- Après une modification de `schema.ts` : `npm run db:generate`, committer la migration.
- Formulaires : form actions SvelteKit + `withForm()` (`src/lib/server/forms.ts`) ; une
  `FormError` devient une réponse 400 `{ error, values }` qui réaffiche le formulaire.
- Attention : `action="?/save"` remplace toute la query string ; garder les paramètres utiles
  dans l'URL d'action (`?/save&remplace=12`).
- Photos : toujours passer par `storePhoto()` / `deletePhotoFiles()` ; supprimer les fichiers
  quand on supprime un arbre, une intervention ou une photo (les cascades SQL ne le font pas).
- Avant de committer : `npm run format && npm run check && npm test`.

## Modèle de données (résumé)

- `zone` ← `tree`, `project`
- `species_template` → `care_rule` (règles du modèle)
- `tree` → `care_rule` (règles propres à l'arbre)
- **Héritage des règles** : un arbre hérite de toutes les règles de son modèle d'espèce.
  Une règle d'arbre avec `overrides_rule_id` remplace la règle du modèle visée (ou la masque si
  `disabled`). Une règle d'arbre sans `overrides_rule_id` est une règle supplémentaire.
- `intervention` (journal) → `tree`, optionnellement liée à la `care_rule` qu'elle accomplit.
- `project` → `project_task` (checklist), `project_tree` (lien vers des arbres).
- `photo` → exactement un parmi `tree`, `project`, `intervention`.
- `care_rule.verified = false` : valeur suggérée, affichée « à vérifier ».

## Moteur d'échéances

`src/lib/domain/schedule.ts` (pur, testé dans `schedule.spec.ts`) ; règles détaillées dans le
README. Une intervention accomplit une règle si elle y est liée (`care_rule_id`, créé par le
bouton « Fait ») ou, sans lien, si elle a le même type d'intervention et est datée dans la
période (`CARE_RULE_TO_INTERVENTION` dans `enums.ts`). Toute évolution de ces règles doit
s'accompagner de tests.

## Décisions validées

- Bouton « Fait » sur le tableau de bord → crée l'intervention dans le journal.
- Arrosage : **une ligne par arbre** sur le tableau de bord (pas de regroupement).
- Arbre au statut `purchased` (pas planté) : aucune échéance d'entretien. Bouton « Marquer
  comme planté » sur la fiche (statut + date + intervention « Plantation »).
- Héritage règle par règle (pas champ par champ) : personnaliser une règle copie toute la règle
  pour l'arbre ; elle ne suit plus le modèle ensuite. Changer le modèle d'un arbre supprime ses
  personnalisations (les règles propres à l'arbre restent).
- Âge d'un arbre = années pleines depuis `planting_date`. `min_age_years` inclus,
  `max_age_years` exclu (« avant 3 ans » = années 0, 1 et 2).
- Les valeurs d'entretien du seed sont des suggestions pour 850 m d'altitude (`verified=false`).
- Le seed contient des dates approximatives (plantation 2023 au 15 mars, achat au 1er novembre 2026) en attendant les vraies valeurs.
- « Fait » n'est proposé que si une intervention datée d'aujourd'hui compte : période ouverte
  ou en retard, règle répétée, tâche de projet.
- Tableau de bord : « Cette semaine » = périodes ouvertes + ce qui commence avant dimanche ;
  « Ce mois-ci » = ce qui commence ensuite jusqu'à la fin du mois calendaire.
- Changement de statut d'un projet : début réel / fin réelle remplis automatiquement s'ils sont
  vides ; rouvrir un projet terminé efface la fin réelle.
- Export : CSV avec séparateur `;` et BOM UTF-8 (tableur en français) ; noms de colonnes de la
  base ; sessions exclues.
- Authentification : un seul compte défini par variables d'environnement.
- Hébergement : alwaysdata (Node.js 24), sans Docker. Le SSH n'a pas assez de mémoire pour
  `npm ci` / `vite build` : GitHub Actions (`.github/workflows/release.yml`) publie à chaque push
  sur `main` une copie compilée avec les dépendances de production sur la branche `deploy`
  (un seul commit, force-pushé). Le serveur suit `deploy` : une tâche planifiée alwaysdata lance
  `scripts/auto-update.sh` (mise à jour si `deploy` a changé + redémarrage via l'API alwaysdata,
  variables `ALWAYSDATA_*` dans `.env`) ; `scripts/update.sh` force la mise à jour à la main. Tout ce qui est exécuté en production (y compris `scripts/seed.ts`)
  doit donc n'utiliser que des `dependencies`, pas des `devDependencies`.

## Hors périmètre V1 (pistes V2)

Plan interactif (colonnes `tree.plan_x/plan_y` déjà prévues), notifications par e-mail, météo
locale (gel, sécheresse), budget global, potager et vivaces, frise photo, second compte.
