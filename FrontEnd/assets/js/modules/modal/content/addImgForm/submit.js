import { fetchWorksData } from "../../../works.js";
import { removeLayer } from "../../layer.js";
import { removeModal } from "../../modal";

const error = document.querySelector('.error-message');

const submitAddImgForm = async (e) => {
    const formData = new FormData(e.target);
    const values = Object.fromEntries(formData.entries());
    try {
        const json = JSON.stringify(values);
        const response = await fetch('http://localhost:5678/api/works', {
            method: 'POST',
            body: json,
            headers: {
                'Content-Type': 'application/json',
                /* 'Authorization': `Bearer ${token}` */
            }
        });
        switch(response.status) {
            case 200:
                /* const user = await response.json();
                const userId = user.userId;
                const userLoggedIn = JSON.stringify({id: userId, isEditModeDisplayed: true})
                sessionStorage.setItem('user_data', userLoggedIn);
                window.location.replace('index.html'); */
                removeModal();
                removeLayer();
                fetchWorksData();
                break;
            case 400:
                error.innerText = "Echec de la connexion au serveur. Veuillez réessayer.";
                break;
            case 401:
                error.innerText = "Echec de la connexion au serveur. Vous ne disposez pas des droits et autorisations requis.";
                break;
            case 500:
                error.innerText = "Une erreur inattendue est survenue. Veuillez réessayer";
                break;
            default:
                error.innerText = "Une erreur est survenue.";
        }
    } catch (e) {
        console.log(e);
    }
}

export { submitAddImgForm };