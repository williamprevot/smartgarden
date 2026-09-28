# SmartGarden

Web app gratuite d'aide à la décision pour les maraîchers de Guyane : quoi planter, quand,
et où vendre la récolte. Elle tient compte du climat réel des onze dernières saisons,
de la saison El Niño / La Niña annoncée, du sol, de la rotation, du travail, du prix du
carburant fixé par la préfecture et des distances routières jusqu'aux marchés.

Elle s'installe sur le téléphone comme une application et fonctionne hors connexion au champ.
Les comptes (gratuits) sauvegardent les réglages et le carnet de chaque agriculteur.

## Choix techniques

| Besoin | Choix | Pourquoi |
|---|---|---|
| Site | HTML, CSS et JavaScript sans compilation | Même façon de travailler que vos projets précédents : on ouvre les fichiers dans VS Code, on modifie, on pousse. |
| Hébergement | **Cloudflare Pages** (gratuit) | Bande passante illimitée, HTTPS automatique, mise en ligne à chaque `git push`, usage commercial autorisé. |
| Comptes et base de données | **Supabase** (gratuit, serveurs en Europe) | Connexion, base de données et règles de sécurité prêtes à l'emploi, sans serveur à écrire. |
| Hors connexion | Service worker + manifeste | L'appli s'ouvre sans réseau et s'installe sur l'écran d'accueil. |

Sans Supabase configuré, l'appli marche quand même : les données restent sur l'appareil.

## Structure du projet

```
index.html               — la page (structure uniquement)
css/styles.css           — tous les styles
js/app.js                — calculs et affichage (modèle climat, marchés, carnet…)
js/cloud.js              — comptes et sauvegarde en ligne (Supabase)
js/config.js             — les 2 clés Supabase à renseigner
data/*.json              — archives de départ : climat, carburant, El Niño, mercuriales
outils/importer_mercuriales.py — ajoute les PDF de mercuriales DAAF à data/mercuriales.json
sw.js                    — fonctionnement hors connexion
manifest.webmanifest     — installation sur téléphone
img/                     — icônes
confidentialite.html     — politique de confidentialité (à compléter : contact)
supabase/schema.sql      — tables et règles de sécurité
supabase/archives_initiales.sql — chargement des archives dans la base
```

## Mise en ligne (environ 20 minutes)

### 1. Tester sur votre ordinateur

1. Ouvrez le dossier dans VS Code.
2. Installez l'extension **Live Server**, puis clic droit sur `index.html` → *Open with Live Server*.
3. L'appli s'ouvre dans le navigateur, en mode local (sans comptes).

### 2. Créer la base Supabase

