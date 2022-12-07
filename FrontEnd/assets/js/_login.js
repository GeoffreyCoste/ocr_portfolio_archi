class Login {
    constructor(form) {
        this.form = form;
        this.error = document.querySelector('.error-message');
        this.validateOnSubmit();
    }

    validateOnSubmit() {

        // add form 'submit' event listener
        this.form.addEventListener('submit', async (e) => {
            // remove form submit default behavior
            e.preventDefault();
            // submit form data and proceed with API login
            const formData = new FormData(this.form);
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
}

const form = document.querySelector('#login form')
const loginForm = new Login(form);