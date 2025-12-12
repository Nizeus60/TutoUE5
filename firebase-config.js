// ============================================
// NIZOZ STUDIO - CONFIGURATION FIREBASE
// ============================================

// ⚠️ IMPORTANT : Remplace ces valeurs par tes propres clés Firebase
// Tu les obtiendras en suivant le guide dans firebase-setup.md

const firebaseConfig = {
  apiKey: "TON_API_KEY_ICI",
  authDomain: "TON_PROJECT_ID.firebaseapp.com",
  databaseURL: "https://TON_PROJECT_ID-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "TON_PROJECT_ID",
  storageBucket: "TON_PROJECT_ID.appspot.com",
  messagingSenderId: "TON_MESSAGING_SENDER_ID",
  appId: "TON_APP_ID"
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
