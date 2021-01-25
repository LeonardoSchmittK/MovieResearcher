const firebaseConfig = {
	apiKey: "AIzaSyDlU_-zDAwF5iUHi_kALSzaNau6irMdIBM",
	authDomain: "movie-researcher.firebaseapp.com",
	databaseURL: "https://movie-researcher-default-rtdb.firebaseio.com",
	projectId: "movie-researcher",
	storageBucket: "movie-researcher.appspot.com",
	messagingSenderId: "232594490220",
	appId: "1:232594490220:web:1434682a397c3e8727e949",
};
firebase.initializeApp(firebaseConfig);

const btnLogin = window.document.querySelector(".btnLogin");
const btnRegister = window.document.querySelector(".btnRegister");
const btnLogout = window.document.querySelector(".btnLogout");
const passwordInput = window.document.querySelector("#passwordInput");
const emailInput = window.document.querySelector("#emailInput");
const perfilLogged = window.document.querySelector(".auth__perfil");
const form = window.document.querySelector(".auth__form");
const username = window.document.querySelector(".auth__username");
const errorMessage = window.document.querySelector(".auth__error");

btnRegister.onclick = (e) => {
	e.preventDefault();

	firebase
		.auth()
		.createUserWithEmailAndPassword(emailInput.value, passwordInput.value)
		.then((result) => {
			form.style.display = "none";
			perfilLogged.style.display = "flex";
		})
		.catch((err) => {
			errorMessage.style.display = "block";
			errorMessage.innerHTML = `<i class="fas fa-exclamation-triangle"></i>${err.message}`;
		});
};

btnLogin.onclick = (e) => {
	e.preventDefault();
	firebase
		.auth()
		.signInWithEmailAndPassword(emailInput.value, passwordInput.value)
		.then((result) => {
			console.log(result);
			perfilLogged.style.display = "flex";
		})
		.catch((err) => {
			console.log(err.code);
			console.log(err.message);
			errorMessage.style.display = "block";

			errorMessage.innerHTML = `<i class="fas fa-exclamation-triangle"></i>${err.message}`;
		});
};
btnLogout.onclick = (e) => {
	e.preventDefault();

	firebase
		.auth()
		.signOut()
		.then(
			() => {
				form.style.display = "flex";
				perfilLogged.style.display = "none";
			},
			function (err) {
				console.log(err);
			}
		);
};
console.log("auth");

firebase.auth().onAuthStateChanged(function (user) {
	if (user) {
		form.style.display = "none";
		perfilLogged.style.display = "flex";
		username.textContent = user.email.split("@")[0];
		console.log(user);
	} else {
		form.style.display = "flex";
		errorMessage.style.display = "none";
	}
});
