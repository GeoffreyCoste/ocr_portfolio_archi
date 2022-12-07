import { makeElementTakeFullViewportWidth } from "./makeElementTakeFullViewportWidth";

const editTopBar = document.querySelector('.edit-top-bar');
const layer = document.querySelector('.layer');

export const onWindowResize = () => {
    window.addEventListener('resize', (e) => {
        e.preventDefault();
        windowInnerWidth = window.innerWidth;
        bodyClientWidth = document.body.clientWidth;
        bodyMarginLeft = parseInt(window.getComputedStyle(document.body).getPropertyValue('margin-left'), 10);
        if (editTopBar) {
            makeElementTakeFullViewportWidth(editTopBar);
        };
        if (layer) {
            makeElementTakeFullViewportWidth(layer);
            layer.style.height = document.body.getBoundingClientRect().height + "px";
        }
    });
};

