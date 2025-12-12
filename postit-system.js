// ============================================
// NIZOZ STUDIO - SYSTÈME DE POST-ITS
// Version GitHub API (sans Firebase)
// ============================================

class PostItSystem {
  constructor() {
    this.postits = [];
    this.currentPage = this.normalizePagePath(window.location.pathname);
    this.draggedPostit = null;
    this.offset = { x: 0, y: 0 };
    this.username = null;
    this.isEditing = false;
    this.updateTimers = {};
    this.githubReady = false;
    this.fileSha = null;
    this.refreshTimer = null;
    
    this.init();
  }
  
  normalizePagePath(path) {
    return path.replace(/^\//, '').replace(/\//g, '_').replace(/\.html$/, '') || 'index';
  }
  
  init() {
    this.askUsername();
    this.initGitHub();
    this.createFAB();
    this.setupEventListeners();
  }
  
  askUsername() {
    this.username = localStorage.getItem('nizoz_username');
    if (!this.username) {
      this.username = prompt('👋 Entre ton pseudo:', 'Anonyme');
      if (!this.username || this.username.trim() === '') {
        this.username = 'Anonyme';
      }
      localStorage.setItem('nizoz_username', this.username);
    }
  }
  
  initGitHub() {
    if (typeof githubConfig === 'undefined') {
      console.warn('⚠️ GitHub config non trouvée, mode local');
      this.githubReady = false;
      this.loadPostitsLocal();
      return;
    }
    
    this.config = githubConfig;
    this.githubReady = true;
    console.log('✅ Mode GitHub API');
    this.loadPostitsGitHub();
    this.startAutoRefresh();
  }
  
  startAutoRefresh() {
    if (!this.githubReady) return;
    this.refreshTimer = setInterval(() => {
      if (!this.isEditing) {
        this.loadPostitsGitHub(true);
      }
    }, this.config.refreshInterval * 1000);
  }
  
  stopAutoRefresh() {
    if (this.refreshTimer) {
      clearInterval(this.refreshTimer);
      this.refreshTimer = null;
    }
  }
  
  async loadPostitsGitHub(silent = false) {
    if (!this.githubReady) return;
    
    try {
      const url = `https://api.github.com/repos/${this.config.owner}/${this.config.repo}/contents/${this.config.postitFile}?ref=${this.config.branch}`;
      const headers = {'Accept': 'application/vnd.github.v3+json'};
      if (this.config.token) headers['Authorization'] = `token ${this.config.token}`;
      
      const response = await fetch(url, { headers });
      if (!response.ok) throw new Error(`GitHub API error: ${response.status}`);
      
      const data = await response.json();
      this.fileSha = data.sha;
      const content = JSON.parse(atob(data.content));
      
      if (content.postits && content.postits[this.currentPage]) {
        this.postits = Object.values(content.postits[this.currentPage]);
      } else {
        this.postits = [];
      }
      
      if (!silent) {
        this.renderPostits();
      } else {
        this.updateExistingPostits();
      }
    } catch (error) {
      console.error('❌ Erreur GitHub API:', error);
      if (!silent) {
        this.githubReady = false;
        this.loadPostitsLocal();
      }
    }
  }
  
  updateExistingPostits() {
    this.postits.forEach(postit => {
      const element = document.querySelector(`[data-postit-id="${postit.id}"]`);
      if (element) {
        const colors = ['yellow', 'green', 'pink', 'blue', 'orange'];
        colors.forEach(color => element.classList.remove(color));
        element.classList.add(postit.color);
        
        const textarea = element.querySelector('.postit-content');
        if (textarea && document.activeElement !== textarea && textarea.value !== postit.content) {
          textarea.value = postit.content;
        }
        
        element.style.left = postit.x + 'px';
        element.style.top = postit.y + 'px';
      } else {
        document.body.appendChild(this.createPostitElement(postit));
      }
    });
    
    document.querySelectorAll('.postit').forEach(el => {
      const id = parseInt(el.getAttribute('data-postit-id'));
      if (!this.postits.find(p => p.id === id)) el.remove();
    });
  }
  
  async savePostitsGitHub() {
    if (!this.githubReady) {
      this.savePostitsLocal();
      return;
    }
    
    try {
      const getUrl = `https://api.github.com/repos/${this.config.owner}/${this.config.repo}/contents/${this.config.postitFile}?ref=${this.config.branch}`;
      const headers = {'Accept': 'application/vnd.github.v3+json', 'Content-Type': 'application/json'};
      if (this.config.token) headers['Authorization'] = `token ${this.config.token}`;
      
      const getResponse = await fetch(getUrl, { headers });
      let currentContent = { postits: {} };
      let currentSha = this.fileSha;
      
      if (getResponse.ok) {
        const getData = await getResponse.json();
        currentSha = getData.sha;
        currentContent = JSON.parse(atob(getData.content));
      }
      
      if (!currentContent.postits) currentContent.postits = {};
      currentContent.postits[this.currentPage] = {};
      this.postits.forEach(postit => {
        currentContent.postits[this.currentPage][postit.id] = postit;
      });
      
      const newContent = btoa(unescape(encodeURIComponent(JSON.stringify(currentContent, null, 2))));
      const putUrl = `https://api.github.com/repos/${this.config.owner}/${this.config.repo}/contents/${this.config.postitFile}`;
      
      const putResponse = await fetch(putUrl, {
        method: 'PUT',
        headers: headers,
        body: JSON.stringify({
          message: `Update post-its for ${this.currentPage} by ${this.username}`,
          content: newContent,
          sha: currentSha,
          branch: this.config.branch
        })
      });
      
      if (!putResponse.ok) throw new Error(`GitHub PUT error: ${putResponse.status}`);
      
      const putData = await putResponse.json();
      this.fileSha = putData.content.sha;
      console.log('✅ Post-its sauvegardés sur GitHub');
    } catch (error) {
      console.error('❌ Erreur sauvegarde GitHub:', error);
      this.savePostitsLocal();
    }
  }
  
  loadPostitsLocal() {
    const saved = localStorage.getItem('nizoz_postits');
    if (saved) {
      try {
        const allPostits = JSON.parse(saved);
        this.postits = allPostits.filter(p => p.page === this.currentPage);
      } catch (e) {
        this.postits = [];
      }
    }
    this.renderPostits();
  }
  
  savePostitsLocal() {
    const saved = localStorage.getItem('nizoz_postits');
    let allPostits = [];
    if (saved) {
      try {
        allPostits = JSON.parse(saved);
        allPostits = allPostits.filter(p => p.page !== this.currentPage);
      } catch (e) {}
    }
    allPostits = allPostits.concat(this.postits);
    localStorage.setItem('nizoz_postits', JSON.stringify(allPostits));
  }
  
  createFAB() {
    const fab = document.createElement('button');
    fab.className = 'fab-postit';
    fab.innerHTML = '📝';
    fab.title = 'Créer un post-it';
    fab.onclick = () => this.createPostit();
    document.body.appendChild(fab);
  }
  
  setupEventListeners() {
    document.addEventListener('mousemove', (e) => this.onDrag(e));
    document.addEventListener('mouseup', () => this.stopDrag());
    window.addEventListener('beforeunload', () => this.stopAutoRefresh());
  }
  
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
    this.postits.push(postit);
    this.renderPostits();
    this.githubReady ? this.savePostitsGitHub() : this.savePostitsLocal();
  }
  
