/************
 * login.js *
 * **********/

import { login } from './auth/auth.js';
import { createMobileMenuElements } from './nav/nav.js';

// submit login form datas and create sessionStorage datas 
// before replacing window location
login();

// create and display mobile hamburger toggler button and mobile menu
createMobileMenuElements();