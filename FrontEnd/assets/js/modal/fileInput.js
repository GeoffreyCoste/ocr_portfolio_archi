/****************
 * fileInput.js *
 * **************/

// create array to store file(s) selected 
// by default the input file only allow to select one file 
// without attribute 'multiple'
let files = [];

const uploadFile = (input) => {
    /* removeFile(); */
    const error = document.querySelector('.modal__body.add__work .error-message');
    error.innerHTML = '';
    error.classList.remove('show');
    console.log(files);
    // push every file in FileList (i.e. input.files) into array files
    files = [...input.files];
    updateThumbnail();
};

const removeFile = (/* name */) => {
    // in case 'multiple' attribute would be passed to input file
    // find index of file with its 'name' passed as parameter
    // and then remove it
    /* const index = files.findIndex(file => file.name === name);
    if (index === -1) return;
    files.splice(index, 1);
    updateThumbnail(); */

    files.shift();
    updateThumbnail();
};

const previewFile = (file) => {
    const sizeLimit = 4194304;
    return new Promise((resolve, reject) => {
        if (file.size > sizeLimit) {
            reject(new Error("Le fichier sélectionné excède la limite autorisée."));
        } else {
            const fileReader = new FileReader();

            const onLoad = (e) => {
                // code that will run only when FileReader successfully reads a file
                const img = document.createElement('img');
                img.classList.add('img__preview');
                img.alt = file.name; // use the file name as 'alt'

                img.onload = () => resolve(img); // if img created from data, promise resolved with it
                img.onerror = () => resolve(null); // in case of failed img creation, promise resolved with 'null', but could result in reject and error handling

                img.src = e.target.result; // start loading dataUrl
            }

            fileReader.onload = onLoad; // if reader successfully made dataUrl, onLoad function is triggered
            fileReader.onerror = () => resolve(null); // if reader could not create dataUrl, no need tp make an img, so Promise resolved with 'null' to signify failed load

            fileReader.readAsDataURL(file); // start entire loading logic
        }
    })
    /* console.log(file);
    // return new Promise which allows to specify when file loading is done
    // and run code only after 
    return new Promise((resolve, reject) => {
        const fileReader = new FileReader();

        const onLoad = (e) => {
            // code that will run only when FileReader successfully reads a file
            const img = document.createElement('img');
            img.classList.add('img__preview');
            img.alt = file.name; // use the file name as 'alt'

            img.onload = () => resolve(img); // if img created from data, promise resolved with it
            img.onerror = () => resolve(null); // in case of failed img creation, promise resolved with 'null', but could result in reject and error handling

            img.src = e.target.result; // start loading dataUrl
        }

        fileReader.onload = onLoad; // if reader successfully made dataUrl, onLoad function is triggered
        fileReader.onerror = () => resolve(null); // if reader could not create dataUrl, no need tp make an img, so Promise resolved with 'null' to signify failed load

        fileReader.readAsDataURL(file); // start entire loading logic
    }); */
};

// remove all children of an element
const removeChildren = (node) => {
    while (node.lastChild) {
        node.lastChild.remove();
    }
    return node;
}

const updateThumbnail = () => {
    const thumbnail = document.querySelector('.thumbnail');
    const btnSelectImg = document.querySelector('.btn--select-img');
    const error = document.querySelector('.modal__body.add__work .error-message');
    Promise
        .all(files.map(previewFile)) // Promise.all(promises) creates a promise resolved when all "promises" have been resolved. This will be the 'file(s)' array of image(s) or null(s) (i.e. including only one element but which could store multiple).
        .then(images => images.filter(img => img !== null)) // ignore failed img
        .then(images => { 
            removeChildren(thumbnail).append(...images); // remove old preview and add new one
            btnSelectImg.classList.add('invisible');
        }) 
        .catch((e) => {
            console.log(e);
            removeChildren(thumbnail);
            removeFile();
            console.log(files);
            btnSelectImg.classList.remove('invisible');
            error.classList.add('show');
            error.innerText = e.message;
        });
    /* Promise
        .all(files.map(previewFile)) // Promise.all(promises) creates a promise resolved when all "promises" have been resolved. This will be the 'file(s)' array of image(s) or null(s) (i.e. including only one element but which could store multiple).
        .then(images => images.filter(img => img !== null)) // ignore failed img
        .then(images => removeChildren(thumbnail).append(...images)) // remove old preview and add new one
        .catch((e) => {
            console.log(e);
            const error = document.querySelector('.modal__body.add__work .error-message');
            error.classList.add('show');
            error.innerText = e.message;
        }); */
};

export { uploadFile, removeFile };