  deletePostit(id) {
    this.postits = this.postits.filter(p => p.id !== id);
    this.renderPostits();
    this.githubReady ? this.savePostitsGitHub() : this.savePostitsLocal();
  }
  
  changeColor(id) {
    const colors = ['yellow', 'green', 'pink', 'blue', 'orange'];
    const postit = this.postits.find(p => p.id === id);
    if (postit) {
      const currentIndex = colors.indexOf(postit.color);
      postit.color = colors[(currentIndex + 1) % colors.length];
      this.renderPostits();
      this.githubReady ? this.savePostitsGitHub() : this.savePostitsLocal();
    }
  }
  
  updateContent(id, content) {
    const postit = this.postits.find(p => p.id === id);
    if (postit) {
      postit.content = content;
      postit.lastEditedBy = this.username;
      postit.lastEditedAt = new Date().toISOString();
      
      if (this.updateTimers[id]) clearTimeout(this.updateTimers[id]);
      this.updateTimers[id] = setTimeout(() => {
        this.githubReady ? this.savePostitsGitHub() : this.savePostitsLocal();
        delete this.updateTimers[id];
      }, 1000);
    }
  }
  
  updatePosition(id, x, y) {
    const postit = this.postits.find(p => p.id === id);
    if (postit) {
      postit.x = x;
      postit.y = y;
      this.githubReady ? this.savePostitsGitHub() : this.savePostitsLocal();
    }
  }
  
