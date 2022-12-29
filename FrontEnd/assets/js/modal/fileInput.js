/****************
 * fileInput.js *
 * **************/

import { displayError } from "../errors/errors.js";

// remove all children of an element
const removeChildren = (node) => {
    while (node.lastChild) {
        node.lastChild.remove();
    }
    return node;
};

// create thumbnail including file preview of file selected through input[type="file"]
const previewFile = (file) => {
    // return a newly constructed FileReader object 
    // that will allow asynchronously file reading 
    // as from a FileList object provided by an input[type="file"]
    const fileReader = new FileReader();

    // create new img tag
    const img = document.createElement('img');
    img.classList.add('img__preview');
    img.alt = file.name;

    fileReader.addEventListener('load', (e) => {
        // result property only valid after read operation complete 
        // equal to file's content
        img.src = e.target.result;
    }, false);

    fileReader.addEventListener('error', (e) => {
        let error = new Error('Une erreur est survenue lors du chargement du fichier .');
        displayError(error, container, form, false);
    })

    if (file) {
        // starts reading the file's content 
        // provide, as result, a data: URL representing file's data
        fileReader.readAsDataURL(file);
    };
    return img;
};

export { removeChildren, previewFile };