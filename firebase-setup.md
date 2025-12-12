# 🔥 Guide de configuration Firebase pour les post-its collaboratifs

## 📋 Ce que tu vas faire

En suivant ce guide, tu vas activer les post-its collaboratifs en temps réel pour toute ton équipe !

**Durée** : ~5 minutes  
**Coût** : Gratuit (jusqu'à 1 GB de données)

---

## 🚀 Étape 1 : Créer un compte Firebase

1. Va sur https://console.firebase.google.com/
2. Clique sur **"Ajouter un projet"** (ou "Create a project")
3. Donne un nom à ton projet : `NIZOZ-Studio-Docs` (par exemple)
4. Accepte les conditions
5. **Désactive** Google Analytics (pas besoin pour ça)
6. Clique sur **"Créer le projet"**
7. Attends ~30 secondes que Firebase crée ton projet

---

## 🌐 Étape 2 : Configurer une app Web

1. Dans la page d'accueil de ton projet, clique sur l'icône **Web** `</>`
2. Donne un nom à l'app : `NIZOZ Docs` (par exemple)
3. **Ne coche PAS** "Firebase Hosting"
4. Clique sur **"Enregistrer l'app"**

---

## 🔑 Étape 3 : Récupérer tes clés

Tu vas voir un bloc de code qui ressemble à ça :

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyC-xxx....",
  authDomain: "nizoz-studio-docs.firebaseapp.com",
  projectId: "nizoz-studio-docs",
  storageBucket: "nizoz-studio-docs.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:xxxxx"
};
```

**⚠️ GARDE CET ONGLET OUVERT, tu en auras besoin !**

---

## 💾 Étape 4 : Activer Realtime Database

1. Dans le menu de gauche, clique sur **"Build"** → **"Realtime Database"**
2. Clique sur **"Créer une base de données"**
3. **Choisis une localisation** : `europe-west1` (Belgique - le plus proche)
4. **Mode de sécurité** : Pour l'instant, choisis **"Mode test"**
   - ⚠️ Attention : Tout le monde pourra lire/écrire pendant 30 jours
   - On va sécuriser ça juste après !
5. Clique sur **"Activer"**

Tu devrais voir une URL qui ressemble à :  
`https://nizoz-studio-docs-default-rtdb.europe-west1.firebasedatabase.app`

**📝 NOTE cette URL**, tu en auras besoin !

---

## 🔒 Étape 5 : Sécuriser la base de données (IMPORTANT)

Par défaut, tout le monde peut lire/écrire. On va restreindre ça :

1. Dans **"Realtime Database"**, clique sur l'onglet **"Règles"**
2. Remplace le contenu par ça :

```json
{
  "rules": {
    "postits": {
      "$page": {
        ".read": true,
        ".write": true,
        "$postitId": {
          ".validate": "newData.hasChildren(['id', 'page', 'x', 'y', 'color', 'content', 'author'])"
        }
      }
    }
  }
}
```

3. Clique sur **"Publier"**

**Ce que ça fait :**
- ✅ Tout le monde peut lire les post-its (nécessaire pour la collab)
- ✅ Tout le monde peut écrire des post-its
- ✅ Mais seulement dans la structure correcte (évite le spam)

**⚠️ Note** : Si tu veux plus de sécurité (authentification), on pourra l'ajouter plus tard !

---

## 📝 Étape 6 : Configurer ton fichier

1. Ouvre le fichier **`firebase-config.js`** dans ton dossier `NIZOZ_Studio_Docs`
2. Remplace les valeurs par tes vraies clés Firebase

**Exemple :**

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyC-DtXfzVp8xxxxxxxxxxxxxx",  // ← Copie depuis Firebase
  authDomain: "nizoz-studio-docs.firebaseapp.com",  // ← Copie depuis Firebase
  databaseURL: "https://nizoz-studio-docs-default-rtdb.europe-west1.firebasedatabase.app",  // ← L'URL que tu as notée
  projectId: "nizoz-studio-docs",  // ← Copie depuis Firebase
  storageBucket: "nizoz-studio-docs.appspot.com",  // ← Copie depuis Firebase
  messagingSenderId: "123456789",  // ← Copie depuis Firebase
  appId: "1:123456789:web:xxxxxx"  // ← Copie depuis Firebase
};
```

3. **SAUVEGARDE** le fichier

---

## 🌐 Étape 7 : Héberger ta documentation en ligne

Pour que tes collègues puissent accéder aux post-its, il faut mettre la doc en ligne.

### Option A : GitHub Pages (GRATUIT - Recommandé)

1. Crée un compte sur https://github.com si tu n'en as pas
2. Crée un nouveau repository **public** : `nizoz-docs`
3. Upload ton dossier `NIZOZ_Studio_Docs` dedans
4. Va dans **Settings** → **Pages**
5. Source : **Deploy from branch** → **main** → **/ (root)**
6. Clique sur **Save**
7. Attends 1-2 minutes

Ton site sera accessible à : `https://ton-username.github.io/nizoz-docs/`

