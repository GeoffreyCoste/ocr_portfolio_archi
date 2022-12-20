/************
 * works.js *
 * **********/

import { toggleModalContent, displayWorksEditGallery } from "../modal/modal.js";

// get works data
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
        error.style.gridColumn = '2/3';
        error.style.gridRow = '1/2';
        error.innerText = 'Un problème est survenu lors du chargement.';
        gallery.innerHTML = '';
        gallery.append(error);
    };
};

const mapWorks = (works) => {
    const worksNodes = works.map((work) => {
        return createWorkElement(work);
    });
    return worksNodes;
};

// create work figure element
const createWorkElement = (work) => {
    const figure = document.createElement('figure');
    figure.innerHTML = `
        <img src=${work.imageUrl} alt=${work.title}>
        <figcaption>${work.title}</figcaption>
    `;
    
    return figure;
};

// display works figure nodes inside main gallery
const displayWorksGallery = async (filteredWorks) => {
    const data = getWorks();
    const works = filteredWorks || await data;
    const worksNodes = mapWorks(works);

    const worksGallery = document.querySelector('#portfolio .gallery');

    worksGallery.innerHTML = '';
    worksGallery.append(...worksNodes);
};

// create new work through modal add img form
const addWork = async (formData, errorElement) => {
    try {
        const userToken = sessionStorage.getItem("user_token");
        const response = await fetch('http://localhost:5678/api/works', {
            method: 'POST',
            body: formData, // using formData and letting browser fixing request headers
            headers: {
                'Authorization': `Bearer ${userToken}`
            }
        });
        const status = response.status;
        switch(status) {
            case 201:
                toggleModalContent();
                displayWorksEditGallery();
                break;
            case 400:
                // creating Error Object (i.e. { name: 'Error', message: 'String passed in the constructor' }) 
                // to be captured by catch block below
                throw new Error("Echec de la connexion au serveur. Veuillez réessayer.");
                break;
            case 401:
                // creating Error Object (i.e. { name: 'Error', message: 'String passed in the constructor' }) 
                // to be captured by catch block below
                throw new Error("Echec de la connexion au serveur. Vous ne disposez pas des droits et autorisations requis.");
                break;
            case 500:
                // creating Error Object (i.e. { name: 'Error', message: 'String passed in the constructor' }) 
                // to be captured by catch block below
                throw new Error("Une erreur inattendue est survenue. Veuillez réessayer");
                break;
            default:
                // creating Error Object (i.e. { name: 'Error', message: 'String passed in the constructor' }) 
                // to be captured by catch block below
                throw new Error("Une erreur est survenue.");
        }
    } catch (e) {
        console.log(e);
        // display message property of captured Error Object captured
        errorElement.classList.add('show');
        errorElement.innerText = e.message;
    }
};

const deleteWork = async (btn, errorElement) => {
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
                break;
            case 401:
                // creating Error Object (i.e. { name: 'Error', message: 'String passed in the constructor' }) 
                // to be captured by catch block below
                throw new Error("Echec de la connexion au serveur. Vous ne disposez pas des droits et autorisations requis.");
                break;
            case 500:
                // creating Error Object (i.e. { name: 'Error', message: 'String passed in the constructor' }) 
                // to be captured by catch block below
                throw new Error("Une erreur inattendue est survenue. Veuillez réessayer");
                break;
            default:
                throw Error("Une erreur est survenue.");
        }
    } catch (e) {
        console.log(e);
        errorElement.classList.add('show');
        errorElement.innerText = e.message;
    };
};

export { displayWorksGallery, getWorks, addWork, deleteWork };