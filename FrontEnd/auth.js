class Auth {
    constructor(body, header) {
        const data = sessionStorage.getItem("user_data");
        const user = JSON.parse(data);
        this.body = body;
        this.header = header;
        this.userId = user.id;
        this.displayEditMode = user.isEditModeDisplayed;
        this.validateAuth();
    }

    // check if sessionStorage contains logged in user data
    validateAuth() {
        if (this.userId && this.displayEditMode == true) {
            console.log('Helloooo');
            this.createEditDOMElements();
        } else {
            console.log('Fuuuuck!');
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
    }
}

const body = document.querySelector("body");
const header = document.querySelector("header");


const auth = new Auth(body, header);