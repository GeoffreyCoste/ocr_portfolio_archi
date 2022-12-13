// Layer

import { createModal, removeModal } from './modal.js';

const header = document.querySelector('header');

let layer;

/* Modal creation for gallery edit feature */
const createLayer = () => {
    layer = document.createElement('div');
    layer.classList.add('layer');
    /* layer.style.height = document.body.getBoundingClientRect().height + "px"; */
    
    /* document.body.insertBefore(layer, header); */
    document.body.append(layer);
    createModal(layer);
    
    layer.addEventListener('click', () => {
        layer.remove();
        removeModal();
    });
};

const removeLayer = () => {
    layer.remove();
}

export { createLayer, removeLayer };