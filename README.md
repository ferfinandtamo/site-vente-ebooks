# 📚 Site de Vente Ebooks Premium

Bienvenue sur le projet **EbookStore**, une plateforme moderne et responsive pour la vente d'ebooks.
Ce projet a été généré automatiquement avec une structure professionnelle prête pour la production.

## 🚀 Fonctionnalités
- **Design Premium** : Interface utilisateur sombre avec effets de verre ("Glassmorphism").
- **Catalogue Dynamique** : Chargement des livres depuis une source de données JSON.
- **Filtrage & Recherche** : Trouvez vos ebooks par catégorie ou mots-clés instantanément.
- **Responsive** : Adapté aux mobiles, tablettes et ordinateurs.
- **Micro-interactions** : Animations fluides au survol et au clic.

## 🛠 Structure du Projet
```
site-vente-ebooks/
├── css/
│   └── style.css       # Styles (Variables, Flexbox, Grid)
├── js/
│   └── app.js          # Logique de l'application (ES6 Modules)
├── data/
│   └── ebooks.js       # Données simulées des produits
├── index.html          # Page d'accueil
└── README.md           # Documentation
```

## 📦 Installation et Démarrage
1. Clonez ce dépôt :
   ```bash
   git clone https://github.com/ferfinandtamo/site-vente-ebooks.git
   ```
2. Ouvrez le dossier dans votre éditeur favori.
3. Pour tester localement, utilisez un serveur live (ex: Live Server sur VSCode) ou via Python :
   ```bash
   python -m http.server 8000
   ```
4. Ouvrez `http://localhost:8000` dans votre navigateur.

## 🔧 Maintenance
- **Ajouter un livre** : Éditez `data/ebooks.js` et ajoutez un objet dans le tableau `ebooks`.
- **Modifier le design** : Les variables CSS sont définies dans `:root` (fichier `css/style.css`).

## 🌍 Déploiement
Ce site est configuré pour être déployé automatiquement sur **GitHub Pages**.
Chaque modification sur la branche `main` déclenchera une mise à jour du site en ligne.

---
Généré par Antigravity Assistant.
