/************
 * index.js *
 * **********/

import { validateAuth } from './auth/auth.js';
import { createMobileMenuButtonTogglerElement, createMobileNavbarCollapseElement } from './nav/nav.js';
import { displayWorksGallery } from './works/works.js';


// check if sessionStorage contains logged in user data
validateAuth();

// create and display mobile hamburger toggler button for mobile menu
createMobileMenuButtonTogglerElement();

// create mobile menu and its included navbar
createMobileNavbarCollapseElement();

// display works data
displayWorksGallery();
