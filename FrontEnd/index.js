let gallery = document.querySelector('.gallery');

document.addEventListener('DOMContentLoaded', () => {
    const getWorksData = () => {
        fetch('http://localhost:5678/api/works')
        .then((res) => {
            if(res.ok) {
                return res.json();
            }
        })
        .then((works) => {
            works.forEach(work => createFigureElement(work));
        })
        .catch(e => console.log(e));
    };

    getWorksData();
});

const createFigureElement = (obj) => {
    const figure = document.createElement('figure');
    figure.innerHTML = `
        <img src=${obj.imageUrl} alt=${obj.title}>
        <figcaption>${obj.title}</figcaption>
    `
    gallery.append(figure);
};