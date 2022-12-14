/***********
 * auth.js *
 * *********/

import { displayEditElements } from '../edit/edit.js';
import { displayFilterMenu } from '../filters/filters.js';


/* let isEditModeDisplayed = false; */

// check if sessionStorage contains logged in user data
const validateAuth = () => {
    const userLoggedIn = null || sessionStorage.getItem("user_data");

    const portfolio = document.querySelector('#portfolio');
    const gallery = document.querySelector('#portfolio .gallery');

    if (userLoggedIn) {
        console.log('User logged in. Edit mode activated.');
        /* isEditModeDisplayed = !isEditModeDisplayed; */

        // in case of user logged in, display edit top bar and field edit buttons
        displayEditElements();
    } else {
        console.log('No user logged in. Edit mode disabled.');
        /* isEditModeDisplayed = false; */

        // in case no user is logged in, display filter menu
        displayFilterMenu(portfolio, gallery);
    };
};

// submit login form datas and create sessionStorage datas 
// before replacing window location
const login = () => {
    const error = document.querySelector('#login .error-message');
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
                        console.log(user);
                        const userToken = user.token;
                        const userId = user.userId;
                        const userLoggedIn = JSON.stringify({id: userId/* , isEditModeDisplayed: true */})
                        sessionStorage.setItem('user_data', userLoggedIn);
                        // storing user token required for works delete requests
                        sessionStorage.setItem('user_token', userToken);
                        window.location.replace('index.html');
                        break;
                    case 401:
                        // creating Error Object (i.e. { name: 'Error', message: 'String passed in the constructor' }) 
                        // to be captured by catch block below
                        throw new Error("Erreur dans l’identifiant ou le mot de passe.");
                        break;
                    case 404:
                        // creating Error Object (i.e. { name: 'Error', message: 'String passed in the constructor' }) 
                        // to be captured by catch block below
                        throw new Error("Echec de la connexion. Vous ne disposez pas des droits et autorisations requis.");
                        break;
                    default:
                        // creating Error Object (i.e. { name: 'Error', message: 'String passed in the constructor' }) 
                        // to be captured by catch block below
                        throw new Error("Une erreur est survenue.");
                }
            } catch (e) {
                console.log(e);
                // display message property of captured Error Object captured
                error.innerText = e.message;
            }
        });
    }

    validateOnSubmit(loginForm);
};

export { validateAuth, login }