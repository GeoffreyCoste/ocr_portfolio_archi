// Nav.js

const navbar = document.querySelector('nav');

const createMobileMenuButtonTogglerElement = () => {
    const buttonToggler = document.createElement('button');
    buttonToggler.setAttribute('type', 'button');
    buttonToggler.classList.add('btn', 'btn--no-border', 'btn--navbar-toggler');
    buttonToggler.innerHTML = `<i class="fa-solid fa-bars"></i>`;

    navbar.append(buttonToggler);

    buttonToggler.addEventListener('click', (e) => {
        e.preventDefault();
        toggleMobileNavbarCollapse();
    });

    return navbar;
};

const createMobileNavbarCollapseElement = () => {
    const navbarCollapse = document.createElement('div');
    navbarCollapse.classList.add('navbar-collapse');

    const navbarNav = document.querySelector('header > nav > ul').cloneNode(true);
    navbarNav.classList.add('navbar-nav');

    const navLinks = Array.from(navbarNav.querySelectorAll('a'));
    navLinks.forEach((navLink) => {
        navLink.addEventListener('click', () => {
            toggleMobileNavbarCollapse();
        });
    });

    navbarCollapse.append(navbarNav);
    navbar.append(navbarCollapse)

    return navbarCollapse;
};

const toggleMobileNavbarCollapse = () => {
    const buttonToggler = document.querySelector('.btn--navbar-toggler');
    const navbarCollapse = document.querySelector('.navbar-collapse');
    if (!navbarCollapse.classList.contains('show')) {
        navbarCollapse.classList.add('show');
        buttonToggler.innerHTML = '';
        buttonToggler.innerHTML = `<i class="fa-solid fa-xmark"></i>`;
        document.body.classList.add('no-scroll');
    } else {
        navbarCollapse.classList.remove('show');
        buttonToggler.innerHTML = '';
        buttonToggler.innerHTML = `<i class="fa-solid fa-bars"></i>`;
        document.body.classList.remove('no-scroll');
    }
};

export { createMobileMenuButtonTogglerElement, createMobileNavbarCollapseElement };

