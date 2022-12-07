import { fetchWorksData } from './modules/works.js';
import { login, validateAuth } from './modules/auth.js';
import { onWindowResize } from './utils/makeElementTakeFullViewportWidth.js';

/* let works;
let data = async () => {
    console.log('inside data');
    works = await fetchWorksData();
    console.log(works);
    return works;
}
data(); */

const homepage = document.querySelector('#introduction');
const loginpage = document.querySelector('#login');

if (homepage) {
    fetchWorksData();
    validateAuth(); 
    onWindowResize();
}

if (loginpage) {
    login(); 
}

/* fetchWorksData();
validateAuth(); */