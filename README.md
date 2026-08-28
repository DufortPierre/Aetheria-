# 🌍 Aetheria - Application Météo Immersive

Application météo moderne et immersive avec carte interactive mondiale, utilisant Next.js 15, Tailwind CSS, Leaflet et Open-Meteo. **100% gratuit, aucune clé API requise !**

![Next.js](https://img.shields.io/badge/Next.js-15-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8)

## ✨ Fonctionnalités

### 🗺️ Carte Interactive
- **Carte mondiale interactive** avec Leaflet (tuiles CartoDB Dark Matter / OpenStreetMap)
- **Mode jour/nuit** avec adaptation automatique des tuiles de carte
- **Sélection par clic** sur la carte pour obtenir la météo d'un lieu
- **Animation fluide** lors de la navigation (flyTo)
- **Point de sélection** visible sur la carte

### 🌤️ Données Météo Complètes
- **Température actuelle** avec conditions météo (codes WMO)
- **Précipitations précises** : Distinction Pluie/Neige avec intensité (Faible/Modérée/Forte)
- **Vent** : Vitesse en km/h avec flèche directionnelle pivotante
- **Humidité et pression** atmosphérique
- **Visibilité** en kilomètres
- **Qualité de l'air (AQI)** avec indicateurs colorés et détails des polluants (PM2.5, NO₂)
- **Détection des phénomènes spéciaux** : Brouillard, Grêle, Orages

### 📅 Prévisions
- **Prévisions sur 7 jours** avec températures min/max
- **Conditions météo** pour chaque jour
- **Précipitations et vent** prévus

### 🔍 Recherche Universelle
- **Recherche de ville** avec support de tous les alphabets (Chinois, Japonais, Arabe, etc.)
- **Géocodage Nominatim** (OpenStreetMap) pour une recherche mondiale
- **Suggestions en temps réel** avec debouncing
- **Validation par touche Entrée**

### 🌐 Internationalisation
- **3 langues** : Français, Anglais, Espagnol
- **Traduction complète** de l'interface
- **Données météo** dans la langue sélectionnée
- **Noms de villes** dans la langue locale

### 🎨 Interface Moderne
- **Design Glassmorphism** avec effets de flou et transparence
- **Mode sombre/clair** avec persistance des préférences
- **Animations fluides** et transitions élégantes
- **Interface responsive** adaptée à tous les écrans
- **Skeleton loaders** pendant le chargement des données

### 📍 Géolocalisation
- **Géolocalisation automatique** au démarrage
- **Bouton de géolocalisation** manuel
- **Sauvegarde** de la dernière localisation consultée

### 🖥️ Mode Plein Écran
- **Bouton plein écran** pour une expérience immersive
- **Masquage des panneaux** en mode plein écran

## 🚀 Installation

### Prérequis
- Node.js 18+ et npm

### Étapes

1. **Cloner le dépôt :**
```bash
git clone https://github.com/votre-username/aetheria.git
cd aetheria
```

2. **Installer les dépendances :**
```bash
npm install
```

3. **Lancer le serveur de développement :**
```bash
npm run dev
```

4. **Ouvrir dans le navigateur :**
```
http://localhost:3000
```

**C'est tout !** Aucune configuration de clé API nécessaire.

## 🛠️ Technologies Utilisées

- **Framework** : [Next.js 15](https://nextjs.org/) (App Router)
- **Langage** : [TypeScript](https://www.typescriptlang.org/)
- **Styling** : [Tailwind CSS](https://tailwindcss.com/)
- **Carte** : [Leaflet](https://leafletjs.com/) + [React-Leaflet](https://react-leaflet.js.org/)
- **Icônes** : [Lucide React](https://lucide.dev/)
- **APIs** :
  - [Open-Meteo](https://open-meteo.com/) (Météo gratuite)
  - [Nominatim](https://nominatim.openstreetmap.org/) (Géocodage gratuit)

## 📦 Structure du Projet

```
Aetheria/
├── app/
│   ├── api/
│   │   ├── geocode/route.ts         # Proxy serveur -> Nominatim (recherche)
│   │   └── reverse-geocode/route.ts # Proxy serveur -> Nominatim (inverse)
│   ├── globals.css          # Styles globaux, glassmorphism, thèmes
│   ├── layout.tsx           # Layout principal avec providers + metadata
│   ├── page.tsx             # Page d'accueil principale
│   ├── robots.ts            # /robots.txt généré
│   ├── sitemap.ts           # /sitemap.xml généré
│   ├── manifest.ts          # /manifest.webmanifest (PWA)
│   ├── icon.tsx             # Favicon généré
│   ├── apple-icon.tsx       # Icône iOS générée
│   └── opengraph-image.tsx  # Image de partage réseaux sociaux
├── components/
│   ├── Map.tsx              # Composant carte Leaflet
│   ├── MapWrapper.tsx       # Wrapper pour gestion SSR
│   ├── WeatherDisplay.tsx   # Affichage météo actuelle
│   ├── ForecastDisplay.tsx  # Prévisions 7 jours
│   ├── CitySearch.tsx       # Barre de recherche universelle
│   └── LanguageSelector.tsx # Sélecteur de langue
├── contexts/
│   ├── LanguageContext.tsx  # Gestion i18n (+ synchro <html lang>)
│   └── DarkModeContext.tsx  # Gestion thème sombre/clair
├── lib/
│   ├── weatherService.ts   # Services API (Open-Meteo, proxy géocodage)
│   └── i18n.ts              # Dictionnaires de traduction
├── next.config.js           # En-têtes de sécurité (CSP, HSTS, ...)
└── ...
```

### 🔒 Sécurité & SEO

- La recherche/le géocodage passent désormais par `app/api/geocode` et
  `app/api/reverse-geocode` plutôt que d'appeler Nominatim directement depuis
  le navigateur : cela respecte sa politique d'usage (User-Agent identifiant
  l'app) et évite d'exposer l'IP de chaque visiteur à chaque frappe.
- `next.config.js` ajoute des en-têtes de sécurité (CSP, HSTS,
  `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`,
  `Permissions-Policy`) et désactive l'en-tête `X-Powered-By`.
- `robots.txt`, `sitemap.xml`, `manifest.webmanifest`, favicon et image
  Open Graph/Twitter sont générés via les conventions de fichiers Next.js 15.
- `<html lang>` est synchronisé dynamiquement avec la langue choisie dans
  l'interface (FR/EN/ES) au lieu d'être figé en dur.

## 🌐 APIs Utilisées

### Open-Meteo (Gratuit, pas de clé API)
- **Météo actuelle** : `https://api.open-meteo.com/v1/forecast`
- **Qualité de l'air** : `https://air-quality-api.open-meteo.com/v1/air-quality`
- **Prévisions** : `https://api.open-meteo.com/v1/forecast` (daily)

### Nominatim (Gratuit, pas de clé API)
- **Géocodage** : `https://nominatim.openstreetmap.org/search` (Recherche universelle)
- **Reverse géocodage** : `https://nominatim.openstreetmap.org/reverse` (Coordonnées → Ville)

### Tuiles de Carte (Gratuit)
- **Mode sombre** : CartoDB Dark Matter
- **Mode clair** : OpenStreetMap standard

## 🎨 Design & UX

- **Glassmorphism** : Panneaux semi-transparents avec `backdrop-blur`
- **Mode sombre/clair** : Adaptation automatique des couleurs et tuiles
- **Animations fluides** : Transitions élégantes sur tous les éléments
- **Responsive** : Interface adaptée mobile, tablette et desktop
- **Accessibilité** : Contraste optimisé, navigation au clavier

## 🛠️ Scripts Disponibles

```bash
# Développement
npm run dev          # Lance le serveur sur http://localhost:3000

# Production
npm run build        # Compile l'application
npm run start        # Lance le serveur de production

# Qualité de code
npm run lint         # Vérifie le code avec ESLint
```

## 🚀 Déploiement

### Vercel (Recommandé)
1. Connectez votre dépôt GitHub à [Vercel](https://vercel.com)
2. Vercel détectera automatiquement Next.js
3. Cliquez sur "Deploy"
4. **Aucune configuration nécessaire !**

### Netlify
1. Connectez votre dépôt GitHub à [Netlify](https://netlify.com)
2. Build command : `npm run build`
3. Publish directory : `.next`
4. Déployez !

### Autres plateformes
L'application peut être déployée sur n'importe quelle plateforme supportant Next.js.

## 📝 Notes Techniques

- **SSR** : Utilisation de `dynamic import` pour Leaflet (client-side uniquement)
- **Standards** : Codes météo WMO (World Meteorological Organization)
- **Performance** : Debouncing sur la recherche, lazy loading des composants
- **Stockage** : LocalStorage pour préférences utilisateur (langue, thème, dernière localisation)
- **Géolocalisation** : API du navigateur avec gestion des erreurs

## 🤝 Contribution

Les contributions sont les bienvenues ! N'hésitez pas à :
- Ouvrir une issue pour signaler un bug
- Proposer une amélioration
- Soumettre une pull request

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## 👤 Auteur

Créé avec ❤️ pour un projet personnel

---

⭐ Si ce projet vous plaît, n'hésitez pas à lui donner une étoile !
