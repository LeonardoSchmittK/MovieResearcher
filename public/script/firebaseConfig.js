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

const executeToggle = (authToggle.onclick = () => {
	toggleForm(false);
	authToggle.onclick = () => {
		toggleForm(true);
		authToggle.onclick = () => executeToggle();
	};
});

const executeAuthToggle = (toggleAuth.onclick = () => {
	toggleForm(true);
	toggleAuth.onclick = () => {
		toggleForm(false);
		toggleAuth.onclick = () => executeAuthToggle();
	};
});

authToggleUserIcon.onclick = () => {
	auth.style.display = "block";
};

const toggleUserImg = (userImg.onclick = () => {
	username.style.display = "none";
	userInfo.style.border = "none";
	auth.style.width = "80px";

	userImg.onclick = () => {
		username.style.display = "block";
		auth.style.width = "250px";

		userImg.onclick = () => toggleUserImg();
	};
});

btnRegister.onclick = (e) => {
	preventFormDefaultBehavior(e);

	firebase
		.auth()
		.createUserWithEmailAndPassword(emailInput.value, passwordInput.value)
		.then((res) => {
			checkNewUser(res);
			toggleForm(false);
			printProfile(true);
			printUsername(res);
		})
		.catch((err) => {
			handleAuthError(err, true);
		});
};

btnLogin.onclick = (e) => {
	preventFormDefaultBehavior(e);
	firebase
		.auth()
		.signInWithEmailAndPassword(emailInput.value, passwordInput.value)
		.then((res) => {
			printProfile(true);
			printUsername(res);
		})
		.catch((err) => {
			handleAuthError(err, true);
		});
};
btnLogout.onclick = (e) => {
	preventFormDefaultBehavior(e);
	logout();
};

function logout() {
	firebase
		.auth()
		.signOut()
		.then(
			() => {
				toggleForm(true);
				printProfile(false);
				cleanAuthFields();
			},
			(err) => {
				handleAuthError(err, true);
			}
		);
}

btnGoogleAuth.onclick = () => {
	const provider = new firebase.auth.GoogleAuthProvider();
	signIn(provider);
};

function signIn(provider) {
	firebase
		.auth()
		.signInWithPopup(provider)
		.then((res) => {
			checkNewUser(res);
			printUsername(res);
		})
		.catch((err) => {
			handleAuthError(err, false);
		});
}

firebase.auth().onAuthStateChanged(function (user) {
	if (user) {
		toggleForm(false);
		printProfile(true);
		printUsername(user);
		verifyUserPhoto(user);

		header.onclick = () => {
			auth.style.animation = "";
			showPopup(false, "", "");
		};
		inputMovie.oninput = () => (inputMovie.value = inputMovie.value);
	} else {
		header.onclick = () => {
			showPopup(
				true,
				"Please login on the app to actually use it. Thanks!",
				"Notice"
			);
			auth.style.animation = "bounce-login 0.2s linear alternate";
		};
		inputMovie.onclick = () =>
			(auth.style.animation = "bounce-login 0.2s linear alternate");
		inputMovie.oninput = () => (inputMovie.value = "");

		toggleForm(true);
		handleAuthError("Error", false);
	}
});

function printProfile(isPrinted) {
	perfilLogged.style.display = !isPrinted ? "none" : "flex";
	toggleAuth.style.display = isPrinted ? "none" : "flex";
	auth.style.width = "200px";
	authToggle.style.display = isPrinted ? "none" : "";
}

function cleanAuthFields() {
	emailInput.value = "";
	passwordInput.value = "";
}

function toggleForm(isToggled) {
	form.classList.toggle("toggleFormDown", isToggled);
	authTitle.style.display = "block";
	toggleAuth.style.display = isToggled ? "none" : "flex";
	auth.style.width = isToggled ? "200px" : "120px";
}

function printUsername(user) {
	if (user.displayName)
		username.textContent = user.displayName.split(" ").splice(0, 2).join(" ");
	else username.textContent = user.email.split("@")[0];
}

function verifyUserPhoto({ photoURL }) {
	if (photoURL) userImg.src = photoURL;
}

function preventFormDefaultBehavior(e) {
	e.preventDefault();
}

function handleAuthError(
	err = "There was an Error, we are as soon as possible solving...",
	isPrinted
) {
	errorMessage.innerHTML = `<i class="fas fa-exclamation-triangle"></i> ${err.message}`;
	errorMessage.classList.toggle("printError", isPrinted);
}

popupCloseIcon.onclick = () => {
	showPopup(false, "", "");
};

function checkNewUser(user) {
	if (user.additionalUserInfo.isNewUser === true) {
		showPopup(
			true,
			"Welcome to Movie-Researcher, you can start your search by typing in the search box... seize!",
			"At ease!"
		);
		popup.classList.toggle("salute");
	}
}
