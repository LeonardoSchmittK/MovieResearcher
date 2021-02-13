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
const header = document.querySelector(".header");
const searchMovieButton = document.querySelector(".header__search-button");
const authToggleUserIcon = document.querySelector(".toggle-auth__user-icon");
const toggleAuth = document.querySelector(".toggle-auth");
const userInfo = document.querySelector(".auth__user-info");
const popup = document.querySelector(".popup");
const popupCloseIcon = document.querySelector(".popup__icon-close");
const popupTitle = document.querySelector(".popup__title");
const popupDescription = document.querySelector(".popup__description");
const inputMovie = document.querySelector("#search-movie");
const banner = document.getElementById("screens");
const eyeInner = document.querySelector(".popup__eye__inner");
const eyeOuter = document.querySelector(".popup__eye__outer");
const inputs = [...document.getElementsByClassName("auth__input")];
const btnDarkMode = document.querySelector(".btn-darkMode");
const btnChangeView = document.querySelector(".btn-changeView");
const btnNotice = document.querySelector(".btn-notice");
const btnFavorites = document.querySelector(".btn-favorites");
const btnSearched = document.querySelector(".btn-searched");
const btnRemoveCards = document.querySelector(".btn-remove-cards");
const btnToggleFooter = document.querySelector(".toggle-footer__btn");
const footer = document.querySelector(".footer");
const bannerMovieImg = [document.getElementsByName("banner__movie-img")];
const cardsHero = document.querySelector(".banner__card");
const iconGoToTop = document.querySelector(".footer__icon-go-to-top");
function showPopup(
	isToggle,
	msg = "Occurred an error, and we are as soon as possible solving the problem...",
	title = "Warning",
	type = "Warning"
) {
	popup.style.display = isToggle ? "block" : "none";
	popupTitle.innerHTML = title;
	popupDescription.innerHTML = msg;
	popup.style.borderBottom = `3px solid ${
		type === "Warning" ? "#f58b28" : " #6c63ff"
	}`;
}

function makeElement(
	el = "div",
	attrClass,
	content = "this is a element",
	fatherID
) {
	const element = document.createElement(el);
	element.setAttribute("class", attrClass);
	element.innerHTML = content;
	fatherID ? document.querySelector(fatherID).appendChild(element) : "";
	return element;
}

function toggleElement(element, toggleClass) {
	element.classList.toggle(toggleClass);
}

function setCssProperties(el, styles) {
	for (var property in styles) el.style[property] = styles[property];
}
