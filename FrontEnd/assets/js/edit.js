// Edit.js

import { createLayer } from './layer.js';
import { makeElementTakeFullViewportWidth } from '../utils/makeElementTakeFullViewportWidth.js'


// Top bar
const createEditTopBarElement = () => {
    const editTopBar = document.createElement("div");
    
    editTopBar.classList.add("edit-top-bar");
    
    editTopBar.innerHTML = `
        <i class="fa-regular fa-pen-to-square"></i>
        <p>Mode édition</p>
        <button class="btn btn--edit-validate btn--logout">publier les changements</button>
    `;

    return editTopBar;
};

const displayEditTopBar = () => {
    const body = document.querySelector("body");
    const header = document.querySelector("header");
    const topbar = createEditTopBarElement();

    body.insertBefore(topbar, header);
}

// Buttons
const createEditButtonElement = () => {
    const button = document.createElement("button");
    button.classList.add("btn", "btn--no-border", "btn--edit-field");
    button.innerHTML = `
        <i class="fa-regular fa-pen-to-square"></i>
        <span>modifier</span>
    `;
    return button;
}

const displayEditButtons = (field, position) => {
    const editButton = createEditButtonElement();
    field.insertAdjacentElement(position, editButton);

    editButton.addEventListener('click', () => {
        createLayer();
    });
}

const handleEditElements = () => {
    const introSection = document.querySelector('#introduction');
    const introImg = introSection.firstElementChild;
    const introText = introSection.lastElementChild;
    const gallery = document.querySelector('#portfolio > .gallery');

    displayEditTopBar();
    displayEditButtons(introImg, 'beforeend');
    displayEditButtons(introText, 'afterbegin');
    displayEditButtons(gallery, 'beforebegin');
};

export { handleEditElements };