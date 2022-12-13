// Filters.js

import { getWorks, displayWorksGallery } from './works.js';
import { getNoDuplicateCategoriesArr } from './categories.js';


// Menu
const createFilterMenu = () => {
    const filterMenu =  document.createElement('div');
    filterMenu.classList.add('filters');
    return filterMenu;
};

const displayFilterMenu = (el, node) => {
    const menu = createFilterMenu();
    el.insertBefore(menu, node);
    displayFilterButtons(menu);
};

const removeFilterMenu = () => {
    const menu = document.querySelector('.filters');
    menu.classList.add("hidden");
};

// Buttons
const mapFilters = (filters) => {
    const filterButtonsNodes = filters.map((filter) => {
        return createFilterButtonElement(filter);
    });
    return filterButtonsNodes;
};

const createFilterButtonElement = (filter) => {
    const button = document.createElement('button');
    button.classList.add('btn', 'btn--filter');
    button.dataset.name = filter.toLowerCase();
    button.innerText = filter;
    return button;
};

const displayFilterButtons = async (el) => {
    const data = getNoDuplicateCategoriesArr();
    const categories = await data;
    const all = 'Tous';
    const filters = [all, ...categories];
    const filterButtonsNodes = mapFilters(filters);
    el.innerHTML = '';
    el.append(...filterButtonsNodes);
    handleFilters();
}

const handleFilters = () => {
    const btnFilters = Array.from(document.querySelectorAll('.btn--filter'));
    btnFilters[0].classList.add('active');
    btnFilters.forEach(btn => {
        btn.addEventListener('click', (event) => {
            toggleActive(btnFilters, event);
            filterWorks(event);
        });
    });
};

const filterWorks = async (event) => {
    const data = getWorks();
    const works = await data;
    let btnFilter = event.target;
    if (btnFilter.dataset.name !== 'tous') {
        const filteredWorks = works.filter(work => work.category.name.toLowerCase() === btnFilter.dataset.name);
        return displayWorksGallery(filteredWorks);
    } else {
        return displayWorksGallery();
    };
}

const toggleActive = (btnFilters, event) => {
    let target = event.target;
    btnFilters.forEach(btn => {
        if (btn === target && !btn.classList.contains('active')) {
            btn.classList.add('active');
        } else if (btn === target && btn.classList.contains('active')) {
            return
        } else {
            btn.classList.remove('active');
        }
    });
};

export { displayFilterMenu, removeFilterMenu };
