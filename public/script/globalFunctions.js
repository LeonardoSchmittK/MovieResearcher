function showPopup(
   isToggle,
   msg = "Occurred an error, and we are as soon as possible solving the problem...",
   title = "Warning",
   type = "Warning"
) {
   popup.style.display = isToggle ? "block" : "none";
   popupTitle.innerHTML = title;
   popupDescription.innerHTML = msg;
   popup.style.borderBottom = `3px solid ${type === "Warning" ? "#f58b28" : " #6c63ff"}`;
}

function makeElement(el = "div", attrClass, content = "this is a element", fatherID) {
   const element = document.createElement(el);
   element.setAttribute("class", attrClass);
   element.innerHTML = content;
   fatherID ? document.querySelector(fatherID).appendChild(element) : "";

   return element;
}

const toggleElement = (element, toggleClass) => element.classList.toggle(toggleClass);

function setCssProperties(el, styles) {
   for (var property in styles) el.style[property] = styles[property];
}

function handleError(err = "Fixing it...") {
   showPopup(true, err, "Oops", "Warning");
   executeInputInitialBehavior();
}

function executeInputInitialBehavior() {
   movieInput.value = "";
   movieInput.focus();
}

const tossArrItem = (arr) => Math.floor(Math.random() * arr.length);

const { log } = console;
