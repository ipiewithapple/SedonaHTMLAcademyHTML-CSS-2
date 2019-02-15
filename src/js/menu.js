var menuNav = document.querySelector('.main-nav');
var menuToggle = document.querySelector('.main-nav__toggle');
var menuList = document.querySelector('.nav-list');

if (menuNav.classList.contains('main-nav--nojs')) {
  menuNav.classList.remove('main-nav--nojs');
  menuToggle.classList.remove('visually-hidden');
};

menuToggle.addEventListener('click', function () {
  if (menuNav.classList.contains('main-nav--closed')) {
    menuNav.classList.add('main-nav--opened');
    menuNav.classList.remove('main-nav--closed');
  } else {
    menuNav.classList.add('main-nav--closed');
    menuNav.classList.remove('main-nav--opened');
  };
});
