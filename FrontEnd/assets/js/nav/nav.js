/**********
 * nav.js *
 * ********/


const navbar = document.querySelector('nav');

// 1. mobile hamburger toggle button

// create mobile hamburger toggle button element
const createMobileMenuButtonTogglerElement = () => {
    const buttonToggler = document.createElement('button');
    buttonToggler.setAttribute('type', 'button');
    buttonToggler.classList.add('btn', 'btn--no-border', 'btn--navbar-toggler');
    buttonToggler.innerHTML = `<i class="fa-solid fa-bars"></i>`;

    navbar.append(buttonToggler);

    buttonToggler.addEventListener('click', (e) => {
        e.preventDefault();
        // show / hide mobile menu + navbar on click
        toggleMobileNavbarCollapse();
    });

    return navbar;
};


// 2. mobile menu + navbar collapse element

// create  mobile menu + navbar collapse element
const createMobileNavbarCollapseElement = () => {
    const navbarCollapse = document.createElement('div');
    navbarCollapse.classList.add('navbar-collapse');

    // clone navbar-nav list from default nav tag
    const navbarNav = document.querySelector('header > nav > ul').cloneNode(true);
    navbarNav.classList.add('navbar-nav');

    const navLinks = Array.from(navbarNav.querySelectorAll('a'));
    navLinks.forEach((navLink) => {
        navLink.addEventListener('click', () => {
            // show / hide mobile menu + navbar on click
            toggleMobileNavbarCollapse();
        });
    });

    navbarCollapse.append(navbarNav);
    navbar.append(navbarCollapse)

    return navbarCollapse;
};

// show / hide mobile menu + navbar upon click on hamburger mobile toggler button
const toggleMobileNavbarCollapse = () => {
    const editTopBar = document.querySelector('.edit-top-bar');
    const buttonToggler = document.querySelector('.btn--navbar-toggler');
    const navbarCollapse = document.querySelector('.navbar-collapse');
    if (!navbarCollapse.classList.contains('show')) {
        // in case user is logged in and edit mode active, hiding edit top bar
        if (editTopBar) {
            editTopBar.classList.add('hidden');
        }
        // show mobile menu + navbar
        navbarCollapse.classList.add('show');
        buttonToggler.innerHTML = '';
        // change hamburger mobile toggler button icon
        buttonToggler.innerHTML = `<i class="fa-solid fa-xmark"></i>`;
        // provide body from scrolling while mobile menu is opened
        document.body.classList.add('no-scroll');
    } else {
        // in case user is logged in and edit mode active, replacing edit top bar
        if (editTopBar) {
            editTopBar.classList.remove('hidden');
        }
        // hide mobile menu + navbar
        navbarCollapse.classList.remove('show');
        buttonToggler.innerHTML = '';
        // switch back hamburger mobile toggler button icon
        buttonToggler.innerHTML = `<i class="fa-solid fa-bars"></i>`;
        // allow body to scroll again while mobile menu is closed
        document.body.classList.remove('no-scroll');
    }
};

export { createMobileMenuButtonTogglerElement, createMobileNavbarCollapseElement };

