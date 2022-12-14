/***********
 * edit.js *
 * *********/

import { createLayer } from '../layer/layer.js';

// 1. Edit top bar

// create edit top bar element
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

// display edit top bar element before header
const displayEditTopBar = () => {
    const body = document.querySelector("body");
    const header = document.querySelector("header");
    const topbar = createEditTopBarElement();

    body.insertBefore(topbar, header);
}


// 2. Buttons

// create button element
const createEditButtonElement = () => {
    const button = document.createElement("button");
    button.classList.add("btn", "btn--no-border", "btn--edit-field");
    button.innerHTML = `
        <i class="fa-regular fa-pen-to-square"></i>
        <span>modifier</span>
    `;
    return button;
}

// insert button element at a specified position and display modal on click
const insertEditButtons = (field, position) => {
    const editButton = createEditButtonElement();
    field.insertAdjacentElement(position, editButton);

    editButton.addEventListener('click', () => {
        createLayer();
    });
}

// display all edit elements (i.e. edit top bar + field edit buttons)
const displayEditElements = () => {
    const introSection = document.querySelector('#introduction');
    const introImg = introSection.firstElementChild;
    const introText = introSection.lastElementChild;
    const gallery = document.querySelector('#portfolio > .gallery');

    displayEditTopBar();
    insertEditButtons(introImg, 'beforeend');
    insertEditButtons(introText, 'afterbegin');
    insertEditButtons(gallery, 'beforebegin');
};

export { displayEditElements };