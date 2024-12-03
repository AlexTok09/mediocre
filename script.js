document.addEventListener('DOMContentLoaded', () => {
    const aphorismsList = document.getElementById('aphorisms-list');
    const newAphorismInput = document.getElementById('new-aphorism');
    const submitButton = document.getElementById('submit-aphorism');

    // Fake database
    const pendingAphorisms = [];

    // Add new aphorism to pending list
    submitButton.addEventListener('click', () => {
        const newAphorism = newAphorismInput.value.trim();
        if (newAphorism) {
            pendingAphorisms.push(newAphorism);
            alert("Merci ! Votre aphorisme a été soumis pour validation.");
            newAphorismInput.value = ''; // Clear input
            console.log('Aphorismes en attente:', pendingAphorisms); // Simuler le backend ici
        } else {
            alert("Veuillez entrer un aphorisme avant d'envoyer !");
        }
    });

    // Mock admin validation (to simulate your backend validation process)
    window.validateAphorism = (index) => {
        const approvedAphorism = pendingAphorisms.splice(index, 1)[0];
        if (approvedAphorism) {
            const li = document.createElement('li');
            li.textContent = approvedAphorism;
            aphorismsList.appendChild(li);
        }
    };

    // Simulate pending approval logging
    setInterval(() => {
        if (pendingAphorisms.length > 0) {
            console.log('Aphorismes en attente:', pendingAphorisms);
        }
    }, 5000); // Log every 5 seconds
});
