// ============================================
// NIZOZ STUDIO - SYSTÈME DE RECHERCHE
// Recherche dans tous les fichiers de documentation
// ============================================

class SearchSystem {
  constructor() {
    this.searchInput = null;
    this.resultsContainer = null;
    this.pages = [];
    this.currentQuery = '';
    
    this.init();
  }
  
  init() {
    this.createResultsContainer();
    this.setupEventListeners();
    this.indexPages();
  }
  
  // Créer le conteneur de résultats
  createResultsContainer() {
    const container = document.createElement('div');
    container.id = 'search-results';
    container.className = 'search-results';
    container.style.cssText = `
      position: absolute;
      top: 100%;
      left: 0;
      right: 0;
      background-color: var(--bg-secondary);
      border: 1px solid var(--border-color);
      border-radius: 8px;
      margin-top: 8px;
      max-height: 400px;
      overflow-y: auto;
      display: none;
      box-shadow: 0 4px 12px var(--shadow-color);
      z-index: 1000;
    `;
    
    const searchContainer = document.querySelector('.search-container');
    if (searchContainer) {
      searchContainer.appendChild(container);
      this.resultsContainer = container;
    }
  }
  
  // Event listeners
  setupEventListeners() {
    this.searchInput = document.querySelector('.search-input');
    
    if (this.searchInput) {
      this.searchInput.addEventListener('input', (e) => {
        this.handleSearch(e.target.value);
      });
      
      this.searchInput.addEventListener('focus', () => {
        if (this.currentQuery) {
          this.resultsContainer.style.display = 'block';
        }
      });
      
      // Fermer en cliquant ailleurs
      document.addEventListener('click', (e) => {
        if (!e.target.closest('.search-container')) {
          this.resultsContainer.style.display = 'none';
        }
      });
    }
  }
  
  // Indexer les pages disponibles
  indexPages() {
    // Liste des pages à indexer (à mettre à jour quand tu ajoutes des pages)
    this.pages = [
      {
        title: 'Accueil',
        url: 'index.html',
        keywords: ['accueil', 'home', 'documentation', 'nizoz', 'studio']
      },
      {
        title: 'Fusion d\'objets - Procedural Mesh',
        url: 'tutorials/fusion-procedural.html',
        keywords: ['fusion', 'procedural', 'mesh', 'combine', 'physique', 'objets', 'unreal']
      }
      // Tu ajouteras d'autres pages ici au fur et à mesure
    ];
  }
  
  // Gérer la recherche
  handleSearch(query) {
    this.currentQuery = query.trim().toLowerCase();
    
    if (this.currentQuery.length < 2) {
      this.resultsContainer.style.display = 'none';
      return;
    }
    
    const results = this.search(this.currentQuery);
    this.displayResults(results);
  }
  
  // Rechercher dans les pages
  search(query) {
    const results = [];
    const words = query.split(' ').filter(w => w.length > 1);
    
    this.pages.forEach(page => {
      let score = 0;
      let matches = [];
      
      // Chercher dans le titre
      if (page.title.toLowerCase().includes(query)) {
        score += 10;
        matches.push({ type: 'title', text: page.title });
      }
      
      // Chercher dans les mots-clés
      words.forEach(word => {
        page.keywords.forEach(keyword => {
          if (keyword.includes(word)) {
            score += 5;
            if (!matches.find(m => m.text === keyword)) {
              matches.push({ type: 'keyword', text: keyword });
            }
          }
        });
      });
      
      if (score > 0) {
        results.push({
          page,
          score,
          matches
        });
      }
    });
    
    // Trier par score décroissant
    results.sort((a, b) => b.score - a.score);
    
    return results;
  }
  
  // Afficher les résultats
  displayResults(results) {
    if (results.length === 0) {
      this.resultsContainer.innerHTML = `
        <div style="padding: 20px; text-align: center; color: var(--text-secondary);">
          <p>Aucun résultat trouvé pour "${this.currentQuery}"</p>
        </div>
      `;
      this.resultsContainer.style.display = 'block';
      return;
    }
    
    let html = '';
    
    results.forEach((result, index) => {
      html += `
        <a href="${result.page.url}" class="search-result-item" style="
          display: block;
          padding: 16px 20px;
          text-decoration: none;
          color: var(--text-primary);
          border-bottom: 1px solid var(--border-color);
          transition: background-color 0.2s ease;
        " onmouseover="this.style.backgroundColor='var(--bg-tertiary)'" 
           onmouseout="this.style.backgroundColor='transparent'">
          <div style="font-weight: 600; margin-bottom: 4px; color: var(--primary-color);">
            ${this.highlightQuery(result.page.title)}
          </div>
          <div style="font-size: 12px; color: var(--text-secondary);">
            ${result.matches.slice(0, 3).map(m => this.highlightQuery(m.text)).join(' • ')}
          </div>
        </a>
      `;
      
      if (index === results.length - 1) {
        html = html.replace('border-bottom: 1px solid var(--border-color);', '');
      }
    });
    
    this.resultsContainer.innerHTML = html;
    this.resultsContainer.style.display = 'block';
  }
  
  // Surligner le texte recherché
  highlightQuery(text) {
    if (!this.currentQuery) return text;
    
    const regex = new RegExp(`(${this.currentQuery})`, 'gi');
    return text.replace(regex, '<mark style="background-color: var(--primary-color); color: white; padding: 2px 4px; border-radius: 3px;">$1</mark>');
  }
  
  // Ajouter une page à l'index (pour les nouvelles pages)
  addPage(title, url, keywords) {
    this.pages.push({ title, url, keywords });
  }
  
  // Mettre à jour l'index complet
  updateIndex(pages) {
    this.pages = pages;
  }
}

// Initialiser le système au chargement
let searchSystem;
document.addEventListener('DOMContentLoaded', () => {
  searchSystem = new SearchSystem();
});
