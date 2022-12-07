import { makeElementTakeFullViewportWidth } from '../utils/makeElementTakeFullViewportWidth.js'
import { createLayer } from './modal/layer.js';

const createEditDOMElements = () => {
    const body = document.querySelector("body");
    const header = document.querySelector("header");
    const editTopBar = document.createElement("div");
    
    editTopBar.classList.add("edit-top-bar");
    
    editTopBar.innerHTML = `
        <i class="fa-regular fa-pen-to-square"></i>
        <p>Mode édition</p>
        <button class="btn btn--edit-validate btn--logout">publier les changements</button>
    `;

    makeElementTakeFullViewportWidth(editTopBar);

    const targets = document.querySelectorAll('.target');
    
    targets.forEach(target => {
        const fieldEditBtn = document.createElement("button");
        fieldEditBtn.classList.add("btn", "btn--no-border", "btn--edit-field");
        fieldEditBtn.innerHTML = `
            <i class="fa-regular fa-pen-to-square"></i>
            <span>modifier</span>
        `;

        insertDOMElement(target, fieldEditBtn, target.getAttribute('data-insert-position'));
        fieldEditBtn.addEventListener('click', () => {
            /* openModal(); */
            createLayer();
        });
    });

    body.insertBefore(editTopBar, header);
};

const insertDOMElement = (target, element, position) => {
    target.insertAdjacentElement(position, element);
};

export { createEditDOMElements };