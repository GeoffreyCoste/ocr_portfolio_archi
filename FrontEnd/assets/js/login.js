// Login.js

import { login } from './auth/auth.js';
import { createMobileMenuButtonTogglerElement, createMobileNavbarCollapseElement } from './nav/nav.js';


// submit login form datas and create sessionStorage datas 
// before replacing window location
login();

// create and display mobile hamburger toggler button for mobile menu
createMobileMenuButtonTogglerElement();

// create mobile menu and its included navbar
createMobileNavbarCollapseElement();