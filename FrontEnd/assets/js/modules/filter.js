import { displayWorks } from "./works.js";

const portfolio = document.querySelector('#portfolio');
const gallery = document.querySelector('.gallery');

/* Creation of filter menu and buttons inside */
const createFilterMenu = (works) => {
    const filterMenu = document.createElement('div');
    filterMenu.classList.add('filters');

    const btnFilterAll = document.createElement('button');
    btnFilterAll.classList.add('btn', 'btn--filter', 'active');
    btnFilterAll.dataset.name = 'tous';
    btnFilterAll.innerText = 'Tous';

    const btnFilterCategoriesNodes = works
                                        .reduce((names, obj) => {
                                            if (!names.includes(obj.category.name)) {
                                                names.push(obj.category.name)
                                            }
                                            return names;
                                        }, [])
                                        .map((name) => {
                                            return createCategoryFilterBtn((name));
                                        });
    
    portfolio.insertBefore(filterMenu, gallery);
    filterMenu.innerHTML = "";
    filterMenu.append(btnFilterAll, ...btnFilterCategoriesNodes);
    
    const btnFilters = [btnFilterAll, ...btnFilterCategoriesNodes];
    handleFilters(btnFilters, works);
}

const createCategoryFilterBtn = (name) => {
    const categoryFilterBtn = document.createElement('button');
    categoryFilterBtn.classList.add('btn', 'btn--filter');
    categoryFilterBtn.dataset.name = name.toLowerCase();
    categoryFilterBtn.innerText = name;
    return categoryFilterBtn;
};

/* Filtering works displayed in gallery */
const handleFilters = (btnFiltersArr, works) => {
    btnFiltersArr.forEach(btn => {
        btn.addEventListener('click', (event) => {
            toggleActive(event);
            filterWorks(event, works);
        });
    });

    const filterWorks = (event, works) => {
        let btnFilter = event.target;
        if (btnFilter.dataset.name !== 'tous') {
            const filteredWorks = works.filter(work => work.category.name.toLowerCase() === btnFilter.dataset.name);
            return displayWorks(filteredWorks);
        } else {
            return displayWorks(works);
        };
    }

    const toggleActive = (event) => {
        let target = event.target;
        btnFiltersArr.forEach(btn => {
            if (btn === target && !btn.classList.contains('active')) {
                btn.classList.add('active');
            } else if (btn === target && btn.classList.contains('active')) {
                return
            } else {
                btn.classList.remove('active');
            }
        });
    };
};

const removeFilterMenu = () => {
    const filters = document.querySelector('.filters');
    console.log(filters);
    filters.classList.add("hidden");
};

export { createFilterMenu, removeFilterMenu };