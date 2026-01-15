# 📦 Guide pour créer le dépôt GitHub

## Étapes pour créer votre dépôt GitHub

### 1. Sur GitHub.com

1. **Connectez-vous** à votre compte GitHub
2. **Cliquez sur le "+"** en haut à droite → "New repository"
3. **Remplissez le formulaire** :
   - **Repository name** : `Aetheria` (ou `aetheria-weather`)
   - **Description** : `Application météo moderne et immersive avec carte interactive mondiale`
   - **Visibilité** : 
     - ✅ **Public** (recommandé pour un portfolio)
     - ⚠️ **Private** (si vous ne voulez pas que ce soit visible)
   - **Ne cochez PAS** "Add a README file" (vous en avez déjà un)
   - **Ne cochez PAS** "Add .gitignore" (vous en avez déjà un)
   - **Ne cochez PAS** "Choose a license" (pour l'instant)
4. **Cliquez sur "Create repository"**

### 2. Dans votre terminal (depuis le dossier du projet)

```bash
# Initialiser Git (si pas déjà fait)
git init

# Ajouter tous les fichiers
git add .

# Faire le premier commit
git commit -m "Initial commit: Application météo Aetheria"

# Ajouter le dépôt distant (remplacez VOTRE_USERNAME par votre nom d'utilisateur GitHub)
git remote add origin https://github.com/VOTRE_USERNAME/Aetheria.git

# Renommer la branche principale en "main" (si nécessaire)
git branch -M main

# Pousser vers GitHub
git push -u origin main
```

### 3. Si vous avez déjà un dépôt Git local

```bash
# Vérifier le statut
git status

# Ajouter tous les fichiers
git add .

# Commit
git commit -m "Initial commit: Application météo Aetheria"

# Ajouter le remote (remplacez VOTRE_USERNAME)
git remote add origin https://github.com/VOTRE_USERNAME/Aetheria.git

# Pousser
git push -u origin main
```

## 📝 Informations à mettre sur GitHub

### Description du dépôt
```
Application météo moderne et immersive avec carte interactive mondiale. 
100% gratuit, aucune clé API requise. Built with Next.js 15, TypeScript, Tailwind CSS, Leaflet.
```

### Topics (Mots-clés) à ajouter
- `nextjs`
- `typescript`
- `tailwindcss`
- `leaflet`
- `weather-app`
- `open-meteo`
- `react`
- `web-app`
- `meteo`
- `weather`

### Badges à ajouter (optionnel)
Vous pouvez ajouter ces badges dans votre README.md :

```markdown
![Next.js](https://img.shields.io/badge/Next.js-15-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8)
```

## ✅ Checklist avant de pousser

- [ ] Vérifier que `.env.local` n'est pas commité (déjà dans .gitignore)
- [ ] Vérifier que `node_modules` n'est pas commité (déjà dans .gitignore)
- [ ] Le README.md est à jour
- [ ] Le .gitignore est correct
- [ ] Aucune clé API sensible dans le code

## 🚀 Après avoir créé le dépôt

1. **Ajoutez une description** sur la page du dépôt
2. **Ajoutez des topics** (mots-clés) pour la découvrabilité
3. **Créez un fichier LICENSE** si vous voulez (MIT recommandé)
4. **Ajoutez des screenshots** dans le README si vous voulez

## 📸 Screenshots (optionnel)

Si vous voulez ajouter des screenshots dans le README :

1. Créez un dossier `public/screenshots/`
2. Ajoutez vos captures d'écran
3. Ajoutez dans le README :

```markdown
## 📸 Screenshots

![Mode sombre](public/screenshots/dark-mode.png)
![Mode clair](public/screenshots/light-mode.png)
```

## 🔗 Liens utiles

- [Documentation GitHub](https://docs.github.com/en/get-started/quickstart/create-a-repo)
- [Guide Git](https://git-scm.com/book)
