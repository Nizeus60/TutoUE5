// ============================================
// NIZOZ STUDIO - CONFIGURATION FIREBASE
// ============================================

// ⚠️ IMPORTANT : Remplace ces valeurs par tes propres clés Firebase
// Tu les obtiendras en suivant le guide dans firebase-setup.md

const firebaseConfig = {
  apiKey: "AIzaSyBfvXTraWBv2c4hO9s7XH8Vaj-j9H4P_R0",
  authDomain: "nizoz-studio-docs.firebaseapp.com",
  databaseURL: "https://nizoz-studio-docs-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "nizoz-studio-docs",
  storageBucket: "nizoz-studio-docs.firebasestorage.app",
  messagingSenderId: "53103731738",
  appId: "1:53103731738:web:0be7fe8f2a40db0d379da3"
};

// Ne touche pas à ça
let firebaseApp;
let database;

// Initialiser Firebase
function initFirebase() {
  try {
    firebaseApp = firebase.initializeApp(firebaseConfig);
    database = firebase.database();
    console.log('✅ Firebase initialisé avec succès');
    return true;
  } catch (error) {
    console.error('❌ Erreur Firebase:', error);
    return false;
  }
}

// Export pour utilisation dans postit-system.js
window.firebaseConfig = firebaseConfig;
window.initFirebase = initFirebase;
window.getDatabase = () => database;
