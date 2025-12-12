// ============================================
// NIZOZ STUDIO - SYSTÈME DE POST-ITS
// Gestion des notes adhésives collaboratives avec Firebase
// ============================================

class PostItSystem {
  constructor() {
    this.postits = [];
    this.currentPage = this.normalizePagePath(window.location.pathname);
    this.draggedPostit = null;
    this.offset = { x: 0, y: 0 };
    this.database = null;
    this.firebaseReady = false;
    this.username = null;
    
    this.init();
  }
  
  // Normaliser le chemin de la page (pour éviter les problèmes)
  normalizePagePath(path) {
    // Enlever le slash initial et remplacer les / par _
    return path.replace(/^\//, '').replace(/\//g, '_').replace(/\.html$/, '') || 'index';
  }
  
  init() {
    // Demander le pseudo de l'utilisateur
    this.askUsername();
    
    // Initialiser Firebase
    this.initFirebase();
    
    // Créer le bouton FAB
    this.createFAB();
    
    // Event listeners
    this.setupEventListeners();
  }
  
  // Demander le pseudo
  askUsername() {
    // Essayer de récupérer depuis localStorage
    this.username = localStorage.getItem('nizoz_username');
    
    if (!this.username) {
      this.username = prompt('👋 Entre ton pseudo pour les post-its collaboratifs:', 'Anonyme');
      if (!this.username || this.username.trim() === '') {
        this.username = 'Anonyme';
      }
      localStorage.setItem('nizoz_username', this.username);
    }
  }
  
  // Initialiser Firebase
  initFirebase() {
    if (typeof firebase === 'undefined') {
      console.warn('⚠️ Firebase non chargé, utilisation du mode local uniquement');
      this.firebaseReady = false;
      this.loadPostitsLocal();
      this.renderPostits();
      return;
    }
    
    try {
      if (typeof initFirebase === 'function') {
        const success = initFirebase();
        if (success) {
          this.database = getDatabase();
          this.firebaseReady = true;
          console.log('✅ Post-its collaboratifs activés');
          this.loadPostitsFirebase();
          this.listenToChanges();
        } else {
          throw new Error('Initialisation Firebase échouée');
        }
      } else {
        throw new Error('initFirebase non disponible');
      }
    } catch (error) {
      console.warn('⚠️ Erreur Firebase, utilisation du mode local:', error);
      this.firebaseReady = false;
      this.loadPostitsLocal();
      this.renderPostits();
    }
  }
  
  // Écouter les changements Firebase en temps réel
  listenToChanges() {
    const ref = this.database.ref(`postits/${this.currentPage}`);
    
    ref.on('value', (snapshot) => {
      const data = snapshot.val();
      if (data) {
        this.postits = Object.values(data);
      } else {
        this.postits = [];
      }
      this.renderPostits();
    });
  }
  
  // Charger depuis Firebase
  loadPostitsFirebase() {
    const ref = this.database.ref(`postits/${this.currentPage}`);
    ref.once('value', (snapshot) => {
      const data = snapshot.val();
      if (data) {
        this.postits = Object.values(data);
      }
      this.renderPostits();
    });
  }
  
  // Charger depuis localStorage (fallback)
  loadPostitsLocal() {
    const saved = localStorage.getItem('nizoz_postits');
    if (saved) {
      try {
        const allPostits = JSON.parse(saved);
        this.postits = allPostits.filter(p => p.page === this.currentPage);
      } catch (e) {
        console.error('Erreur de chargement des post-its:', e);
        this.postits = [];
      }
    }
    this.renderPostits();
  }
  
  // Créer le bouton flottant
  createFAB() {
    const fab = document.createElement('button');
    fab.className = 'fab-postit';
    fab.innerHTML = '📝';
    fab.title = 'Créer un post-it';
    fab.onclick = () => this.createPostit();
    document.body.appendChild(fab);
  }
  
  // Event listeners globaux
  setupEventListeners() {
    document.addEventListener('mousemove', (e) => this.onDrag(e));
    document.addEventListener('mouseup', () => this.stopDrag());
  }
  
  // Créer un nouveau post-it
  createPostit() {
    const postit = {
      id: Date.now(),
      page: this.currentPage,
      x: window.innerWidth / 2 - 100,
      y: window.innerHeight / 2 - 75,
      color: 'yellow',
      content: 'Nouveau post-it...',
      author: this.username,
      createdAt: new Date().toISOString()
    };
    
    if (this.firebaseReady) {
      this.savePostitFirebase(postit);
    } else {
      this.postits.push(postit);
      this.savePostitsLocal();
      this.renderPostits();
    }
  }
  
  // Sauvegarder un post-it dans Firebase
  savePostitFirebase(postit) {
    const ref = this.database.ref(`postits/${this.currentPage}/${postit.id}`);
    ref.set(postit);
  }
  
  // Supprimer un post-it
  deletePostit(id) {
    if (this.firebaseReady) {
      const ref = this.database.ref(`postits/${this.currentPage}/${id}`);
      ref.remove();
    } else {
      this.postits = this.postits.filter(p => p.id !== id);
      this.savePostitsLocal();
      this.renderPostits();
    }
  }
  
  // Changer la couleur d'un post-it
  changeColor(id) {
    const colors = ['yellow', 'green', 'pink', 'blue', 'orange'];
    const postit = this.postits.find(p => p.id === id);
    
    if (postit) {
      const currentIndex = colors.indexOf(postit.color);
      const nextIndex = (currentIndex + 1) % colors.length;
      postit.color = colors[nextIndex];
      
      if (this.firebaseReady) {
        this.savePostitFirebase(postit);
      } else {
        this.savePostitsLocal();
        this.renderPostits();
      }
    }
  }
  
  // Mettre à jour le contenu (avec debounce pour éviter trop d'updates Firebase)
  updateContent(id, content) {
    const postit = this.postits.find(p => p.id === id);
    if (postit) {
      postit.content = content;
      postit.lastEditedBy = this.username;
      postit.lastEditedAt = new Date().toISOString();
      
      // Annuler le timer précédent
      if (this.updateTimers && this.updateTimers[id]) {
        clearTimeout(this.updateTimers[id]);
      }
      
      // Initialiser updateTimers si nécessaire
      if (!this.updateTimers) {
        this.updateTimers = {};
      }
      
      // Attendre 500ms avant de sauvegarder (debounce)
      this.updateTimers[id] = setTimeout(() => {
        if (this.firebaseReady) {
          this.savePostitFirebase(postit);
        } else {
          this.savePostitsLocal();
        }
        delete this.updateTimers[id];
      }, 500);
    }
  }
  
  // Mettre à jour la position
  updatePosition(id, x, y) {
    const postit = this.postits.find(p => p.id === id);
    if (postit) {
      postit.x = x;
      postit.y = y;
      
      if (this.firebaseReady) {
        this.savePostitFirebase(postit);
      } else {
        this.savePostitsLocal();
      }
    }
  }
  
  // Commencer le drag
  startDrag(e, id) {
    e.preventDefault();
    const postit = this.postits.find(p => p.id === id);
    const element = e.currentTarget;
    
    if (postit && element) {
      this.draggedPostit = postit;
      const rect = element.getBoundingClientRect();
      this.offset.x = e.clientX - rect.left;
      this.offset.y = e.clientY - rect.top;
      element.classList.add('dragging');
    }
  }
  
  // Pendant le drag
  onDrag(e) {
    if (this.draggedPostit) {
      const element = document.querySelector(`[data-postit-id="${this.draggedPostit.id}"]`);
      if (element) {
        const newX = e.clientX - this.offset.x;
        const newY = e.clientY - this.offset.y;
        
        element.style.left = newX + 'px';
        element.style.top = newY + 'px';
      }
    }
  }
  
  // Arrêter le drag
  stopDrag() {
    if (this.draggedPostit) {
      const element = document.querySelector(`[data-postit-id="${this.draggedPostit.id}"]`);
      if (element) {
        element.classList.remove('dragging');
        
        // Sauvegarder la nouvelle position
        const newX = parseInt(element.style.left);
        const newY = parseInt(element.style.top);
        this.updatePosition(this.draggedPostit.id, newX, newY);
      }
      
      this.draggedPostit = null;
    }
  }
  
  // Afficher tous les post-its de la page actuelle (smart render)
  renderPostits() {
    // Récupérer les IDs des post-its actuellement affichés
    const existingIds = new Set();
    document.querySelectorAll('.postit').forEach(el => {
      existingIds.add(parseInt(el.getAttribute('data-postit-id')));
    });
    
    // Récupérer les IDs des post-its qui devraient être affichés
    const currentIds = new Set(this.postits.map(p => p.id));
    
    // Supprimer les post-its qui ne sont plus dans la liste
    document.querySelectorAll('.postit').forEach(el => {
      const id = parseInt(el.getAttribute('data-postit-id'));
      if (!currentIds.has(id)) {
        el.remove();
      }
    });
    
    // Ajouter les nouveaux post-its
    this.postits.forEach(postit => {
      if (!existingIds.has(postit.id)) {
        const element = this.createPostitElement(postit);
        document.body.appendChild(element);
      } else {
        // Mettre à jour seulement la couleur si elle a changé (pas le contenu pour éviter de perdre le focus)
        const existingElement = document.querySelector(`[data-postit-id="${postit.id}"]`);
        if (existingElement) {
          // Update couleur
          const colors = ['yellow', 'green', 'pink', 'blue', 'orange'];
          colors.forEach(color => existingElement.classList.remove(color));
          existingElement.classList.add(postit.color);
          
          // Update auteur si changé
          const authorSpan = existingElement.querySelector('.postit-author');
          if (authorSpan && postit.author) {
            authorSpan.textContent = postit.author;
            authorSpan.title = `Créé par ${postit.author}${postit.lastEditedBy ? `\nDernier edit: ${postit.lastEditedBy}` : ''}`;
          }
          
          // Update contenu SEULEMENT si le textarea n'a pas le focus
          const textarea = existingElement.querySelector('.postit-content');
          if (textarea && document.activeElement !== textarea) {
            if (textarea.value !== postit.content) {
              textarea.value = postit.content;
            }
          }
        }
      }
    });
  }
  
  // Créer l'élément HTML d'un post-it
  createPostitElement(postit) {
    const div = document.createElement('div');
    div.className = `postit ${postit.color}`;
    div.setAttribute('data-postit-id', postit.id);
    div.style.left = postit.x + 'px';
    div.style.top = postit.y + 'px';
    
    // Header avec boutons
    const header = document.createElement('div');
    header.className = 'postit-header';
    header.onmousedown = (e) => this.startDrag(e, postit.id);
    
    // Info auteur (petit texte)
    if (postit.author) {
      const authorInfo = document.createElement('span');
      authorInfo.className = 'postit-author';
      authorInfo.style.cssText = 'font-size: 9px; color: rgba(0,0,0,0.4); flex: 1; padding-left: 4px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;';
      authorInfo.textContent = postit.author;
      authorInfo.title = `Créé par ${postit.author}${postit.lastEditedBy ? `\nDernier edit: ${postit.lastEditedBy}` : ''}`;
      header.appendChild(authorInfo);
    }
    
    // Bouton changer couleur
    const colorBtn = document.createElement('button');
    colorBtn.className = 'postit-btn color';
    colorBtn.innerHTML = '🎨';
    colorBtn.title = 'Changer la couleur';
    colorBtn.onclick = (e) => {
      e.stopPropagation();
      this.changeColor(postit.id);
    };
    
    // Bouton supprimer
    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'postit-btn delete';
    deleteBtn.innerHTML = '✕';
    deleteBtn.title = 'Supprimer';
    deleteBtn.onclick = (e) => {
      e.stopPropagation();
      if (confirm('Supprimer ce post-it ?')) {
        this.deletePostit(postit.id);
      }
    };
    
    header.appendChild(colorBtn);
    header.appendChild(deleteBtn);
    
    // Contenu
    const textarea = document.createElement('textarea');
    textarea.className = 'postit-content';
    textarea.value = postit.content;
    textarea.placeholder = 'Écrivez votre note...';
    textarea.oninput = (e) => this.updateContent(postit.id, e.target.value);
    
    div.appendChild(header);
    div.appendChild(textarea);
    
    return div;
  }
  
  // Sauvegarder dans localStorage (fallback)
  savePostitsLocal() {
    // Récupérer tous les post-its de toutes les pages
    const saved = localStorage.getItem('nizoz_postits');
    let allPostits = [];
    
    if (saved) {
      try {
        allPostits = JSON.parse(saved);
        // Enlever les post-its de la page actuelle
        allPostits = allPostits.filter(p => p.page !== this.currentPage);
      } catch (e) {
        console.error('Erreur:', e);
      }
    }
    
    // Ajouter les post-its actuels
    allPostits = allPostits.concat(this.postits);
    
    localStorage.setItem('nizoz_postits', JSON.stringify(allPostits));
  }
  
  // Obtenir tous les post-its (pour la vue globale)
  getAllPostits() {
    return this.postits;
  }
  
  // Changer le pseudo
  changeUsername() {
    const newUsername = prompt('👋 Nouveau pseudo:', this.username);
    if (newUsername && newUsername.trim() !== '') {
      this.username = newUsername.trim();
      localStorage.setItem('nizoz_username', this.username);
      alert(`✅ Pseudo changé en "${this.username}"`);
    }
  }
}

// Initialiser le système au chargement de la page
let postitSystem;
document.addEventListener('DOMContentLoaded', () => {
  postitSystem = new PostItSystem();
});
