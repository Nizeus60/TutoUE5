# 🎮 NIZOZ Studio - Système de Documentation

Bienvenue dans ton système de documentation modulaire et évolutif pour tous tes projets Unreal Engine !

## 📁 Structure du projet

```
NIZOZ_Studio_Docs/
│
├── index.html                 # Page d'accueil
├── style.css                  # CSS unique (thèmes dark/light + couleurs)
├── settings.js                # Gestion des paramètres utilisateur
├── search.js                  # Système de recherche globale
├── postit-system.js           # Système de post-its
├── README.md                  # Ce fichier
│
└── tutorials/                 # Dossier des tutoriels
    └── fusion-procedural.html # Premier tutoriel
```

---

## 🚀 Utilisation

### Ouvrir la documentation

1. Double-clique sur `index.html`
2. Ça s'ouvre dans ton navigateur par défaut
3. C'est tout ! 🎉

### Fonctionnalités disponibles

- **🌓 Mode Dark/Light** : Clique sur l'icône soleil/lune en haut à droite
- **🎨 Couleurs personnalisables** : Clique sur ⚙️ pour choisir ta couleur
- **🔍 Recherche** : Tape dans la barre de recherche en haut
- **📝 Post-its** : Clique sur le bouton flottant 📝 en bas à droite
- **⌨️ Raccourci** : `Ctrl+,` (ou `Cmd+,` sur Mac) pour ouvrir les paramètres

---

## ➕ Ajouter un nouveau tutoriel

### Étape 1 : Créer le fichier HTML

1. Copie le fichier `tutorials/fusion-procedural.html`
2. Renomme-le (ex: `input-remapping.html`)
3. Place-le dans le dossier `tutorials/`

### Étape 2 : Modifier le contenu

Ouvre ton nouveau fichier et modifie :

```html
<!-- Change le titre -->
<title>Ton Nouveau Titre | NIZOZ Studio</title>

<!-- Change le breadcrumb -->
<span style="color: var(--primary-color);">Ton Nouveau Titre</span>

<!-- Change le H1 -->
<h1 id="titre">🎮 Ton Nouveau Titre</h1>

<!-- Modifie les meta info -->
<span>🎯 Niveau : Débutant/Intermédiaire/Avancé</span>
<span>⏱️ Durée : ~XX minutes</span>
```

### Étape 3 : Remplir le contenu

Utilise ces composants pour structurer ton tutoriel :

#### Titres avec ancres
```html
<h2 id="mon-id"><a href="#mon-id" class="anchor">#</a>Mon Titre</h2>
```

#### Boîtes d'information
```html
<!-- Astuce -->
<div class="info-box tip">
  <div class="info-box-icon">💡</div>
  <div class="info-box-content">
    <h4>Astuce</h4>
    <p>Ton texte ici</p>
  </div>
</div>

<!-- Attention -->
<div class="info-box warning">
  <div class="info-box-icon">⚠️</div>
  <div class="info-box-content">
    <h4>Attention</h4>
    <p>Ton texte ici</p>
  </div>
</div>

<!-- Erreur/Danger -->
<div class="info-box danger">
  <div class="info-box-icon">🔥</div>
  <div class="info-box-content">
    <h4>Danger</h4>
    <p>Ton texte ici</p>
  </div>
</div>

<!-- Info -->
<div class="info-box note">
  <div class="info-box-icon">ℹ️</div>
  <div class="info-box-content">
    <h4>Note</h4>
    <p>Ton texte ici</p>
  </div>
</div>
```

#### Blocs de code
```html
<div class="code-block">
  <div class="code-header">
    <span class="code-title">📝 Titre du code</span>
  </div>
  <pre><code>Ton code ici
avec plusieurs lignes
si besoin</code></pre>
</div>
```

#### Étapes numérotées
```html
<div class="steps-container">
  <div class="step">
    <h4>Première étape</h4>
    <p>Description...</p>
  </div>
  
  <div class="step">
    <h4>Deuxième étape</h4>
    <p>Description...</p>
  </div>
</div>
```

#### Tableaux
```html
<table>
  <thead>
    <tr>
      <th>Colonne 1</th>
      <th>Colonne 2</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Valeur 1</td>
      <td>Valeur 2</td>
    </tr>
  </tbody>
</table>
```

### Étape 4 : Mettre à jour la navigation

#### Dans index.html

Ajoute ton tutoriel dans la sidebar :
```html
<li class="nav-item">
  <a href="tutorials/ton-nouveau-tuto.html" class="nav-link">
    <span class="nav-icon">🎮</span>
    <span>Ton Nouveau Titre</span>
  </a>
</li>
```

