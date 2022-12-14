/************
 * layer.js *
 * **********/

import { createModal, removeModal } from '../modal/modal.js';


let layer;

// create layer as modal background
const createLayer = () => {
    layer = document.createElement('div');
    layer.classList.add('layer');
    document.body.append(layer);
    createModal(layer);
    
    // remove layer and modal while layer is clicked
    layer.addEventListener('click', () => {
        layer.remove();
        removeModal();
    });
};


// remove layer
const removeLayer = () => {
    layer.remove();
}

export { createLayer, removeLayer };