const body = document.querySelector('body');
const editTopBar = document.querySelector('.edit-top-bar');
const layer = document.querySelector('.layer');

// full screen size width including the scrollbar
let windowInnerWidth = window.innerWidth; 
// getting body width (screen full width - margin left and right - scrollbar width)
let bodyClientWidth = document.body.clientWidth; 
// since body has margin auto, getting margin left value in px and keeping only the integer thanks to parseInt
let bodyMarginLeft = parseInt(window.getComputedStyle(document.body).getPropertyValue('margin-left'), 10); 

const onWindowResize = () => {
    window.addEventListener('resize', (e) => {
        e.preventDefault();
        windowInnerWidth = window.innerWidth;
        bodyClientWidth = body.clientWidth;
        bodyMarginLeft = parseInt(window.getComputedStyle(body).getPropertyValue('margin-left'), 10);
        if (editTopBar) {
            makeElementTakeFullViewportWidth(editTopBar);
        };
        if (layer) {
            makeElementTakeFullViewportWidth(layer);
            layer.style.height = body.getBoundingClientRect().height + "px";
        }
    });
};

const makeElementTakeFullViewportWidth = (el) => {

    /* calculating for element with width equal to 100vw, 
    the negative translateX value in px to (re)position the element, 
    due to body's margin, so that it would effectively occupy full viewport width, i.e.:
        scrollbar width = window inner width - (margin left * 2) + body client width)
        translateX = margin left + scrollbar width
    */
    let translateX = `-${bodyMarginLeft + (windowInnerWidth - ((bodyMarginLeft * 2) + bodyClientWidth))}px`;
    el.style.transform = `translateX(${translateX})`;
};

export { makeElementTakeFullViewportWidth, onWindowResize }