/************
 * works.js *
 * **********/

import { toggleModalContent, displayWorksEditGallery } from "../modal/modal.js";
import { displayError } from "../errors/errors.js";

// get works data
const getWorks = async () => {
    try {
        const response = await fetch('http://localhost:5678/api/works');
        const works = await response.json();
        return works;
    } catch (e) {
        console.error(e);
        const error = {
            message: 'Un problème est survenu lors du chargement.'
        };
        const portfolio = document.querySelector('#portfolio');
        const gallery = document.querySelector('.gallery');
        displayError(error, portfolio, gallery, true);
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
const addWork = async (formData) => {
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
                displayWorksGallery();
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
        console.error(e);
        const modalBody = document.querySelector('.modal__body.add__work');
        const addWorkForm = document.querySelector('.form--add-work');
        displayError(e, modalBody, addWorkForm, false);
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
                displayWorksGallery();
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
                throw new Error("Une erreur est survenue.");
        }
    } catch (e) {
        console.log(e);
        console.error(e);
        const modalBody = document.querySelector('.modal__body');
        const editGallery = document.querySelector('.gallery--edit');
        displayError(e, modalBody, editGallery, false);
    };
};

export { displayWorksGallery, getWorks, addWork, deleteWork };