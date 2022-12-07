const body = document.querySelector("body");
const header = document.querySelector("header");
const portfolio = document.querySelector('#portfolio');
const gallery = portfolio.querySelector('.gallery');
const data = sessionStorage.getItem("user_data");
/* const user = JSON.parse(data);
const userId = user.id;
const isEditModeDisplayed = user.isEditModeDisplayed; */
const targets = document.querySelectorAll('.target');

// full screen size width including the scrollbar
let windowInnerWidth = window.innerWidth; 
// getting body width (screen full width - margin left and right - scrollbar width)
let bodyClientWidth = document.body.clientWidth; 
// since body has margin auto, getting margin left value in px and keeping only the integer thanks to parseInt
let bodyMarginLeft = parseInt(window.getComputedStyle(document.body).getPropertyValue('margin-left'), 10); 
let isEditModeDisplayed = false;
let editTopBar;
let layer;
let modal;
let works;


// check if sessionStorage contains logged in user data
const validateAuth = () => {
    if (data) {
        const user = JSON.parse(data);
        const userId = user.id;
        isEditModeDisplayed = user.isEditModeDisplayed;
        if (userId && isEditModeDisplayed == true) {
            console.log('User logged in. Edit mode activated.');
            createEditDOMElements();
        } else {
            console.log('No user logged in. Edit mode disabled.');
        };
    }
    
};

const createEditDOMElements = () => {
    editTopBar = document.createElement("div");
    
    editTopBar.classList.add("edit-top-bar");
    
    editTopBar.innerHTML = `
        <i class="fa-regular fa-pen-to-square"></i>
        <p>Mode édition</p>
        <button class="btn btn--edit-validate btn--logout">publier les changements</button>
    `;

    takeFullViewportWidth(editTopBar);

    targets.forEach(target => {
        const fieldEditBtn = document.createElement("button");
        fieldEditBtn.classList.add("btn", "btn--no-border", "btn--edit-field");
        fieldEditBtn.innerHTML = `
            <i class="fa-regular fa-pen-to-square"></i>
            <span>modifier</span>
        `;

        insertDOMElement(target, fieldEditBtn, target.getAttribute('data-insert-position'));
        fieldEditBtn.addEventListener('click', () => {
            openModal();
        });
    });

    body.insertBefore(editTopBar, header);
};

const insertDOMElement = (target, element, position) => {
    target.insertAdjacentElement(position, element);
};

const onWindowResize = () => {
    window.addEventListener('resize', (e) => {
        e.preventDefault();
        windowInnerWidth = window.innerWidth;
        bodyClientWidth = body.clientWidth;
        bodyMarginLeft = parseInt(window.getComputedStyle(body).getPropertyValue('margin-left'), 10);
        if (editTopBar) {
            takeFullViewportWidth(editTopBar);
        };
        if (layer) {
            takeFullViewportWidth(layer);
            layer.style.height = body.getBoundingClientRect().height + "px";
        }
    });
};

const takeFullViewportWidth = (el) => {

    /* calculating for element with width equal to 100vw, 
    the negative translateX value in px to (re)position the element, 
    due to body's margin, so that it would effectively occupy full viewport width, i.e.:
        scrollbar width = window inner width - (margin left * 2) + body client width)
        translateX = margin left + scrollbar width
    */
    let translateX = `-${bodyMarginLeft + (windowInnerWidth - ((bodyMarginLeft * 2) + bodyClientWidth))}px`;
    el.style.transform = `translateX(${translateX})`;
};

