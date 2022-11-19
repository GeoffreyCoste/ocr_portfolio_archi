let portfolio = document.querySelector('#portfolio');
let gallery = document.querySelector('.gallery');
let works;

/* Getting API works data and display */
const fetchWorksData = async () => {
    try {
        const response = await fetch('http://localhost:5678/api/works');
        works = await response.json();
        displayWorks(works);
        createFilterMenu(works);
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

/* Creation of filter menu and buttons inside */
const createFilterMenu = (works) => {
    const filterMenu = document.createElement('div');
    filterMenu.classList.add('filters');

    const btnFilterAll = document.createElement('button');
    btnFilterAll.classList.add('btn-filter', 'active');
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
    categoryFilterBtn.classList.add('btn-filter');
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

fetchWorksData();

