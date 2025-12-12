// ============================================
// NIZOZ STUDIO - CONFIGURATION GITHUB API
// Pour les post-its collaboratifs
// ============================================

// ⚠️ CONFIGURATION À REMPLIR

const githubConfig = {
  // Ton username GitHub
  owner: "Nizeus6o", // ← Change si c'est pas ça
  
  // Le nom de ton repo
  repo: "TutoUEs", // ← Change si nécessaire
  
  // La branche (généralement 'main' ou 'master')
  branch: "main",
  
  // Le fichier qui stockera les post-its
  postitFile: "postits.json",
  
  // Token GitHub (OPTIONNEL mais recommandé pour éviter les limits)
  // Pour créer un token :
  // 1. Va sur https://github.com/settings/tokens
  // 2. "Generate new token" → "Classic"
  // 3. Nom : "NIZOZ Docs Postits"
  // 4. Coche uniquement : "repo" (Full control of private repositories)
  // 5. Generate token
  // 6. COPIE le token ici (tu le verras qu'une fois !)
  token: "", // ← Colle ton token ici (optionnel)
  
  // Délai de refresh en secondes (combien de temps entre chaque vérification)
  refreshInterval: 10 // Vérifie les nouveaux post-its toutes les 10 secondes
};

// Ne pas toucher
window.githubConfig = githubConfig;
