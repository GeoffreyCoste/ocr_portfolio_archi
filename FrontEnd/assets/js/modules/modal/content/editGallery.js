import { fetchWorksData } from "../../works.js";
import { removeLayer } from "../layer.js";
import { createModalContent } from "./content.js";

const createEditGallery = (el) => {
    const modalContent = document.createElement('div');
    modalContent.classList.add('modal__content');
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
                <h3 class="header__title">Galerie photo</h3>
            </div>
            <div class="modal__body"></div>
        </div>
    `;

    let btnClose = modalContent.querySelector('.btn--close');
    btnClose.addEventListener('click', () => {
        el.remove();
        removeLayer();
    });

    let btnDeleteNodes = document.querySelectorAll('.btn--delete');
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

    /* let btnAddImage; */
    let galleryEdit = document.createElement('div');
    galleryEdit.classList.add('gallery', 'gallery--edit')
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
            `;
            return editableFigure;
        });
        galleryEdit.innerHTML = '';
        galleryEdit.append(...figureNodes);
        let btnAddImage = document.createElement('button');
        btnAddImage.classList.add('btn', 'btn--add-image');
        btnAddImage.innerText = "Ajouter une photo";
        let btnDeleteAll = document.createElement('button');
        btnDeleteAll.classList.add('btn', 'btn--no-border', 'btn--delete-all');
        btnDeleteAll.innerText = "Supprimer la galerie";
        let modalBody = modalContent.querySelector('.modal__body');
        modalBody.append(galleryEdit, btnAddImage, btnDeleteAll);
        btnAddImage.addEventListener('click', (e) => {
            e.preventDefault();
            createModalContent(el, 'add-img');
        });
    }
    displayFigureNodes();
    el.append(modalContent);
}

export { createEditGallery };