const error = document.querySelector('.error-message');

const checkFile = (file) => {
    if (file.size > 4194304) {
        error.innerText = `Veuillez sélectionner un fichier dont la taille n'excède pas 4Mo.`
    }
};

export { checkFile };