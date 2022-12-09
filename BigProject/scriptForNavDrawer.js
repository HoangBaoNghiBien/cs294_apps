const topAppBarElement = document.querySelector('.mdc-top-app-bar');
const topAppBar = new mdc.topAppBar.MDCTopAppBar(topAppBarElement);
const drawer = mdc.drawer.MDCDrawer.attachTo(document.querySelector('.mdc-drawer'));
const listEl = document.querySelector('.mdc-drawer .mdc-list');
listEl.addEventListener('click', (event) => {
  drawer.open = false;
});

document.querySelector(".mdc-top-app-bar__navigation-icon").addEventListener('click', () => {
  drawer.open = true;
})



