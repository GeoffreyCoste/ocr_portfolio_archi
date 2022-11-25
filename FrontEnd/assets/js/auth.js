class Auth {
    constructor(body, header) {
        const data = sessionStorage.getItem("user_data");
        const user = JSON.parse(data);
        this.body = body;
        this.header = header;
        this.userId = user.id;
        this.displayEditMode = user.isEditModeDisplayed;

        this.windowInnerWidth = window.innerWidth; // Full screen size width including the scrollbar
        this.bodyClientWidth = document.body.clientWidth; // Getting body width (screen full width - margin left and right - scrollbar width)
        this.bodyMarginLeft = parseInt(window.getComputedStyle(document.body).getPropertyValue('margin-left'), 10); // Since body has margin auto, getting margin left value in px and keeping only the integer thanks to parseInt

        this.validateAuth();
        this.onResize();
    }

    // check if sessionStorage contains logged in user data
    validateAuth() {
        if (this.userId && this.displayEditMode == true) {
            console.log('User logged in. Edit mode activated.');
            this.createEditDOMElements();
        } else {
            console.log('No user logged in. Edit mode disabled.');
        }
    }

    createEditDOMElements() {
        this.editTopBar = document.createElement("div");
        
        this.editTopBar.classList.add("edit-top-bar");
        
        this.editTopBar.innerHTML = `
            <i class="fa-regular fa-pen-to-square"></i>
            <p>Mode édition</p>
            <button class="btn-edit-validate btn-logout">publier les changements</button>
        `;

        this.takeFullViewportWidth(this.editTopBar);

        const targets = document.querySelectorAll('.target');

        targets.forEach(target => {
            this.fieldEditBtn = document.createElement("a");
            this.fieldEditBtn.classList.add("btn-edit-field");
            this.fieldEditBtn.innerHTML = `
                <i class="fa-regular fa-pen-to-square"></i>
                <p>modifier</p>
            `;

            this.insertDOMElement(target, this.fieldEditBtn, target.getAttribute('data-insert-position'));

        });

        this.body.insertBefore(this.editTopBar, this.header);
    }

    insertDOMElement(target, element, position) {
        target.insertAdjacentElement(position, element);
    };

    onResize() {
        window.addEventListener('resize', (e) => {
            e.preventDefault();
            this.windowInnerWidth = window.innerWidth;
            this.bodyClientWidth = document.body.clientWidth;
            this.bodyMarginLeft = parseInt(window.getComputedStyle(document.body).getPropertyValue('margin-left'), 10);
            this.takeFullViewportWidth(this.editTopBar);
        });
    };

    takeFullViewportWidth(el) {

        /* Calculating for element with width equal to 100vw, 
        the negative translateX value in px to (re)position the element, 
        due to body's margin, so that it would effectively occupy full viewport width, i.e.:
            scrollbar width = window inner width - (margin left * 2) + body client width)
            translateX = margin left + scrollbar width
        */
        let translateX = `-${this.bodyMarginLeft + (this.windowInnerWidth - ((this.bodyMarginLeft * 2) + this.bodyClientWidth))}px`;
        el.style.transform = `translateX(${translateX})`;
    }
}

const body = document.querySelector("body");
const header = document.querySelector("header");

const auth = new Auth(body, header);