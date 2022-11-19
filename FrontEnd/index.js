let portfolio = document.querySelector('#portfolio');
let gallery = document.querySelector('.gallery');
let works;

/* Getting API works data and display */
const fetchWorksData = async () => {
    try {
        const response = await fetch('http://localhost:5678/api/works');
        works = await response.json();
        /* if(!Array.isArray(works)) {
            works = [works];
        } */
        displayWorks(works);
    } catch (e) {
        console.log(e); // Add error management: 'Un problème est survenu lors du chargement'
        const error = document.createElement('p');
        error.innerText = 'Un problème est survenu lors du chargement';
        gallery.append(error);
    }
}

/* Displaying image gallery as from API works data */
const displayWorks = (works) => {
    const worksNodes = works.map((work) => {
        return createWorkElement(work);
    });
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

fetchWorksData();
