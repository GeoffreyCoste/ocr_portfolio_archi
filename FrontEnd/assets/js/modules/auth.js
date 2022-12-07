import { createEditDOMElements } from "./edit.js";

const data = sessionStorage.getItem("user_data");

let isEditModeDisplayed = false;

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

const login = () => {
    let loginForm = document.querySelector('#login form');

    const validateOnSubmit = (loginForm) => {
        // add form 'submit' event listener
        loginForm.addEventListener('submit', async (e) => {
            // remove form submit default behavior
            e.preventDefault();
            // submit form data and proceed with API login
            const formData = new FormData(loginForm);
            const values = Object.fromEntries(formData.entries());
            try {
                const json = JSON.stringify(values);
                const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTY1MTg3NDkzOSwiZXhwIjoxNjUxOTYxMzM5fQ.JGN1p8YIfR-M-5eQ-Ypy6Ima5cKA4VbfL2xMr2MgHm4';
                const response = await fetch('http://localhost:5678/api/users/login', {
                    method: 'POST',
                    body: json,
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                });
                switch(response.status) {
                    case 200:
                        const user = await response.json();
                        const userId = user.userId;
                        const userLoggedIn = JSON.stringify({id: userId, isEditModeDisplayed: true})
                        sessionStorage.setItem('user_data', userLoggedIn);
                        window.location.replace('index.html');
                        break;
                    case 401:
                        this.error.innerText = "Erreur dans l’identifiant ou le mot de passe.";
                        break;
                    case 404:
                        this.error.innerText = "Echec de la connexion. Vous ne disposez pas des droits et autorisations requis.";
                        break;
                    default:
                        this.error.innerText = "Une erreur est survenue.";
                }
            } catch (e) {
                this.error.innerText = "La connexion au serveur a échoué. Veuillez réessayer.";
                console.log(e);
            }
        });
    }

    validateOnSubmit(loginForm);
};

export { login, validateAuth, isEditModeDisplayed };