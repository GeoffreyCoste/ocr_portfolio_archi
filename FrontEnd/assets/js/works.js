// Works.js

import { toggleModalContent, displayWorksEditGallery } from "./modal.js";

// Get works data
const getWorks = async () => {
    try {
        const response = await fetch('http://localhost:5678/api/works');
        const works = await response.json();
        return works;
    } catch (err) {
        console.log(err);
        const error = document.createElement('p');
        error.classList.add('error-message');
        error.innerText = 'Un problème est survenu lors du chargement.';
        /* error.style.gridColumn = '2/3';
        error.style.gridRow = '1/2';
        error.innerText = 'Un problème est survenu lors du chargement.';
        gallery.innerHTML = '';
        gallery.append(error); */
    };
};

const mapWorks = (works) => {
    const worksNodes = works.map((work) => {
        return createWorkElement(work);
    });
    return worksNodes;
};

const createWorkElement = (work) => {
    const figure = document.createElement('figure');
    figure.innerHTML = `
        <img src=${work.imageUrl} alt=${work.title}>
        <figcaption>${work.title}</figcaption>
    `;
    
    return figure;
};

const displayWorksGallery = async (filteredWorks) => {
    const data = getWorks();
    const works = filteredWorks || await data;
    const worksNodes = mapWorks(works);

    const worksGallery = document.querySelector('#portfolio .gallery');

    worksGallery.innerHTML = '';
    worksGallery.append(...worksNodes);
};

const addWork = async (formData, errorEl) => {
    try {
        const userToken = sessionStorage.getItem("user_token");
        const response = await fetch('http://localhost:5678/api/works', {
            method: 'POST',
            body: formData, // using formData and letting browser fixing request headers
            headers: {
                'Authorization': `Bearer ${userToken}`
            }
        });
        switch(response.status) {
            case 200:
                toggleModalContent();
                break;
            case 400:
                errorEl.innerText = "Echec de la connexion au serveur. Veuillez réessayer.";
                break;
            case 401:
                errorEl.innerText = "Echec de la connexion au serveur. Vous ne disposez pas des droits et autorisations requis.";
                break;
            case 500:
                errorEl.innerText = "Une erreur inattendue est survenue. Veuillez réessayer";
                break;
            default:
                errorEl.innerText = "Une erreur est survenue.";
        }
    } catch (e) {
        console.log(e);
    }
};

const deleteWork = async (btn) => {
    try {
        const userToken = sessionStorage.getItem("user_token");
        // With SQLite database deleting item will not result in indexes update and in making deleted item index available
        const id = btn.dataset.id; // checking btn instead of e.target in order for click on <i> tag not to be dissociated
        const response = await fetch(
            `http://localhost:5678/api/works/${id}`, 
            {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${userToken}`
                }
            }
        );
        const status = response.status;
        switch(status) {
            case 204:
                displayWorksEditGallery();
            default:
                throw Error("Une erreur est survenue.");
        }
    } catch (e) {
        console.log(err);
    };
};

export { displayWorksGallery, getWorks, addWork, deleteWork };