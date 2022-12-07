import { createModalContent } from "./content/content.js";

const createModal = (el) => {
    const modal = document.createElement('div');
    modal.classList.add('modal');

    el.append(modal);
    createModalContent(modal, 'edit-gallery');

    modal.addEventListener('click', (e) => {
        e.stopPropagation();
    });
};

const removeModal = () => {
    modal.remove();
}

export { createModal, removeModal };