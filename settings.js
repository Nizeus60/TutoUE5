// ============================================
// NIZOZ STUDIO - SYSTÈME DE PARAMÈTRES
// Gestion des préférences utilisateur
// ============================================

class SettingsSystem {
  constructor() {
    this.modal = null;
    this.settings = {
      theme: 'dark', // 'dark' ou 'light'
      primaryColor: '#00aaff'
    };
    
    this.colorPresets = [
      { name: 'Bleu', color: '#00aaff' },
      { name: 'Violet', color: '#9c27b0' },
      { name: 'Vert', color: '#4caf50' },
      { name: 'Orange', color: '#ff9800' },
      { name: 'Rouge', color: '#f44336' }
    ];
    
    this.init();
  }
  
  init() {
    this.loadSettings();
    this.applySettings();
    this.createModal();
    this.setupEventListeners();
  }
  
  // Créer le modal des paramètres
  createModal() {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.id = 'settings-modal';
    
    modal.innerHTML = `
      <div class="modal-content fade-in">
        <div class="modal-header">
          <h2 class="modal-title">⚙️ Paramètres</h2>
          <button class="modal-close" onclick="settingsSystem.closeModal()">✕</button>
        </div>
        
        <div class="modal-body">
          <!-- Thème -->
          <div class="setting-group">
            <label class="setting-label">🌓 Thème</label>
            <div class="toggle-buttons">
              <button class="toggle-btn ${this.settings.theme === 'dark' ? 'active' : ''}" 
                      onclick="settingsSystem.setTheme('dark')">
                🌙 Dark
              </button>
              <button class="toggle-btn ${this.settings.theme === 'light' ? 'active' : ''}" 
                      onclick="settingsSystem.setTheme('light')">
                ☀️ Light
              </button>
            </div>
          </div>
          
          <!-- Couleur principale -->
          <div class="setting-group">
            <label class="setting-label">🎨 Couleur principale</label>
            <div class="color-picker-container">
              <div class="color-presets">
                ${this.colorPresets.map((preset, index) => `
                  <button 
                    class="color-preset ${this.settings.primaryColor === preset.color ? 'active' : ''}"
                    style="background-color: ${preset.color};"
                    title="${preset.name}"
                    onclick="settingsSystem.setColor('${preset.color}')"
                  ></button>
                `).join('')}
              </div>
              
              <input 
                type="color" 
                class="custom-color-input" 
                value="${this.settings.primaryColor}"
                onchange="settingsSystem.setColor(this.value)"
                title="Couleur personnalisée"
              />
            </div>
          </div>
          
          <!-- Actions -->
          <div class="setting-group">
            <button 
              class="toggle-btn" 
              style="width: 100%; background-color: var(--primary-color); color: white;"
              onclick="settingsSystem.resetSettings()"
            >
              🔄 Réinitialiser les paramètres
            </button>
          </div>
        </div>
      </div>
    `;
    
    document.body.appendChild(modal);
    this.modal = modal;
    
    // Fermer en cliquant en dehors
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        this.closeModal();
      }
    });
  }
  
  // Event listeners
  setupEventListeners() {
    // Bouton paramètres dans le header
    const settingsBtn = document.querySelector('[data-action="settings"]');
    if (settingsBtn) {
      settingsBtn.addEventListener('click', () => this.openModal());
    }
    
    // Bouton toggle thème
    const themeBtn = document.querySelector('[data-action="toggle-theme"]');
    if (themeBtn) {
      themeBtn.addEventListener('click', () => this.toggleTheme());
    }
    
    // Raccourci clavier (Ctrl/Cmd + ,)
    document.addEventListener('keydown', (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === ',') {
        e.preventDefault();
        this.openModal();
      }
      
      // Echap pour fermer
      if (e.key === 'Escape' && this.modal.classList.contains('active')) {
        this.closeModal();
      }
    });
  }
  
  // Ouvrir le modal
  openModal() {
    this.modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
  
  // Fermer le modal
  closeModal() {
    this.modal.classList.remove('active');
    document.body.style.overflow = '';
  }
  
  // Changer le thème
  setTheme(theme) {
    this.settings.theme = theme;
    this.applyTheme();
    this.saveSettings();
    this.updateModalButtons();
  }
  
  // Toggle thème (dark ↔ light)
  toggleTheme() {
    const newTheme = this.settings.theme === 'dark' ? 'light' : 'dark';
    this.setTheme(newTheme);
  }
  
  // Appliquer le thème
  applyTheme() {
    if (this.settings.theme === 'light') {
      document.body.classList.add('light-mode');
    } else {
      document.body.classList.remove('light-mode');
    }
    
    // Mettre à jour l'icône du bouton
    const themeBtn = document.querySelector('[data-action="toggle-theme"]');
    if (themeBtn) {
      themeBtn.innerHTML = this.settings.theme === 'dark' ? '☀️' : '🌙';
      themeBtn.title = this.settings.theme === 'dark' ? 'Mode clair' : 'Mode sombre';
    }
  }
  
  // Changer la couleur
  setColor(color) {
    this.settings.primaryColor = color;
    this.applyColor();
    this.saveSettings();
    this.updateModalButtons();
  }
  
  // Appliquer la couleur
  applyColor() {
    // Calculer les variantes
    const hoverColor = this.adjustColor(this.settings.primaryColor, -20);
    const lightColor = this.adjustColor(this.settings.primaryColor, 20);
    
    document.documentElement.style.setProperty('--primary-color', this.settings.primaryColor);
    document.documentElement.style.setProperty('--primary-hover', hoverColor);
    document.documentElement.style.setProperty('--primary-light', lightColor);
  }
  
  // Ajuster la luminosité d'une couleur
  adjustColor(color, amount) {
    const num = parseInt(color.replace('#', ''), 16);
    const r = Math.max(0, Math.min(255, (num >> 16) + amount));
    const g = Math.max(0, Math.min(255, (num >> 8 & 0x00FF) + amount));
    const b = Math.max(0, Math.min(255, (num & 0x0000FF) + amount));
    return '#' + (0x1000000 + (r << 16) + (g << 8) + b).toString(16).slice(1);
  }
  
  // Appliquer tous les paramètres
  applySettings() {
    this.applyTheme();
    this.applyColor();
  }
  
  // Sauvegarder les paramètres
  saveSettings() {
    localStorage.setItem('nizoz_settings', JSON.stringify(this.settings));
  }
  
  // Charger les paramètres
  loadSettings() {
    const saved = localStorage.getItem('nizoz_settings');
    if (saved) {
      try {
        this.settings = { ...this.settings, ...JSON.parse(saved) };
      } catch (e) {
        console.error('Erreur de chargement des paramètres:', e);
      }
    }
  }
  
  // Réinitialiser les paramètres
  resetSettings() {
    if (confirm('Réinitialiser tous les paramètres aux valeurs par défaut ?')) {
      this.settings = {
        theme: 'dark',
        primaryColor: '#00aaff'
      };
      this.applySettings();
      this.saveSettings();
      this.updateModalButtons();
    }
  }
  
  // Mettre à jour les boutons du modal
  updateModalButtons() {
    // Mettre à jour les boutons de thème
    document.querySelectorAll('#settings-modal .toggle-btn').forEach(btn => {
      const isDark = btn.textContent.includes('Dark');
      if (isDark) {
        btn.classList.toggle('active', this.settings.theme === 'dark');
      } else {
        btn.classList.toggle('active', this.settings.theme === 'light');
      }
    });
    
    // Mettre à jour les presets de couleur
    document.querySelectorAll('.color-preset').forEach(btn => {
      const color = btn.style.backgroundColor;
      const hexColor = this.rgbToHex(color);
      btn.classList.toggle('active', hexColor.toLowerCase() === this.settings.primaryColor.toLowerCase());
    });
    
    // Mettre à jour l'input couleur
    const colorInput = document.querySelector('.custom-color-input');
    if (colorInput) {
      colorInput.value = this.settings.primaryColor;
    }
  }
  
  // Convertir RGB en Hex
  rgbToHex(rgb) {
    const result = rgb.match(/\d+/g);
    if (!result) return '#000000';
    const r = parseInt(result[0]);
    const g = parseInt(result[1]);
    const b = parseInt(result[2]);
    return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
  }
}

// Initialiser le système au chargement
let settingsSystem;
document.addEventListener('DOMContentLoaded', () => {
  settingsSystem = new SettingsSystem();
});
