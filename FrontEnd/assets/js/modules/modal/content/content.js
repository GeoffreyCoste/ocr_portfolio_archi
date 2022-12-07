import { createEditGallery } from "./editGallery.js";
import { createAddImgForm } from "./addImgForm.js";


const createModalContent = (el, type) => {
    switch(type) {
        case 'edit-gallery':
            createEditGallery(el);
            break;
        case 'add-img':
            createAddImgForm(el);
            break;
        default:
            el.innerHTML = '';
    }
};

export { createModalContent }