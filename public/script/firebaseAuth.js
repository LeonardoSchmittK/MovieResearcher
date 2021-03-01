toggleAuth.onclick = () => handleAuthenticationUntoggled();
authToggle.onclick = () => handleAuthenticationUntoggled();

function handleAuthenticationUntoggled() {
   toggleForm(false);

   toggleAuth.onclick = () => {
      handleAuthenticationToggled();
   };
   authToggle.onclick = () => {
      handleAuthenticationToggled();
   };
}

function handleAuthenticationToggled() {
   toggleForm(true);
   toggleAuth.onclick = () => {
      handleAuthenticationUntoggled();
   };
   authToggle.onclick = () => {
      handleAuthenticationUntoggled();
   };
}

authToggleUserIcon.onclick = () => {
   authWrapper.style.display = "block";
};

const toggleUserImg = (userImg.onclick = () => {
   username.style.display = "none";
   userInfo.style.border = "none";
   authWrapper.style.width = "80px";

   userImg.onclick = () => {
      username.style.display = "block";
      authWrapper.style.width = username.style.width;

      userImg.onclick = () => toggleUserImg();
   };
});

firebase.auth().onAuthStateChanged((user) => {
   if (user) {
      setCssProperties(authWrapper, { height: "30px", overflow: "visible" });
      searchMovieButton.disabled = false;
   } else {
      setCssProperties(authWrapper, { height: "auto", overflow: "hidden" });
      searchMovieButton.disabled = true;
   }
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
      .catch((err) => handleAuthError(err, true));
};

btnLogout.onclick = (e) => {
   preventFormDefaultBehavior(e);
   logout();
};

function logout() {
   auth.signOut().then(
      () => {
         toggleForm(true);
         printProfile(false);
         cleanAuthFields();
         location.reload();
      },
      (err) => handleAuthError(err, true)
   );
}

btnGoogleAuth.onclick = () => {
   const provider = new firebase.auth.GoogleAuthProvider();
   signIn(provider);
};

function signIn(provider) {
   auth
      .signInWithPopup(provider)
      .then((res) => {
         checkNewUser(res);
         printUsername(res);
      })
      .catch((err) => {
         handleAuthError(err, false);
      });
}

auth.onAuthStateChanged((user) => {
   if (user) {
      toggleForm(false);
      printProfile(true);
      printUsername(user);
      verifyUserPhoto(user);

      header.onclick = () => (authWrapper.style.animation = "");
      movieInput.oninput = () => movieInput.value;
   } else {
      header.onclick = () => {
         showPopup(
            true,
            "Please login on the app to actually use it. Thanks!",
            "Notice",
            "Warning"
         );
         toggleElement(authWrapper, "auth__unlogged");
      };

      movieInput.oninput = () => (movieInput.value = "");

      toggleForm(true);
      handleAuthError("Error", false);
   }
});

function printProfile(isPrinted) {
   perfilLogged.style.display = !isPrinted ? "none" : "flex";
   toggleAuth.style.display = isPrinted ? "none" : "flex";
   authWrapper.style.width = username.style.width;
   authToggle.style.display = isPrinted ? "none" : "";
}

const cleanAuthFields = () => inputs.map((input) => (input.value = ""));
const printEmail = (user) => user.email.split("@")[0];
const printFirstName = (user) => user.displayName.split(" ")[0];

function toggleForm(isToggled) {
   form.classList.toggle("toggleFormDown", isToggled);
   authTitle.style.display = "block";
   toggleAuth.style.display = isToggled ? "none" : "flex";
   authWrapper.style.width = isToggled ? "200px" : "120px";
   authToggle.style.transform = isToggled ? "rotate(180deg)" : "rotate(360deg)";
}

function printUsername(user) {
   if (user.displayName) username.textContent = printFirstName(user);
   else username.textContent = printEmail(user);
}

function verifyUserPhoto({ photoURL }) {
   if (photoURL) userImg.src = photoURL;
}

const preventFormDefaultBehavior = (e) => e.preventDefault();

function handleAuthError(err = "Oops, there was an error", isPrinted) {
   errorMessage.innerHTML = `<i class="fas fa-exclamation-triangle"></i> ${err.message}`;
   errorMessage.classList.toggle("printError", isPrinted);
}

popupCloseIcon.onclick = () => showPopup(false, "", "");

function checkNewUser(user) {
   if (user.additionalUserInfo.isNewUser === true) {
      showPopup(
         true,
         "Welcome to Movie-Researcher, you can start your search by typing in the search box... seize!",
         "At ease!",
         "salute"
      );
   }
}
