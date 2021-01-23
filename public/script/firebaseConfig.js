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

const form = window.document.querySelector("form");

btnRegister.onclick = (e) => {
	e.preventDefault();

	firebase
		.auth()
		.createUserWithEmailAndPassword(emailInput.value, passwordInput.value)
		.then((result) => {
			alert(`Welcome, ${emailInput.value}`);
			console.log(result);
		})
		.catch((err) => {
			console.log(err);
		});
};

btnLogin.onclick = (e) => {
	e.preventDefault();
	firebase
		.auth()
		.signInWithEmailAndPassword(emailInput.value, passwordInput.value)
		.then((result) => {
			console.log(result);
			document.writeln("welcome" + emailInput.value);
		})
		.catch((err) => {
			console.log(err.code);
			console.log(err.message);
			alert("Went through an error");
		});
};
btnLogout.onclick = (e) => {
	e.preventDefault();

	firebase
		.auth()
		.signOut()
		.then(
			() => {
				document.writeln("n autenticado");
			},
			function (err) {
				console.log(err);
			}
		);
};
