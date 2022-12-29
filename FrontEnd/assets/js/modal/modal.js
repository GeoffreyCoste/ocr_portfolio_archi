/***********
 * modal.js *
 * *********/

import { getWorks, deleteWork, addWork } from '../works/works.js';
import { getCategories } from '../categories/categories.js';
import { removeLayer } from "../layer/layer.js";
import { previewFile, removeChildren } from './fileInput.js';
import { displayError } from '../errors/errors.js';

let modal;
let file;

// 1. modal

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
                <div id="loading">
                    <div class="loader loader--bar"></div>
                    <div class="loader loader--bar"></div>
                    <div class="loader loader--bar"></div>
                    <span>Chargement ...</span>
                </div>
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
            <div class="modal__body add__work">
                <form action="#" method="post" class="form form--add-work">
                    <div class="form__group group__input__file">
                        <i class="fa-regular fa-image"></i>
                        <label 
                            class="btn btn--no-border btn--select-img" 
                            for="image"
                        >
                            + Ajouter photo
                        </label>
                        <input type="file" name="image" class="input__file" id="image" accept="image/png, image/jpeg" required>
                        <span>jpg, png : 4Mo max</span>
                    </div>
                    <div class="thumbnail"></div>
                    <div class="form__group">
                        <label for="title">Titre</label>
                        <input type="text" name="title" id="input__title" required>
                    </div>
                    <div class="form__group">
                        <label for="category">Catégorie</label>
                        <i class="fa-solid fa-chevron-down input__arrow__down"></i>
                        <select name="category" class="input__category" id="category" required>
                            <option value=""></option>
                        </select>
                    </div>
                    <input class="btn btn--submit btn--update-gallery" type="submit" value="Valider">
                </form>
            </div>
        </div>
    `

    // insert modal inside 'el' param
    el.append(modal);
    document.body.classList.add('no-scroll');
    displayWorksEditGallery();

    // prevent modal click to remove layer and itself
    modal.addEventListener('click', (e) => {
        e.stopPropagation();
    });

    // close modal
    const closeButtons = document.querySelectorAll('.btn--close');
    closeButtons.forEach((btnClose) => {
        btnClose.addEventListener('click', () => {
            initForm(addWorkForm);
            removeModal();
            removeLayer();
        });
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
    const inputFileParent = document.querySelector('.group__input__file');
    const container = document.querySelector('.modal__body.add__work');
    const form = document.querySelector('.form--add-work');
    const thumbnail = document.querySelector('.thumbnail');
    const btnSubmit = document.querySelector('.btn--submit.btn--update-gallery');
    // check input[type="file"] change in order to display initial input / img preview or error message
    inputFile.addEventListener("change", (e) => {
        e.preventDefault();
        if (inputFile.files.length > 0) {
            const fileSize = inputFile.files.item(0).size;
            const fileMb = fileSize / 1024 ** 2;
            // check selected file size
            // display error and prevent submit if size exceeds limit
            if (fileMb >= 4) {
                inputFileParent.classList.remove('invisible'); // switch opacity of input parent to 1 to show all childs and no img preview due to file size exceed
                removeChildren(thumbnail); // remove childs of thumbnail
                let error = new Error('Le fichier excède la limite autorisée.'); // create custom error
                displayError(error, container, form, false);
                // submit button not available if file size not ok
                btnSubmit.disabled = true;
            } else {
                let errorContainer = document.querySelector('.error__container');
                if (errorContainer) {
                    errorContainer.innerHTML = ''; // remove childs inside errorContainer
                }
                // submit button available if file size ok
                btnSubmit.disabled = false;
                inputFileParent.classList.add('invisible'); // switch opacity of input parent to 0 to hide all childs and only keep img preview visible, input label taking full preview size and available for click
                file = inputFile.files.item(0);
                const preview = previewFile(file); // generate img preview
                console.log(preview);
                removeChildren(thumbnail).append(preview); // remove childs of thumbnail
            }
        };
    });

    // map categories datas into HTML option tags inserted inside input category select tag
    const inputCategory = document.querySelector('.input__category');
    displayOptions(inputCategory);
    

    const addWorkForm = document.querySelector('.form--add-work');
    // init / reset add img form
    const initForm = (form) => {
        inputFile.value = '';
        form.reset();
    };
    // upon add img form submit realize the add work request with formData 
    // and pass errorElement to display hypothetic error
    addWorkForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        addWork(formData);
        inputFileParent.classList.remove('invisible');
        removeChildren(thumbnail);
        initForm(addWorkForm);
    });

    return modal;
};

// remove modal element
const removeModal = () => {
    modal.remove();
    document.body.classList.remove('no-scroll');
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
    const works = await data || [];

    if (works.length > 0) {
        const loading = document.querySelector('#loading');
        loading.style.display = 'none';
    };
    
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
    deleteButtons.forEach((btn) => {
        btn.addEventListener('click', async (e) => {
            e.preventDefault();
            deleteWork(btn);
        });
    });

    return editGallery;
}


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
    const categories = await data || []; // in case of no data receipt, empty array is sent and only empty default option displayed
    console.log(categories);
    let defaultOption = { id: "", name: "" };
    const options = [defaultOption, ...categories];
    const optionsNodes = mapOptions(options);
    
    el.innerHTML = '';
    el.append(...optionsNodes);
}

export { createModal, removeModal, toggleModalContent, displayWorksEditGallery };