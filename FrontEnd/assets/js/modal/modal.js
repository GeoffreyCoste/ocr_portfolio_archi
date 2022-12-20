/***********
 * modal.js *
 * *********/

import { getWorks, deleteWork, addWork } from '../works/works.js';
import { getCategories } from '../categories/categories.js';
import { removeLayer } from "../layer/layer.js";
import { uploadFile, removeFile } from './fileInput.js';


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
                <p class="error-message"></p>
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
                <p class="error-message"></p>
                <form action="#" method="post" class="form form--add-work">
                    <div class="form__group group__input__file">
                        <i class="fa-regular fa-image"></i>
                        <label 
                            class="btn btn--no-border btn--select-img" 
                            for="image"
                        >
                            + Ajouter photo
                        </label>
                        <input type="file" name="image" class="input__file" id="image" accept="image/png, image/jpg" required>
                        <span>jpg, png : 4Mo max</span>
                        <div class="thumbnail"></div>
                    </div>
                    <div class="form__group">
                        <label for="title">Titre</label>
                        <input type="text" name="title" id="input__title" required>
                    </div>
                    <div class="form__group">
                        <label for="category">Catégorie</label>
                        <i class="fa-solid fa-chevron-down input__arrow__down"></i>
                        <select name="category" class="input__category" id="category">
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
        /* initForm(); */ // no 'form' passed as parameter in order to keep eventual values inside input(s) (other than 'input[type="file"]') recorded
    });

    // manage preview of selected img to be added
    const inputFile = document.querySelector('.input__file');
    inputFile.addEventListener('change', (e) => {
        e.preventDefault();
        uploadFile(e.target);
        /* document.querySelector('.btn--select-img').classList.add('invisible'); */
    });

    // map categories datas into HTML option tags inserted inside input category select tag
    const inputCategory = document.querySelector('.input__category');
    displayOptions(inputCategory);
    

    const addWorkForm = document.querySelector('.form--add-work');
    // init / reset add img form
    const initForm = (form) => {
        const error = document.querySelector('.modal__body.add__work .error-message');
        error.classList.remove('show');
        error.innerText = '';
        inputFile.value = '';
        form.reset();
    };
    // upon add img form submit realize the add work request with formData 
    // and pass errorElement to display hypothetic error
    addWorkForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const errorElement = document.querySelector('.modal__body.add__work .error-message');
        const formData = new FormData(e.target);
        addWork(formData, errorElement);
        removeFile();
        initForm(addWorkForm);
        document.querySelector('.btn--select-img').classList.remove('invisible');
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
    deleteButtons.forEach((btn) => {
        const errorElement = document.querySelector('.modal__body .error-message');
        btn.addEventListener('click', async (e) => {
            e.preventDefault();
            deleteWork(btn, errorElement);
        });
    });

    return editGallery;
}

// generate preview for file selected through input[type="file"]
/* const filePreview = (e) => {
    const label = document.querySelector('.btn--select-img');
    const input = e.target;
    const file = input.files;
    console.log(file);

    if (file) {
        // check file size does not exceed limit
        checkFile(file);
        const fileReader = new FileReader();
        const preview = document.querySelector('.file__preview');

        fileReader.addEventListener('load', (e) => {
            preview.setAttribute('src', e.target.result);
            preview.classList.remove('hidden');
            label.classList.add('hidden');
        });

        fileReader.readAsDataURL(file[0]);
    } else {
        preview.setAttribute('src', '#');
        preview.classList.add('hidden');
        label.classList.remove('hidden');
    };
}; */

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
    console.log(categories);
    let defaultOption = { id: "", name: "" };
    const options = [defaultOption, ...categories];
    const optionsNodes = mapOptions(options);
    
    /* const optionsNodes = mapOptions(categories); */
    el.innerHTML = '';
    el.append(...optionsNodes);
}

export { createModal, removeModal, toggleModalContent, displayWorksEditGallery };