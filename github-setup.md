# 🐙 Guide GitHub API pour les post-its collaboratifs

## ✨ Comment ça marche

Au lieu d'utiliser Firebase, on utilise **l'API GitHub** pour stocker les post-its dans un fichier JSON sur ton repo !

**Avantages** :
- ✅ Pas de config compliquée Firebase
- ✅ Pas de problème CORS
- ✅ Tout est sur GitHub (déjà hébergé)
- ✅ Historique des modifications (bonus !)

---

## 📝 Configuration (2 minutes)

### Étape 1 : Ouvrir `github-config.js`

Vérifie que les infos sont correctes :

```javascript
const githubConfig = {
  owner: "Nizeus6o",        // ← Ton username GitHub
  repo: "TutoUEs",           // ← Le nom de ton repo
  branch: "main",            // ← Ta branche (main ou master)
  postitFile: "postits.json", // ← Ne pas changer
  token: "",                 // ← On verra ça après
  refreshInterval: 10        // ← Refresh toutes les 10 secondes
};
```

### Étape 2 : Upload le fichier `postits.json`

1. Dans ton repo GitHub, clique sur **"Add file" → "Create new file"**
2. Nom du fichier : `postits.json`
3. Contenu :
```json
{
  "postits": {}
}
```
4. Commit : **"Init postits file"**

---

## 🔑 (Optionnel mais recommandé) Créer un token GitHub

Sans token, tu es limité à **60 requêtes/heure**. Avec token : **5000 requêtes/heure** !

### Étapes :

1. Va sur https://github.com/settings/tokens
2. Clique sur **"Generate new token"** → **"Generate new token (classic)"**
3. **Note** : `NIZOZ Docs Postits`
4. **Expiration** : 90 days (ou No expiration si tu veux)
5. **Scopes** : Coche UNIQUEMENT **"repo"** (Full control of private repositories)
6. Clique sur **"Generate token"**
7. **COPIE** le token (tu ne le verras qu'une fois !)
8. Dans `github-config.js`, colle-le :
```javascript
token: "ghp_VotreSuperTokenIciXXXXXXXXXX"
```
9. **Commit et push** le fichier

---

## ✅ Tester

1. Ouvre ton site : `https://nizeus6o.github.io/TutoUEs/`
2. Ouvre la console (F12)
3. Tu devrais voir : **"✅ Mode GitHub API"**
4. Crée un post-it
5. Refresh la page → le post-it est toujours là !
6. Ouvre dans un autre onglet → tu vois le post-it !

---

## 🎯 Comment ça marche

### Quand tu crées/modifies un post-it :
1. Le système envoie une requête à l'API GitHub
2. GitHub met à jour le fichier `postits.json`
3. Les autres utilisateurs récupèrent le fichier automatiquement

### Refresh automatique :
Toutes les 10 secondes (configurable dans `refreshInterval`), le système :
- Vérifie si `postits.json` a changé
- Télécharge les nouveaux post-its
- Met à jour l'affichage

---

## 🐛 Problèmes courants

### ❌ "GitHub config non trouvée"
**Solution** : Vérifie que `github-config.js` est bien chargé dans ton HTML

### ❌ "GitHub API error: 404"
**Solutions** :
- Le fichier `postits.json` n'existe pas → Crée-le !
- Le nom du repo est incorrect dans `github-config.js`
- La branche est incorrecte (main vs master)

### ❌ "GitHub API error: 403" (Forbidden)
**Solutions** :
- Tu as dépassé la limite de 60 requêtes/heure → Ajoute un token
- Ton token est invalide → Régénère un token
- Ton token n'a pas les bons scopes → Recoche "repo"

### ❌ Les post-its ne se synchronisent pas
**Solutions** :
- Ouvre la console et regarde les erreurs
- Vérifie que `refreshInterval` n'est pas à 0
- Vide le cache (Ctrl+Shift+R)

---

## ⚙️ Personnalisation

### Changer le délai de refresh

Dans `github-config.js` :
```javascript
refreshInterval: 5  // Refresh toutes les 5 secondes (plus rapide)
// ou
refreshInterval: 30 // Refresh toutes les 30 secondes (moins de requêtes)
```

### Changer le nom du fichier

Si tu veux utiliser un autre fichier que `postits.json` :
```javascript
postitFile: "mes-notes.json"
```
(N'oublie pas de créer le fichier sur GitHub !)

---

## 📊 Voir l'historique des post-its

**Bonus** : Comme tout est sur GitHub, tu peux voir l'historique !

1. Va sur ton repo
2. Clique sur `postits.json`
3. Clique sur **"History"**
4. Tu vois tous les changements avec qui a fait quoi et quand !

---

## 🔒 Sécurité

### Token GitHub

⚠️ **IMPORTANT** : Si tu commit ton token dans le repo **PUBLIC**, tout le monde peut le voir !

**Solutions** :
1. **Repo privé** : Pas de souci, le token est safe
2. **Repo public** : NE PAS commit `github-config.js` avec le token
   - Ajoute-le au `.gitignore`
   - Ou utilise des **GitHub Secrets** (plus avancé)

### Permissions

Le token avec scope "repo" permet de :
- ✅ Lire les fichiers du repo
- ✅ Écrire des fichiers
- ❌ Mais PAS de supprimer le repo ou changer les settings

---

## 🚀 C'est tout !

Ton système de post-its collaboratifs fonctionne maintenant avec GitHub API ! 🎉

**Avantages de cette méthode** :
- Pas de Firebase = pas de CORS
- Tout sur GitHub = déjà hébergé
- Historique inclus = bonus !
- Facile à debugger

---

Besoin d'aide ? Mets un post-it ! 😄
