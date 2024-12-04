// Configuration Firebase - Remplace les valeurs par celles de ton projet Firebase
const firebaseConfig = {
    apiKey: "AIzaSyDGEmhoWkXh6hawMlCm3MdfrHjkDr7Gn1Q",
    authDomain: "mediocregit.firebaseapp.com",
    databaseURL: "https://mediocregit-default-rtdb.firebaseio.com",
    projectId: "mediocregit",
    storageBucket: "mediocregit.appspot.com",
    messagingSenderId: "530828482083",
    appId: "1:530828482083:web:d02f170dd53878b02bc396",
    measurementId: "G-ERJN27LSXM"
};

// Import des modules Firebase nécessaires
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-app.js";
import {
    getFirestore,
    collection,
    addDoc,
    onSnapshot,
    query,
    where,
    orderBy,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/9.17.1/firebase-firestore.js";

// Initialisation Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Références DOM
const aphorismsList = document.getElementById('aphorisms-list');
const newAphorismInput = document.getElementById('new-aphorism');
const submitButton = document.getElementById('submit-aphorism');

// Fonction pour charger les aphorismes approuvés en temps réel, triés par le plus récent
function loadApprovedAphorisms() {
    console.log("Chargement des aphorismes approuvés...");
    const approvedQuery = query(
        collection(db, "aphorisms"),
        where("approved", "==", true),
        orderBy("timestamp", "desc") // Trie par date décroissante
    );

    onSnapshot(approvedQuery, (querySnapshot) => {
        aphorismsList.innerHTML = ''; // Efface la liste actuelle avant de la recharger

        if (querySnapshot.empty) {
            console.log("Aucun aphorisme approuvé trouvé.");
            aphorismsList.innerHTML = '<li>Aucun aphorisme approuvé pour le moment.</li>';
        } else {
            querySnapshot.forEach(doc => {
                const data = doc.data();
                const li = document.createElement('li');
                li.textContent = data.text; // Ajoute le texte de l'aphorisme à la liste
                aphorismsList.appendChild(li);
            });
            console.log("Aphorismes approuvés chargés avec succès.");
        }
    }, (error) => {
        console.error("Erreur lors du chargement des aphorismes :", error);
    });
}

// Fonction pour soumettre un nouvel aphorisme
submitButton.addEventListener('click', async () => {
    const text = newAphorismInput.value.trim(); // Récupère et nettoie l'entrée utilisateur

    if (text) {
        try {
            const docRef = await addDoc(collection(db, "aphorisms"), {
                text: text,
                approved: false, // Aphorisme non approuvé par défaut
                timestamp: serverTimestamp() // Ajout de la date/heure
            });
            console.log("Aphorisme soumis avec succès. Document ID :", docRef.id);
            alert("Merci ! Votre aphorisme a été soumis pour validation auprès de notre comité de la médiocrité.");
            newAphorismInput.value = ''; // Vide le champ d'entrée après soumission
        } catch (error) {
            console.error("Erreur lors de la soumission :", error);
            alert("Une erreur est survenue. Veuillez réessayer.");
        }
    } else {
        alert("Veuillez entrer un aphorisme avant de soumettre !");
    }
});

// Chargement initial des aphorismes approuvés
loadApprovedAphorisms();
