/**************
 * filters.js *
 * ************/

import { getWorks, displayWorksGallery } from '../works/works.js';
import { getNoDuplicateCategoriesArr } from '../categories/categories.js';


// 1. Menu

// create filter menu element
const createFilterMenu = () => {
    const filterMenu =  document.createElement('div');
    filterMenu.classList.add('filters');
    return filterMenu;
};

// display filter menu element 
// inside 'el' parent param and before 'node' child param
const displayFilterMenu = (el, node) => {
    const menu = createFilterMenu();
    el.insertBefore(menu, node);
    displayFilterButtons(menu);
};


// remove filter menu
const removeFilterMenu = () => {
    const menu = document.querySelector('.filters');
    menu.classList.add("hidden");
};


// 2. Buttons

// create filter button element
const createFilterButtonElement = (filter) => {
    const button = document.createElement('button');
    button.classList.add('btn', 'btn--filter');
    button.dataset.name = filter.toLowerCase();
    button.innerText = filter;
    return button;
};

// map all filters params as filter button node
const mapFilters = (filters) => {
    const filterButtonsNodes = filters.map((filter) => {
        return createFilterButtonElement(filter);
    });
    return filterButtonsNodes;
};

// display all filter button nodes inside 'el' param
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

// manage works filter upon filter button click
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

// filter works datas according to categories and active filter button
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

// switch active filter button
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
