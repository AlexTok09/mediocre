// Configuration Firebase (remplace les valeurs par celles de ton projet Firebase)
const firebaseConfig = {
  apiKey: "AIzaSyDGEmhoWkXh6hawMlCm3MdfrHjkDr7Gn1Q",
  authDomain: "mediocregit.firebaseapp.com",
  databaseURL: "https://mediocregit-default-rtdb.firebaseio.com",
  projectId: "mediocregit",
  storageBucket: "mediocregit.firebasestorage.app",
  messagingSenderId: "530828482083",
  appId: "1:530828482083:web:d02f170dd53878b02bc396",
  measurementId: "G-ERJN27LSXM"
};
// Initialiser Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-app.js";
import { getFirestore, collection, addDoc, onSnapshot, query, where } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-firestore.js";

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Récupérer les éléments du DOM
const aphorismsList = document.getElementById('aphorisms-list');
const newAphorismInput = document.getElementById('new-aphorism');
const submitButton = document.getElementById('submit-aphorism');

// Charger les aphorismes approuvés en temps réel
function loadApprovedAphorisms() {
    const q = query(collection(db, "aphorisms"), where("approved", "==", true));
    onSnapshot(q, (querySnapshot) => {
        aphorismsList.innerHTML = ''; // Effacer la liste actuelle
        querySnapshot.forEach(doc => {
            const aphorism = doc.data().text;
            const li = document.createElement('li');
            li.textContent = aphorism;
            aphorismsList.appendChild(li);
        });
    });
}

// Soumettre un nouvel aphorisme
submitButton.addEventListener('click', async () => {
    const text = newAphorismInput.value.trim();
    if (text) {
        await addDoc(collection(db, "aphorisms"), { text, approved: false });
        alert('Merci ! Votre aphorisme a été soumis pour validation.');
        newAphorismInput.value = ''; // Réinitialiser le champ
    } else {
        alert('Veuillez entrer un aphorisme.');
    }
});

// Charger les aphorismes au démarrage
loadApprovedAphorisms();
