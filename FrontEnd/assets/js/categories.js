// Categories

const getCategories = async () => {
    try {
        const response = await fetch('http://localhost:5678/api/categories');
        const categories = await response.json();
        /* displayCategoriesOptions(categories); */
        return categories;
    } catch (err) {
        console.log(err);
        /* const error = document.createElement('p');
        error.classList.add('error-message');
        error.style.gridColumn = '2/3';
        error.style.gridRow = '1/2';
        error.innerText = 'Un problème est survenu lors du chargement.';
        gallery.innerHTML = '';
        gallery.append(error); */
    };
};

const getNoDuplicateCategoriesArr = async () => {
    const data = getCategories();
    const json = await data;
    const nameArr = json.map(item => item.name);
    const categories = [...new Set(nameArr)];

    return categories;
}

export { getCategories, getNoDuplicateCategoriesArr };