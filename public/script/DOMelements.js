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

function showPopup(
	isToggle,
	msg = "Occurred an error, and we are as soon as possible solving the problem...",
	title = "Warning",
	type = "warning"
) {
	popup.style.display = isToggle ? "block" : "none";
	popupTitle.innerHTML = title;
	popupDescription.innerHTML = msg;
	popup.style.borderBottom = `3px solid ${
		type === "Warning" ? "orange" : "purple"
	}`;
}