Et ajoute une carte dans la section "Commencer maintenant" :
```html
<a href="tutorials/ton-nouveau-tuto.html" style="...">
  <div style="display: flex; gap: 24px; align-items: start;">
    <div style="font-size: 4rem;">🎮</div>
    <div style="flex: 1;">
      <h3>Ton Nouveau Titre</h3>
      <p>Description courte...</p>
      <div style="display: flex; gap: 8px;">
        <span>🎯 Niveau</span>
        <span>⏱️ Durée</span>
      </div>
    </div>
  </div>
</a>
```

#### Dans search.js

Ouvre `search.js` et ajoute ton tutoriel dans l'array `pages` :
```javascript
this.pages = [
  // ... pages existantes
  {
    title: 'Ton Nouveau Titre',
    url: 'tutorials/ton-nouveau-tuto.html',
    keywords: ['mot-clé1', 'mot-clé2', 'mot-clé3']
  }
];
```

---

## 🎨 Personnalisation

### Changer les couleurs par défaut

Ouvre `style.css` et modifie :
```css
:root {
  --primary-color: #00aaff; /* Change cette valeur */
}
```

### Changer le thème par défaut

Dans `settings.js`, modifie :
```javascript
this.settings = {
  theme: 'dark', // Change en 'light' si tu veux
  primaryColor: '#00aaff'
};
```

### Ajouter des presets de couleur

Dans `settings.js`, ajoute dans l'array :
```javascript
this.colorPresets = [
  // ... presets existants
  { name: 'Rose', color: '#e91e63' }
];
```

---

## 📝 Système de Post-its

### Comment ça marche ?

- Les post-its sont sauvegardés dans le `localStorage` de ton navigateur
- Ils sont **spécifiques à chaque page**
- Ils persistent même si tu fermes Chrome

### Gestion des post-its

- **Créer** : Clique sur le bouton flottant 📝
- **Déplacer** : Drag & drop sur la barre du haut
- **Changer couleur** : Clique sur 🎨
- **Supprimer** : Clique sur ✕

### Sauvegarder/Exporter

Les post-its sont automatiquement sauvegardés. Si tu veux faire une backup :
```javascript
// Dans la console du navigateur
postitSystem.exportPostits();
```

---

## 🔍 Système de recherche

### Ajouter des mots-clés

Plus tu ajoutes de mots-clés pertinents dans `search.js`, meilleure sera la recherche :

```javascript
{
  title: 'Mon Tutoriel',
  url: 'tutorials/mon-tuto.html',
  keywords: [
    'unreal', 'engine', 'blueprint', // Génériques
    'fusion', 'mesh', 'procedural',  // Spécifiques au contenu
    'physique', 'collision', 'craft' // Concepts liés
  ]
}
```

---

## 🐛 Problèmes courants

### Les paramètres ne se sauvegardent pas

- Vérifie que ton navigateur autorise le `localStorage`
- Ouvre la console (F12) et regarde s'il y a des erreurs

### La recherche ne trouve rien

- Assure-toi d'avoir ajouté la page dans `search.js`
- Vérifie que les mots-clés correspondent à ce que tu cherches

### Les post-its disparaissent

- Vérifie que tu n'utilises pas le mode navigation privée
- Check si tu n'as pas vidé le cache du navigateur

### Le CSS ne s'applique pas

- Vérifie que le chemin vers `style.css` est correct
- Pour les sous-pages : `href="../style.css"`
- Pour l'index : `href="style.css"`

---

## 💡 Tips & Best Practices

### Organisation du contenu

- **Titre clair** : Décris exactement ce que le tuto apprend
- **Table des matières** : Toujours inclure pour les tutos longs
- **Ancres** : Permet de partager des liens vers des sections précises
- **Exemples visuels** : Ajoute des captures d'écran quand possible

### Rédaction

- **Tutoie** : Reste naturel et proche de ton lecteur (toi dans 6 mois !)
- **Pas à pas** : Décompose en étapes claires
- **Contexte** : Explique POURQUOI avant le COMMENT
- **Troubleshooting** : Anticipe les problèmes courants

### Maintenance

- **Date les tutos** : Note la version d'UE utilisée
- **Met à jour** : Reviens modifier si tu découvres une meilleure méthode
- **Post-its** : Utilise-les pour noter ce que tu veux améliorer

---

## 🚀 Fonctionnalités à venir

### Idées d'améliorations

- [ ] Page "Mes Post-its" pour voir tous tes post-its en un coup d'œil
- [ ] Export PDF des tutoriels
- [ ] Mode hors-ligne (PWA)
- [ ] Statistiques (temps de lecture, pages vues)
- [ ] Tags pour catégoriser les tutoriels
- [ ] Favoris/Bookmarks

---

## 📞 Support

Si tu rencontres un problème ou que tu veux ajouter une fonctionnalité, note-le sur un post-it ! 😄

---

**Fait avec ❤️ pour NIZOZ Studio**
