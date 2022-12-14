/***********
 * modal.js *
 * *********/

import { getWorks, deleteWork, addWork } from '../works/works.js';
import { getCategories } from '../categories/categories.js';
import { removeLayer } from "../layer/layer.js";


// 1. modal

let modal;

// create modal element with toggling content blocks
const createModal = (el) => {
    modal = document.createElement('div');
    modal.classList.add('modal');
    modal.innerHTML = `
        <div class="modal__content">
            <div class="modal__header">
                <button class="btn btn--no-border btn--close">
                    <i class="fa-solid fa-xmark"></i>
                </button>
                <h3 class="header__title">Galerie photo</h3>
            </div>
            <div class="modal__body">
                <div class="gallery gallery--edit"></div>
                <div class="buttons__container">
                    <button class="btn btn--add-image">Ajouter une photo</button>
                    <button class="btn btn--no-border btn--delete-all">Supprimer la galerie</button>
                </div>
            </div>
        </div>
        <div class="modal__content hidden">
            <div class="modal__header">
                <button class="btn btn--no-border btn--back">
                    <i class="fa-solid fa-arrow-left-long"></i>
                </button>
                <button class="btn btn--no-border btn--close">
                    <i class="fa-solid fa-xmark"></i>
                </button>
                <h3 class="header__title">Ajout photo</h3>
            </div>
            <div class="modal__body">
                <p class="error-message"></p>
                <form action="#" method="post" class="form form--add-work">
                    <div class="form__input">
                        <i class="fa-regular fa-image"></i>
                        <label 
                            class="btn btn--no-border btn--select-img" 
                            for="image"
                        >
                            + Ajouter photo
                        </label>
                        <input type="file" name="image" class="input__file" id="image" accept="image/png, image/jpg" required>
                        <span>jpg, png : 4Mo max</span>
                        <img src="#" class="file__preview hidden" alt="Upload selected file preview">
                    </div>
                    <label for="title">Titre</label>
                    <input type="text" name="title" id="input__title" required>
                    <label for="category">Catégorie</label>
                    <select name="category" class="input__category" id="category">
                        <option value=""></option>
                    </select>
                    <input class="btn btn--submit btn--update-gallery" type="submit" value="Valider">
                </form>
            </div>
        </div>
    `

    // insert modal inside 'el' param
    el.append(modal);
    displayWorksEditGallery();

    // prevent modal click to remove layer and itself
    modal.addEventListener('click', (e) => {
        e.stopPropagation();
    });

    // close modal
    const btnClose = document.querySelector('.btn--close');
    btnClose.addEventListener('click', () => {
        removeModal();
        removeLayer();
    });

    // switch modal content from edit gallery to add img form
    const btnAddImage = document.querySelector('.btn--add-image');
    btnAddImage.addEventListener('click', (e) => {
        e.preventDefault();
        toggleModalContent();
    });

    // switch back modal content from add img form to edit gallery
    const btnBack = document.querySelector('.btn--back');
    btnBack.addEventListener('click', (e) => {
        e.preventDefault();
        toggleModalContent();
    });

    // manage preview of selected img to be added
    const inputFile = document.querySelector('.input__file');
    inputFile.addEventListener('change', (e) => {
        e.preventDefault();
        filePreview(e);
    });

    // map categories datas into HTML option tags inserted inside input category select tag
    const inputCategory = document.querySelector('.input__category');
    displayOptions(inputCategory);

    // upon add img form submit realize the add work request with formData 
    // and pass errorElement to display hypothetic error
    const addWorkForm = document.querySelector('.form--add-work');
    addWorkForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const errorElement = document.querySelector('.modal__body .error-message');
        const formData = new FormData(e.target);
        addWork(formData, errorElement);
    });

    return modal;
};

// remove modal element
const removeModal = () => {
    modal.remove();
}

// switch modal content between edit gallery and add img form
const toggleModalContent = () => {
    const contents = Array.from(document.querySelectorAll('.modal__content'));
    contents.forEach((content) => {
        if (content.classList.contains('hidden')) {
            content.classList.remove('hidden');
        } else {
            content.classList.add('hidden');
        };
    });
};


// 2. edit gallery

// create edit gallery with works datas and display
const displayWorksEditGallery = async () => {
    const editGallery = document.querySelector('.gallery--edit');
    const data = getWorks();
    const works = await data;

    const worksNodes = works.map((work) => {
        const figure = document.createElement('figure');
        figure.innerHTML = `
            <img src=${work.imageUrl} alt=${work.title}>
            <div class="buttons-above">
                <button type="button" class="btn btn--square btn--drag">
                    <i class="fa-solid fa-up-down-left-right"></i>
                </button>
                <button type="button" class="btn btn--square btn--delete" data-id=${work.id}>
                    <i class="fa-regular fa-trash-can" data-id=${work.id}></i>
                </button>
            </div>
            <button type="button" class="btn btn--no-border btn--edit">éditer</button>
        `;

        return figure;
    });

    editGallery.innerHTML = '';
    editGallery.append(...worksNodes);

    const deleteButtons = Array.from(document.querySelectorAll('.btn--delete'));
    console.log(deleteButtons);
    deleteButtons.forEach((btn) => {
        btn.addEventListener('click', async (e) => {
            e.preventDefault();
            deleteWork(btn);
        });
    });

    return editGallery;
}

// generate preview for file selected through input[type="file"]
const filePreview = (e) => {
    const input = e.target;
    const file = input.files;

    if (file) {
        // check file size does not exceed limit
        checkFile(file);
        const fileReader = new FileReader();
        const preview = document.querySelector('.file__preview');

        fileReader.addEventListener('load', (e) => {
            preview.setAttribute('src', e.target.result);
            preview.classList.remove('hidden');
        });

        fileReader.readAsDataURL(file[0]);
    };
};

// prevent file size to exceed limit
const checkFile = (file) => {
    const error = document.querySelector('.error-message');
    if (file.size > 4194304) {
        error.innerText = `Veuillez sélectionner un fichier dont la taille n'excède pas 4Mo.`
    }
};


// 3. option tags

// create HTML option tag element
const createOptionElement = (category) => {
    const option = document.createElement('option');
    option.setAttribute('value', `${category.id}`);
    option.innerText = `${category.name}`;
    return option;
};

// map categories datas into HTML option tags
const mapOptions = (categories) => {
    const optionsNodes = categories.map((category) => {
        return createOptionElement(category);
    });
    return optionsNodes;
};

// display option tag nodes inside 'el' param
const displayOptions = async (el) => {
    const data = getCategories();
    const categories = await data;
    const optionsNodes = mapOptions(categories);
    el.innerHTML = '';
    el.append(...optionsNodes);
}

export { createModal, removeModal, toggleModalContent, displayWorksEditGallery };