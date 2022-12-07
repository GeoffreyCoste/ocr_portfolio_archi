import { checkFile } from "./checkFile.js";

const filePreview = (e) => {
    const input = e.target;
    const file = input.files;

    if (file) {
        checkFile(file);
        const fileReader = new FileReader();
        const preview = document.querySelector('.file__preview');

        fileReader.addEventListener('load', (e) => {
            preview.setAttribute('src', e.target.result);
        });

        fileReader.readAsDataURL(file[0]);
    }
};

export { filePreview };