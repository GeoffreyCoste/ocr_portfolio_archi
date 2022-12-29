/************
 * index.js *
 * **********/

import { validateAuth } from './auth/auth.js';
import { createMobileMenuElements } from './nav/nav.js';
import { displayWorksGallery } from './works/works.js';

// check if sessionStorage contains logged in user data
validateAuth();

// create and display mobile hamburger toggler button and mobile menu
createMobileMenuElements();

// display works data
displayWorksGallery();