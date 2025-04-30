// Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyDvfqAzM_2gUmTHGlsXMxbOOCEVjT4PaCM",
    authDomain: "fireexeportofolio.firebaseapp.com",
    projectId: "fireexeportofolio",
    storageBucket: "fireexeportofolio.firebasestorage.app",
    messagingSenderId: "1038276283243",
    appId: "1:1038276283243:web:5343ac41c307f617319a2e",
    measurementId: "G-20GKEYGZS2"
};

// Enable detailed Firebase error logging for debugging
console.log('Firebase config loaded');

// Check if running on localhost
if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    console.log('Running on localhost - make sure localhost is added to Firebase authorized domains');
}