### Option B : Netlify (GRATUIT - Encore plus simple)

1. Va sur https://www.netlify.com/
2. Crée un compte gratuit
3. Glisse-dépose ton dossier `NIZOZ_Studio_Docs`
4. C'est tout ! Tu as une URL genre `https://random-name.netlify.app`

### Option C : Serveur local (pour tester)

Si tu veux juste tester en local avec ton équipe sur le même réseau :

```bash
# Dans le dossier NIZOZ_Studio_Docs
python -m http.server 8000

# Ou avec Node.js
npx http-server -p 8000
```

Tes collègues peuvent accéder à : `http://ton-ip-locale:8000`

---

## ✅ Étape 8 : Tester !

1. Ouvre `index.html` dans ton navigateur
2. Entre ton pseudo quand demandé
3. Crée un post-it (bouton 📝)
4. Ouvre la même page dans un autre onglet (ou un autre PC)
5. Entre un autre pseudo
6. Tu devrais voir le post-it que tu viens de créer !

**Si tu vois les post-its des deux côtés en temps réel : 🎉 C'EST BON !**

---

## 🐛 Problèmes courants

### ❌ "Firebase is not defined"

**Solution** : Vérifie que tu as bien ajouté les scripts Firebase dans tes HTML :

```html
<!-- AVANT la balise </body> -->
<script src="https://www.gstatic.com/firebasejs/9.22.0/firebase-app-compat.js"></script>
<script src="https://www.gstatic.com/firebasejs/9.22.0/firebase-database-compat.js"></script>
<script src="firebase-config.js"></script>
<script src="settings.js"></script>
<script src="search.js"></script>
<script src="postit-system.js"></script>
```

### ❌ "Permission denied"

**Causes possibles** :
1. Tu as oublié de publier les règles (Étape 5)
2. La base de données n'est pas activée (Étape 4)
3. L'URL de la database est incorrecte dans `firebase-config.js`

**Solution** : 
- Vérifie dans Firebase Console → Realtime Database → Règles
- Vérifie que l'URL dans `firebase-config.js` est exactement celle de Firebase

### ❌ Les post-its ne s'affichent pas en temps réel

**Solution** : 
- Vérifie que tu as une connexion internet
- Ouvre la console (F12) et regarde s'il y a des erreurs
- Vérifie que Firebase est bien initialisé (tu devrais voir "✅ Firebase initialisé avec succès")

### ❌ Mode local uniquement

Si tu vois "⚠️ Utilisation du mode local uniquement", ça veut dire :
- Firebase n'a pas pu se connecter
- Les post-its fonctionnent mais uniquement sur TON ordinateur
- Vérifie ta config Firebase

---

## 🔐 Sécurité avancée (Optionnel)

Si tu veux ajouter une vraie authentification (avec email/password) :

1. Dans Firebase Console → **Authentication** → **Get started**
2. Active **Email/Password**
3. Crée des comptes pour ton équipe
4. Je peux te coder le système de login si tu veux !

---

## 📊 Surveiller l'utilisation

Pour voir combien de données tu utilises :

1. Firebase Console → **Realtime Database** → **Utilisation**
2. Tu verras :
   - Nombre de connexions simultanées
   - Bande passante utilisée
   - Stockage utilisé

**Limites gratuites** :
- 1 GB de stockage
- 10 GB/mois de bande passante
- 100 connexions simultanées

(Largement suffisant pour une petite équipe !)

---

## 🎉 C'est fini !

Tu as maintenant un système de post-its collaboratifs en temps réel ! 🚀

**Tes collaborateurs peuvent :**
- ✅ Voir tous les post-its en temps réel
- ✅ Créer leurs propres post-its
- ✅ Modifier n'importe quel post-it
- ✅ Voir qui a créé chaque post-it
- ✅ Déplacer les post-its
- ✅ Changer les couleurs

---

**Besoin d'aide ?** Mets un post-it sur cette page ! 😄
