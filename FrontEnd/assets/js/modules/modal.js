import { fetchWorksData } from './works.js';
import { makeElementTakeFullViewportWidth } from '../utils/makeElementTakeFullViewportWidth.js';

const body = document.querySelector("body");
const header = document.querySelector("header");

let layer;
let modal;
/* let works = fetchWorksData(); */

/* Modal creation for gallery edit feature */
const createLayer = () => {
    layer = document.createElement('div');
    layer.classList.add('layer');
    layer.style.height = document.body.getBoundingClientRect().height + "px";

    layer.addEventListener('click', () => {
        closeModal();
    });
}

const createModal = (type) => {
    let btnAddImage;
    switch(type) {
        case 'edit':
            modal = document.createElement('div');
            modal.classList.add('modal');
            modal.innerHTML = `
                <div class="modal__container">
                    <div class="modal__header">
                        <div class="header__buttons">
                            <button class="btn btn--no-border btn--back">
                                <i class="fa-solid fa-arrow-left-long"></i>
                            </button>
                            <button class="btn btn--no-border btn--close">
                                <i class="fa-solid fa-xmark"></i>
                            </button>
                        </div>
                        <h3 class="header__title">Galerie photo</h3>
                    </div>
                    <div class="modal__content"></div>
                </div>
            `;

            let galleryEdit = document.createElement('div');
            galleryEdit.classList.add('gallery', 'gallery--edit');

            const displayFigureNodes = async () => {
                const data = fetchWorksData();
                const works = await data;
                console.log(works);
                
                const figureNodes = works.map((work) => {
                    const editableFigure = document.createElement('figure');
                    editableFigure.innerHTML = `
                        <img src=${work.imageUrl} alt=${work.title}>
                        <div class="buttons-above">
                            <button class="btn btn--square btn--drag">
                                <i class="fa-solid fa-up-down-left-right"></i>
                            </button>
                            <button class="btn btn--square btn--delete">
                                <i class="fa-regular fa-trash-can"></i>
                            </button>
                        </div>
                        <button class="btn btn--no-border btn--edit">éditer</button>
                    `
                    return editableFigure;
                });
    
                galleryEdit.innerHTML = '';
                galleryEdit.append(...figureNodes);
    
    
                btnAddImage = document.createElement('button');
                btnAddImage.classList.add('btn', 'btn--add-image');
                btnAddImage.innerText = "Ajouter une photo";
    
                let btnDeleteAll = document.createElement('button');
                btnDeleteAll.classList.add('btn', 'btn--no-border', 'btn--delete-all');
                btnDeleteAll.innerText = "Supprimer la galerie";
    
                let modalContent = modal.querySelector('.modal__content');
                modalContent.append(galleryEdit, btnAddImage, btnDeleteAll); 

                btnAddImage.addEventListener('click', (e) => {
                    e.preventDefault();
                    createModal('add');
                });
            }
            displayFigureNodes();
            break;

        case 'add':
            const btnBack = modal.querySelector('.btn--back');
            btnBack.classList.add('show');
            
            modal.querySelector('.header__title').innerText = "Ajout photo";
            modal.querySelector('.gallery--edit').classList.add('hidden');
            /* modalContent.querySelector('.modal__content').innerHTML = ''; */
            modal.querySelector('.modal__content').innerHTML = '';
            
            const formAddImage = document.createElement('form');
            formAddImage.classList.add('form', 'form--add-img');

            formAddImage.innerHTML = `
                <div class="form__input">
                    <i class="fa-regular fa-image"></i>
                    <label 
                        class="btn btn--no-border btn--select-img" 
                        for="file"
                    >
                        + Ajouter photo
                    </label>
                    <input type="file" name="file" id="file" accept="image/png, image/jpg" required>
                    <span>jpg, png : 4Mo max</span>
                </div>
			    <label for="title">Titre</label>
			    <input type="text" name="title" id="title" required>
			    <label for="category">Catégorie</label>
			    <select name="category" id="category">
                    <option value=""></option>
                </select>
			    <input class="btn btn--submit btn--update-gallery" type="submit" value="Valider">
            `;

            /* if (formAddImage) {
                const fileUploadButton = formAddImage.querySelector('#file-upload-button');
                console.log(fileUploadButton);
            } */
            
            modal.querySelector('.modal__content').append(formAddImage);

            btnBack.addEventListener('click', () => {
                modal.innerHTML = '';
                createModal('edit');
            });

            break;

        default:
            modal = document.createElement('div');
            modal.classList.add('modal');
            modal.innerHTML = `
                <div class="modal__container">
                    <div class="modal__header">
                        <div class="header__buttons">
                            <i class="fa-solid fa-arrow-left-long btn btn--no-border btn--back"></i>
                            <i class="fa-solid fa-xmark btn btn--no-border btn--close"></i>
                        </div>
                        <h3 class="header__title">Modal default title</h3>
                    </div>
                    <div class="modal__content">Modal default content</div>
                </div>
            `;
    }

    modal.addEventListener('click', (e) => {
        e.stopPropagation();
    });

    const btnClose = modal.querySelector('.btn--close');
    btnClose.addEventListener('click', () => {
        layer.remove();
    });

    const btnDeleteNodes = document.querySelectorAll('.btn--delete');
    btnDeleteNodes.forEach((btn, index) => {
        btn.addEventListener('click', async (e) => {
            e.preventDefault();
            try {
                const id = index + 1;
                const response = await fetch(
                    `http://localhost:5678/api/works/${id}`, 
                    {
                        method: 'DELETE'
                    }
                );
                if (response.status === 204) {
                    layer.remove();
                    fetchWorksData();
                }
            } catch (err) {
                console.log(err);
            }
        });
    });

    /* btnAddImage.addEventListener('click', (e) => {
        e.preventDefault();
        createModal('add');
    }); */
};

const openModal = () => {
    window.scrollTo({
        /* top: ((Math.max(bodyOffsetHeight, bodyScrollHeight) / 2) - (((Math.max(bodyOffsetHeight, bodyScrollHeight) / 2) * 50)) / 100), */
        top: ((body.getBoundingClientRect().height / 2) - (((body.getBoundingClientRect().height / 2) * 19) / 100)),
        /* left: 0, */
        behavior: 'smooth'
    });
    /* body.classList.add('no-scroll'); */
    createLayer();
    createModal('edit');
    console.log(layer);
    /* console.log(modal); */
    /* body.prepend(layer); */
    body.insertBefore(layer, header);
    layer.append(modal);
    makeElementTakeFullViewportWidth(layer);
};

const closeModal = () => {
    layer.remove();
};

/* export { openModal, closeModal }; */