1. Créez un compte sur [supabase.com](https://supabase.com) (gratuit, sans carte bancaire).
2. *New project* : donnez un nom, un mot de passe de base (gardez-le), région **Europe West (Paris)**.
3. Menu *SQL Editor* → *New query* : collez le contenu de `supabase/schema.sql` → *Run*.
4. Nouvelle requête : collez `supabase/archives_initiales.sql` → *Run*.
5. *Authentication* → *Sign In / Providers* → **Email** activé.
   - Pour vos premiers tests, vous pouvez désactiver *Confirm email*.
   - Avant d'ouvrir l'appli au public, réactivez-le et configurez un envoi d'e-mails (étape 5).
6. *Project Settings* → *API* : copiez **Project URL** et la clé **anon public**, et collez-les dans `js/config.js`.
   Ne copiez jamais la clé *service_role* dans le projet.

### 3. Mettre le code sur GitHub

Dans VS Code : onglet *Source Control* → *Publish to GitHub* (dépôt public ou privé).
Ou en ligne de commande :

```
git init
git add .
git commit -m "Première version"
git branch -M main
git remote add origin https://github.com/VOTRE_COMPTE/smartgarden.git
git push -u origin main
```

### 4. Héberger sur Cloudflare Pages

1. Créez un compte sur [dash.cloudflare.com](https://dash.cloudflare.com) (gratuit).
2. *Workers & Pages* → *Create* → onglet *Pages* → *Connect to Git* → choisissez le dépôt.
3. Réglages de build :
   - *Framework preset* : **None**
   - *Build command* : **laisser vide**
   - *Build output directory* : **/**
4. *Save and Deploy*. L'appli est en ligne sur `https://<nom-du-projet>.pages.dev` (par exemple `https://smartgarden.pages.dev` si ce nom est libre).
5. Retour dans Supabase : *Authentication* → *URL Configuration* → mettez cette adresse dans
   *Site URL* et ajoutez-la dans *Redirect URLs* (liens d'activation et de mot de passe oublié).

Ensuite, chaque `git push` met l'appli à jour automatiquement.
Pensez à changer `VERSION` dans `sw.js` à chaque mise en ligne pour que les téléphones la récupèrent.

Alternative sans Cloudflare : GitHub → *Settings* → *Pages* → *Deploy from a branch* → `main` / `root`.

### 5. Avant d'ouvrir au public

- **E-mails** : l'envoi intégré de Supabase est limité à quelques e-mails par heure. Créez un compte
  gratuit sur [resend.com](https://resend.com) (3 000 e-mails par mois), puis dans Supabase :
  *Authentication* → *Emails* → *SMTP Settings* avec les identifiants Resend. Réactivez *Confirm email*.
- **Confidentialité** : remplacez `CONTACT_A_COMPLETER` dans `confidentialite.html`.
- **Nom de domaine** (facultatif) : Cloudflare Pages → *Custom domains*.

## Mise à jour des données

Le climat, le prix du carburant, la prévision El Niño et les mercuriales sont mis à jour chaque
mercredi et samedi par une tâche planifiée Claude. L'appli lit d'abord `data/*.json`, puis la table
`archives` de Supabase si elle est plus récente. Pour que la tâche écrive directement dans Supabase,
connectez le connecteur Supabase dans Claude.

Mise à jour à la main : remplacez les fichiers de `data/`, puis `git push`.

### Ajouter des mercuriales DAAF

Chaque samedi, la DAAF Guyane publie deux PDF : « Relevé des prix des marchés de Guyane »
(prix moyen de chaque produit, minimum, maximum, prix le plus observé) et « Marchés de Guyane :
prix des fruits et légumes » (prix par famille dans chaque marché). L'appli utilise les deux :
le premier donne le prix de chaque légume, le second l'écart de prix entre Cayenne centre,
les marchés producteurs de l'île de Cayenne, Kourou et Saint-Laurent.

1. Téléchargez les PDF des semaines voulues dans un dossier, par exemple `mercuriales_pdf/`
   (ce dossier n'est pas envoyé sur GitHub).
2. Dans le terminal de VS Code, depuis le dossier du projet :
   ```
   pip install pdfplumber
   python outils/importer_mercuriales.py mercuriales_pdf
   ```
   Le script reconnaît seul les deux types de PDF, ajoute les semaines nouvelles et ignore
   celles déjà présentes.
3. `git add data/mercuriales.json`, `git commit -m "Mercuriales"`, `git push`.

Plus il y a de semaines (idéalement depuis 2023), plus l'appli connaît la vraie saisonnalité
de chaque légume : dès 9 mois couverts, elle utilise la courbe de prix réelle mois par mois.
La correspondance entre les légumes de l'appli et les libellés DAAF est en tête du script.

## Limites de l'offre gratuite

- **Supabase** : 500 Mo de base (des milliers d'agriculteurs), 50 000 utilisateurs actifs par mois.
  Un projet sans aucune activité pendant 7 jours est mis en pause : il se relance en un clic.
- **Cloudflare Pages** : bande passante illimitée, 500 mises en ligne par mois.

## Sécurité

- La clé *anon* de `js/config.js` est publique par nature : les règles RLS de `schema.sql`
  garantissent que chaque compte ne lit et ne modifie que ses propres données.
- Les archives sont lisibles par tous et modifiables seulement depuis Supabase.
- Aucune adresse e-mail réelle ni clé secrète ne doit figurer dans les fichiers du dépôt.