  startDrag(e, id) {
    e.preventDefault();
    const postit = this.postits.find(p => p.id === id);
    const element = e.currentTarget.closest('.postit');
    if (postit && element) {
      this.draggedPostit = postit;
      const rect = element.getBoundingClientRect();
      this.offset.x = e.clientX - rect.left;
      this.offset.y = e.clientY - rect.top;
      element.classList.add('dragging');
    }
  }
  
  onDrag(e) {
    if (this.draggedPostit) {
      const element = document.querySelector(`[data-postit-id="${this.draggedPostit.id}"]`);
      if (element) {
        element.style.left = (e.clientX - this.offset.x) + 'px';
        element.style.top = (e.clientY - this.offset.y) + 'px';
      }
    }
  }
  
  stopDrag() {
    if (this.draggedPostit) {
      const element = document.querySelector(`[data-postit-id="${this.draggedPostit.id}"]`);
      if (element) {
        element.classList.remove('dragging');
        this.updatePosition(this.draggedPostit.id, parseInt(element.style.left), parseInt(element.style.top));
      }
      this.draggedPostit = null;
    }
  }
  
  renderPostits() {
    document.querySelectorAll('.postit').forEach(el => el.remove());
    this.postits.forEach(postit => document.body.appendChild(this.createPostitElement(postit)));
  }
  
  createPostitElement(postit) {
    const div = document.createElement('div');
    div.className = `postit ${postit.color}`;
    div.setAttribute('data-postit-id', postit.id);
    div.style.left = postit.x + 'px';
    div.style.top = postit.y + 'px';
    
    const header = document.createElement('div');
    header.className = 'postit-header';
    header.onmousedown = (e) => this.startDrag(e, postit.id);
    
    if (postit.author) {
      const authorInfo = document.createElement('span');
      authorInfo.className = 'postit-author';
      authorInfo.style.cssText = 'font-size: 9px; color: rgba(0,0,0,0.4); flex: 1; padding-left: 4px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;';
      authorInfo.textContent = postit.author;
      authorInfo.title = `Créé par ${postit.author}${postit.lastEditedBy ? `\nDernier edit: ${postit.lastEditedBy}` : ''}`;
      header.appendChild(authorInfo);
    }
    
    const colorBtn = document.createElement('button');
    colorBtn.className = 'postit-btn color';
    colorBtn.innerHTML = '🎨';
    colorBtn.title = 'Changer couleur';
    colorBtn.onclick = (e) => {
      e.stopPropagation();
      this.changeColor(postit.id);
    };
    
    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'postit-btn delete';
    deleteBtn.innerHTML = '✕';
    deleteBtn.title = 'Supprimer';
    deleteBtn.onclick = (e) => {
      e.stopPropagation();
      if (confirm('Supprimer ce post-it ?')) this.deletePostit(postit.id);
    };
    
    header.appendChild(colorBtn);
    header.appendChild(deleteBtn);
    
    const textarea = document.createElement('textarea');
    textarea.className = 'postit-content';
    textarea.value = postit.content;
    textarea.placeholder = 'Écrivez votre note...';
    textarea.onfocus = () => this.isEditing = true;
    textarea.onblur = () => this.isEditing = false;
    textarea.oninput = (e) => this.updateContent(postit.id, e.target.value);
    
    div.appendChild(header);
    div.appendChild(textarea);
    return div;
  }
  
  changeUsername() {
    const newUsername = prompt('👋 Nouveau pseudo:', this.username);
    if (newUsername && newUsername.trim() !== '') {
      this.username = newUsername.trim();
      localStorage.setItem('nizoz_username', this.username);
      alert(`✅ Pseudo changé en "${this.username}"`);
    }
  }
}

let postitSystem;
document.addEventListener('DOMContentLoaded', () => {
  postitSystem = new PostItSystem();
});
