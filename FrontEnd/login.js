class Login {
    constructor(form) {
        this.form = form;
        this.error = document.querySelector('.error-message');
        this.validateOnSubmit();
    }

    validateOnSubmit() {
        let self = this; // setup calls to 'this' values as from class constructor

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
                if (response.status == 200) {
                    const user = await response.json();
                    const userId = user.userId;
                    const userLoggedIn = JSON.stringify({id: userId, isEditModeDisplayed: true})
                    sessionStorage.setItem('user_data', userLoggedIn);
                    window.location.replace('index.html');
                } else if (response.status == 404) {
                    this.error.innerText = "Erreur dans l’identifiant ou le mot de passe";
                }
                /* const user = await response.json();
                console.log(user); */
            } catch (e) {
                console.log(e);
            }
        });
    }
}

const form = document.querySelector('#login form')
const loginForm = new Login(form);



/* const loginForm = document.querySelector('#login form');
console.log(loginForm);

loginForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const formData = new FormData(loginForm);
    const values = Object.fromEntries(formData.entries());
    console.log(values);
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
        if (response.status == 200) {
            sessionStorage.setItem('isUserLoggedIn', 'true');
            window.location.replace('index.html');
        } 
        /* const user = await response.json();
        console.log(user); *
    } catch (e) {
        console.log(e);
    }
}); */
