/*************
 * errors.js *
 * ***********/

let errorContainer;

// create error element to display
const createErrorElement = (parentNode, referenceNode) => {
    errorContainer = document.createElement('div');
    errorContainer.classList.add('error__container');

    parentNode.insertBefore(errorContainer, referenceNode);
}

// provide an error object including a message property, 
// a parent and child Node required by the insertBefore() method of 'createErrorElement()' function
// a boolean value to confirm if child Node content shall be replaced
const displayError = (error, parentNode, referenceNode, replaceContent) => {
    
    const errorMessage = document.createElement('div');
    errorMessage.classList.add('error__message');
    errorMessage.innerHTML = `<p>${error.message}</p>`;

    if (errorContainer) {
        errorContainer.innerHTML = '';
        errorContainer.append(errorMessage);
    } else {
        createErrorElement(parentNode, referenceNode);
        errorContainer.append(errorMessage);
    }

    if (replaceContent) {
        referenceNode.innerHTML = '';
    }
};

export { displayError };