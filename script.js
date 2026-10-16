// Les aphorismes approuvés sont dans aphorismes.json (le plus récent en premier).
// Les propositions sont envoyées par mail via FormSubmit, puis modérées à la main.
const FORM_ENDPOINT = "https://formsubmit.co/ajax/9bb8a299d5d83ccd35662cbac376dacc";

// Références DOM
const aphorismsList = document.getElementById('aphorisms-list');
const newAphorismInput = document.getElementById('new-aphorism');
const submitButton = document.getElementById('submit-aphorism');

// Charge les aphorismes approuvés avec une date discrète
async function loadApprovedAphorisms() {
    try {
        const response = await fetch('aphorismes.json', { cache: 'no-cache' });
        const aphorisms = await response.json();

        aphorismsList.innerHTML = '';
        if (aphorisms.length === 0) {
            aphorismsList.innerHTML = '<li>Aucun aphorisme approuvé pour le moment.</li>';
            return;
        }

        for (const { texte, date } of aphorisms) {
            const li = document.createElement('li');

            const span = document.createElement('span');
            span.textContent = texte;
            li.appendChild(span);

            if (date) {
                // Format court jour/mois/année, ex. "09/08/2024"
                const [y, m, d] = date.split('-');
                const small = document.createElement('small');
                small.style.cssText = 'color: #888; font-size: 0.8rem; margin-left: 10px;';
                small.textContent = `(${d}/${m}/${y})`;
                li.appendChild(small);
            }

            aphorismsList.appendChild(li);
        }
    } catch (error) {
        console.error("Erreur lors du chargement des aphorismes :", error);
    }
}

// Soumet un nouvel aphorisme
submitButton.addEventListener('click', async () => {
    const text = newAphorismInput.value.trim();

    if (!text) {
        alert("Veuillez entrer un aphorisme avant de soumettre !");
        return;
    }

    submitButton.disabled = true;
    try {
        const response = await fetch(FORM_ENDPOINT, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
            body: JSON.stringify({
                aphorisme: text,
                _subject: "[classemediocre] Nouvelle proposition",
                _template: "box",
                _captcha: "false",
                _honey: document.getElementById('honey').value
            })
        });
        if (!response.ok) throw new Error(`HTTP ${response.status}`);

        alert("Merci ! Votre aphorisme a été soumis pour validation auprès de notre comité de la médiocrité.");
        newAphorismInput.value = '';
    } catch (error) {
        console.error("Erreur lors de la soumission :", error);
        alert("Une erreur est survenue. Veuillez réessayer.");
    } finally {
        submitButton.disabled = false;
    }
});

loadApprovedAphorisms();
