import { createModalContent } from "./content.js";
import { removeLayer } from "../layer.js";
import { filePreview } from "./addImgForm/filePreview.js";

let isAddImgFormDisplayed = false;

const createAddImgForm = (el) => {
    const modalContent = document.querySelector('.modal__content');
    modalContent.innerHTML = '';
    modalContent.innerHTML = `
        <div class="modal__content">
            <div class="modal__header">
                <div class="header__buttons">
                    <button class="btn btn--no-border btn--back">
                        <i class="fa-solid fa-arrow-left-long"></i>
                    </button>
                    <button class="btn btn--no-border btn--close">
                        <i class="fa-solid fa-xmark"></i>
                    </button>
                </div>
                <h3 class="header__title">Ajout photo</h3>
            </div>
            <div class="modal__body">
                <p class="error-message"></p>
                <div class="form form--add-img">
                    <div class="form__input">
                        <i class="fa-regular fa-image"></i>
                        <label 
                            class="btn btn--no-border btn--select-img" 
                            for="input__file"
                        >
                            + Ajouter photo
                        </label>
                        <input type="file" name="input__file" id="input__file" accept="image/png, image/jpg" required>
                        <span>jpg, png : 4Mo max</span>
                        <img src="#" class="file__preview" alt="Upload selected file preview">
                    </div>
                    <label for="input__title">Titre</label>
                    <input type="text" name="input__title" id="input__title" required>
                    <label for="category">Catégorie</label>
                    <select name="input__category" id="input__category">
                        <option value=""></option>
                    </select>
                    <input class="btn btn--submit btn--update-gallery" type="submit" value="Valider">
                </div>
            </div>
        </div>
    `;

    let btnBack = el.querySelector('.btn--back');
    btnBack.classList.add('show');

    btnBack.addEventListener('click', () => {
        el.innerHTML = '';
        createModalContent(el, 'edit-gallery');
    });

    let btnClose = modalContent.querySelector('.btn--close');
    btnClose.addEventListener('click', () => {
        el.remove();
        removeLayer();
    });

    let inputFile = document.querySelector('#input__file');
    inputFile.addEventListener('change', (e) => {
        e.preventDefault();
        filePreview(e);
    });

    let form = document.querySelector('.form--add-img');
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        submitAddImgForm(e);
    });
};

export { isAddImgFormDisplayed, createAddImgForm };