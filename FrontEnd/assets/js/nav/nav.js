/**********
 * nav.js *
 * ********/

const navbar = document.querySelector('nav');

// creation of mobile menu elements
const createMobileMenuElements = () => {
    // create mobile toggler button
    const  buttonToggler = document.createElement('div');
    buttonToggler.classList.add('btn--navbar-toggler');
    buttonToggler.innerHTML = `
        <div class="bar"></div>
        <div class="bar"></div>
        <div class="bar"></div>
        <div class="bar"></div>
    `;

    // create mobile menu
    const mobileMenu = document.createElement('div');
    mobileMenu.classList.add('navbar-collapse', 'mobile__menu');

    mobileMenu.innerHTML = `
        <div class="mobile__menu__background">
            <div class="vertical__banner"></div>
            <div class="vertical__banner"></div>
            <div class="vertical__banner"></div>
        </div>
    `;

    // add mobile toggler button and mobile menu to the navbar
    navbar.append(buttonToggler, mobileMenu);
    const banners = Array.from(document.querySelectorAll('.vertical__banner'));

    // clone navbar-nav list from default nav tag
    const navbarNav = document.querySelector('header > nav > ul').cloneNode(true);
    navbarNav.classList.add('navbar-nav');

    const navLinks = Array.from(navbarNav.querySelectorAll('a'));
    navLinks.forEach((navLink) => {
        navLink.addEventListener('click', () => {
            buttonToggler.classList.toggle('open');
            // allow scrolling when mobile menu is closed
            document.body.classList.toggle('no-scroll');
            // remove navbarNav and revert banners animation
            navbarNav.remove();
            banners.forEach((ban, index) => {
                const multipliers = [1, 2, 3];
                const reverted = [...multipliers].reverse();
                setTimeout(() => {
                    ban.style.cssText = 'animation: 1s shrink-up linear forwards';
                }, 50 * reverted[index]);
            });
        });
    });

    buttonToggler.addEventListener('click', (e) => {
        e.preventDefault();
        buttonToggler.classList.toggle('open');
        document.body.classList.toggle('no-scroll'); // scroll not allowed when mobile toggler button has class '.open' (= mobile menu open)

        banners.forEach((ban, index) => {
            const multipliers = [1, 2, 3];
            const reverted = [...multipliers].reverse();
            // start banners' animation with a delay between each one
            // delay equal to 50ms * each multipliers (or reversed multipliers)
            setTimeout(() => {
                ban.style.cssText = `animation: 1s ${buttonToggler.classList.contains('open') ? 'grow-down' : 'shrink-up' } linear forwards`;
            }, 50 * (`${buttonToggler.classList.contains('open') ? multipliers[index] : reverted[index] }`));
        });

        const secondBanner = mobileMenu.getElementsByTagName('div')[0].getElementsByTagName('div')[1]; // target second div with class 'vertical__banner'
        // add / remove navbarNav inside second banner of mobile menu
        buttonToggler.classList.contains('open') ? setTimeout(() => {
            secondBanner.append(navbarNav);
        }, 1000) : navbarNav.remove();
        
    });

    return navbar;
}

export { createMobileMenuElements };