/* Getting API works data and display */
const fetchWorksData = async () => {
    try {
        const response = await fetch('http://localhost:5678/api/works');
        works = await response.json();
        displayWorks(works);
        createFilterMenu(works);
        if (isEditModeDisplayed) {
            removeFilterMenu();
        };
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

/* Modal creation for gallery edit feature */
const createLayer = () => {
    layer = document.createElement('div');
    layer.classList.add('layer');
    layer.style.height = body.getBoundingClientRect().height + "px";

    layer.addEventListener('click', () => {
        closeModal();
    });
}

const createModal = (type) => {
    let btnAddImage;
    switch(type) {
        case 'edit':
            modal = document.createElement('div');
            modal.classList.add('modal');
            modal.innerHTML = `
                <div class="modal__container">
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
                    <div class="modal__content"></div>
                </div>
            `;

            let galleryEdit = document.createElement('div');
            galleryEdit.classList.add('gallery', 'gallery--edit');
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
                `
                return editableFigure;
            });

            galleryEdit.innerHTML = '';
            galleryEdit.append(...figureNodes);


            btnAddImage = document.createElement('button');
            btnAddImage.classList.add('btn', 'btn--add-image');
            btnAddImage.innerText = "Ajouter une photo";

            let btnDeleteAll = document.createElement('button');
            btnDeleteAll.classList.add('btn', 'btn--no-border', 'btn--delete-all');
            btnDeleteAll.innerText = "Supprimer la galerie";

            let modalContent = modal.querySelector('.modal__content');
            modalContent.append(galleryEdit, btnAddImage, btnDeleteAll);
            break;

        case 'add':
            const btnBack = modal.querySelector('.btn--back');
            btnBack.classList.add('show');
            
            modal.querySelector('.header__title').innerText = "Ajout photo";
            modal.querySelector('.gallery--edit').classList.add('hidden');
            modalContent.querySelector('.modal__content').innerHTML = '';
            
            const formAddImage = document.createElement('form');
            form.classList.add('form', 'form--add-img');

            formAddImage.innerHTML = `
                <label for="image">Ajouter photo</label>
			    <input type="file" name="image" id="image" required>
			    <label for="title">Titre</label>
			    <input type="text" name="title" id="title" required>
			    <label for="category">Titre</label>
			    <select name="category" id="category">
                    <option value=""></option>
                </select>
			    <input class="btn btn--submit btn--add-image" type="submit" value="Valider">
            `;
            modalContent.querySelector('.modal__content').append(formAddImage);
            break;

        default:
            modal = document.createElement('div');
            modal.classList.add('modal');
            modal.innerHTML = `
                <div class="modal__container">
                    <div class="modal__header">
                        <div class="header__buttons">
                            <i class="fa-solid fa-arrow-left-long btn btn--no-border btn--back"></i>
                            <i class="fa-solid fa-xmark btn btn--no-border btn--close"></i>
                        </div>
                        <h3 class="header__title">Modal default title</h3>
                    </div>
                    <div class="modal__content">Modal default content</div>
                </div>
            `;
    }

    modal.addEventListener('click', (e) => {
        e.stopPropagation();
    });

    const btnClose = modal.querySelector('.btn--close');
    btnClose.addEventListener('click', () => {
        layer.remove();
    });



    const btnDeleteNodes = document.querySelectorAll('.btn--delete');
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

    btnAddImage.addEventListener('click', (e) => {
        e.preventDefault();
        createModal('add');
    });
};

const openModal = () => {
    window.scrollTo({
        /* top: ((Math.max(bodyOffsetHeight, bodyScrollHeight) / 2) - (((Math.max(bodyOffsetHeight, bodyScrollHeight) / 2) * 50)) / 100), */
        top: ((body.getBoundingClientRect().height / 2) - (((body.getBoundingClientRect().height / 2) * 19) / 100)),
        /* left: 0, */
        behavior: 'smooth'
    });
    /* body.classList.add('no-scroll'); */
    createLayer();
    createModal('edit');
    console.log(layer);
    /* console.log(modal); */
    /* body.prepend(layer); */
    body.insertBefore(layer, header);
    layer.append(modal);
    takeFullViewportWidth(layer);
}

const closeModal = () => {
    layer.remove();
}

fetchWorksData();
validateAuth();
onWindowResize();
