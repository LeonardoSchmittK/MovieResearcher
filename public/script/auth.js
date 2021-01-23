const btnLogin = window.document.querySelector(".btnLogin");
const btnRegister = window.document.querySelector(".btnRegister");

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
