let portfolio = document.querySelector('#portfolio');
let gallery = document.querySelector('.gallery');
let works;

/* Getting API works data and display */
const fetchWorksData = async () => {
    try {
        const response = await fetch('http://localhost:5678/api/works');
        works = await response.json();
        if(!Array.isArray(works)) {
            works = [works];
        }
        displayWorks(works);
        createFilterMenu(works);
    } catch (e) {
        console.log(e);
    }
}

/* Displaying image gallery as from API works data */
const displayWorks = (works) => {
    const worksNodes = works.map((work) => {
        return createWorkElement(work);
    });
    gallery.innerHTML = "";
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
