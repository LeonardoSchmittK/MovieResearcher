// Auth elements
const btnLogin = document.querySelector(".btnLogin");
const btnRegister = document.querySelector(".btnRegister");
const btnLogout = document.querySelector(".btnLogout");
const btnGoogleAuth = document.querySelector(".btnGoogleAuth");
const passwordInput = document.querySelector("#passwordInput");
const emailInput = document.querySelector("#emailInput");
const perfilLogged = document.querySelector(".auth__perfil");
const form = document.querySelector(".auth__form");
const username = document.querySelector(".auth__username");
const errorMessage = document.querySelector(".auth__error");
const userImg = document.querySelector("#user-img");
const authToggle = document.querySelector(".auth__toggle");
const authTitle = document.querySelector(".auth__title");
const auth = document.querySelector(".auth");
const userInfo = document.querySelector(".auth__user-info");
const authInputEffect = [
	...window.document.getElementsByClassName("auth__input"),
];
const toggleAuth = document.querySelector(".toggle-auth");
const authToggleUserIcon = document.querySelector(".toggle-auth__user-icon");
const inputs = [...document.getElementsByClassName("auth__input")];

// Popup elements

const popup = document.querySelector(".popup");
const popupCloseIcon = document.querySelector(".popup__icon-close");
const popupTitle = document.querySelector(".popup__title");
const popupDescription = document.querySelector(".popup__description");

const eyeInner = document.querySelector(".popup__eye__inner");
const eyeOuter = document.querySelector(".popup__eye__outer");

// Header elements

const header = document.querySelector(".header");
const searchMovieButton = document.querySelector(".header__search-button");
const movieInput = document.querySelector("#search-movie");
const btnDarkMode = document.querySelector(".btn-darkMode");
const btnChangeView = document.querySelector(".btn-changeView");
const btnNotice = document.querySelector(".btn-notice");
const btnFavorites = document.querySelector(".btn-favorites");
const btnSearched = document.querySelector(".btn-searched");
const btnRemoveCards = document.querySelector(".btn-remove-cards");
const headSecondaryBtns = document.querySelector(
	".header__buttons__secondary-container"
);

// Body elements

const banner = document.getElementById("screens");
const bannerMovieImg = [document.getElementsByName("banner__movie-img")];
const cardsHero = document.querySelector(".banner__card");
const bannerSvg = document.querySelector("#banner__image");
const movieCards = [];
const footer = document.querySelector(".footer");
const iconGoToTop = document.querySelector(".footer__icon-go-to-top");

// loading

const loading = window.document.querySelector(".loading");

// Overlay

const overlay = document.querySelector(".overlay");

// features

const btnMicrophone = document.querySelector(".micro-btn");
