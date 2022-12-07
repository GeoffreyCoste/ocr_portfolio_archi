import { createFilterMenu, removeFilterMenu } from './filter.js';
import { isEditModeDisplayed } from './auth.js';

const gallery = document.querySelector('.gallery');

/* Getting API works data and display */
const fetchWorksData = async () => {
    try {
        const response = await fetch('http://localhost:5678/api/works');
        const works = await response.json();
        displayWorks(works);
        createFilterMenu(works);
        if (isEditModeDisplayed) {
            removeFilterMenu();
        };
        return works;
    } catch (err) {
        console.log(err);
        const error = document.createElement('p');
        error.classList.add('error-message');
        error.style.gridColumn = '2/3';
        error.style.gridRow = '1/2';
        error.innerText = 'Un problème est survenu lors du chargement.';
        gallery.innerHTML = '';
        gallery.append(error);
    }
}

/* Displaying image gallery as from API works data */
const displayWorks = (works) => {
    const worksNodes = works.map((work) => {
        return createWorkElement(work);
    });
    gallery.innerHTML = '';
    gallery.append(...worksNodes);
};

const createWorkElement = (work) => {
    const figure = document.createElement('figure');
    figure.innerHTML = `
        <img src=${work.imageUrl} alt=${work.title}>
        <figcaption>${work.title}</figcaption>
    `;
    return figure;
};

export { works, fetchWorksData, displayWorks };