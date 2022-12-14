// Index.js

import { validateAuth } from './auth.js';
import { createMobileMenuButtonTogglerElement, createMobileNavbarCollapseElement } from './nav.js';
import { displayWorksGallery } from './works.js';

validateAuth();
createMobileMenuButtonTogglerElement();
createMobileNavbarCollapseElement();
displayWorksGallery();
