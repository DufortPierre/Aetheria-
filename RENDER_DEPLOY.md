# 🚀 Guide de déploiement sur Render

## Étapes pour déployer Aetheria sur Render

### 1. Préparer le dépôt GitHub
✅ Votre dépôt est déjà sur GitHub : https://github.com/DufortPierre/Aetheria-

### 2. Créer un compte Render
1. Allez sur [render.com](https://render.com)
2. Créez un compte (vous pouvez vous connecter avec GitHub)
3. Confirmez votre email si nécessaire

### 3. Créer un nouveau Web Service
1. Dans le dashboard Render, cliquez sur **"New +"** → **"Web Service"**
2. Connectez votre dépôt GitHub si ce n'est pas déjà fait
3. Sélectionnez le dépôt **"Aetheria-"**

### 4. Configurer le service

#### Informations de base :
- **Name** : `aetheria` (ou `aetheria-weather`)
- **Region** : Choisissez la région la plus proche (ex: `Frankfurt` pour l'Europe)
- **Branch** : `main`
- **Root Directory** : (laissez vide, c'est la racine)

#### Build & Deploy :
- **Runtime** : `Node`
- **Build Command** : `npm install && npm run build`
- **Start Command** : `npm start`

#### Advanced (optionnel) :
- **Auto-Deploy** : `Yes` (déploie automatiquement à chaque push)
- **Health Check Path** : `/` (pour vérifier que l'app fonctionne)

### 5. Variables d'environnement
**Aucune variable d'environnement nécessaire !** 
L'application fonctionne sans clé API.

### 6. Plan de service
- **Free Plan** : Parfait pour commencer
  - 750 heures gratuites par mois
  - L'app se met en veille après 15 minutes d'inactivité
  - Redémarre automatiquement au prochain accès

### 7. Déployer
1. Cliquez sur **"Create Web Service"**
2. Render va :
   - Cloner votre dépôt
   - Installer les dépendances (`npm install`)
   - Builder l'application (`npm run build`)
   - Lancer le serveur (`npm start`)
3. Attendez 5-10 minutes pour le premier déploiement

### 8. Votre application est en ligne !
Une fois le déploiement terminé, vous obtiendrez une URL du type :
```
https://aetheria-xxxx.onrender.com
```

## ⚙️ Configuration automatique

Le fichier `render.yaml` a été créé pour automatiser la configuration. Render le détectera automatiquement si vous utilisez l'option "Infrastructure as Code".

## 🔄 Mises à jour automatiques

Avec **Auto-Deploy** activé :
- Chaque push sur `main` déclenche un nouveau déploiement
- Render rebuild et redéploie automatiquement
- Vous recevez un email de notification

## 📊 Monitoring

Dans le dashboard Render, vous pouvez :
- Voir les logs en temps réel
- Surveiller les performances
- Gérer les déploiements
- Configurer des alertes

## 💰 Coûts

- **Free Plan** : Gratuit (avec limitations)
  - App se met en veille après 15 min d'inactivité
  - Redémarre en quelques secondes au prochain accès
- **Starter Plan** : $7/mois
  - App toujours en ligne
  - Pas de mise en veille

## 🐛 Dépannage

### L'app ne démarre pas
- Vérifiez les logs dans le dashboard Render
- Assurez-vous que `npm run build` fonctionne localement
- Vérifiez que le port est bien configuré (Render utilise le port défini par `PORT`)

### Build échoue
- Vérifiez que toutes les dépendances sont dans `package.json`
- Assurez-vous que `node_modules` n'est pas commité
- Vérifiez les logs de build pour les erreurs spécifiques

### L'app se met en veille (Free Plan)
- C'est normal ! Elle redémarre automatiquement au prochain accès
- Pour éviter cela, passez au Starter Plan ($7/mois)

## 🔗 Liens utiles

- [Documentation Render](https://render.com/docs)
- [Guide Next.js sur Render](https://render.com/docs/deploy-nextjs)
- [Dashboard Render](https://dashboard.render.com)
