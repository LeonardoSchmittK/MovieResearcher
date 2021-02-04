(function createScreens() {
	let scrn = 1;
	const amount = tossNumber(10, 0);
	for (scrn; scrn <= amount; ++scrn) {
		const screen = makeElement(
			"div",
			`banner__screen-${scrn} screen`,
			" ",
			"#screens"
		);
		animateScreens(screen);
	}
})();

function animateScreens(screen) {
	const animationTime = tossNumber(2, 0.5);
	screen.style.width = `${tossNumber(400, 200)}px`;
	screen.style.top = `${tossNumber(500, 10)}px`;
	screen.style.left = `${tossNumber(1500, 10)}px`;
	screen.style.animation = `cross-window ${animationTime}s alternate infinite ,opacityToggle 2s forwards`;
	preventAnimateByMouse();
}

function tossNumber(max, min) {
	return Math.floor(Math.random() * (max - min)) + min;
}

function preventAnimateByMouse() {
	setTimeout(() => {
		animateByMouse();
	}, 2000);
}

function animateByMouse() {
	banner.onmousemove = (event) => {
		const coordX = event.clientX;
		[...document.getElementsByClassName("screen")].map((item) => {
			styleScreen(item, coordX);
		});
	};
}

function styleScreen(screen, coordX) {
	screen.style.animation = "wink 2s linear forwards";
	screen.style.transition = "all linear 10s ";
	screen.style.opacity = "0.2";
	screen.style.transform = `translateX(${Math.floor(coordX) / 3}px)`;
}

(function executeEyeAnimation() {
	document.onmousemove = (e) => {
		const [coordX, coordY] = [e.clientX, e.clientY];
		eyeOuter.style.display = "flex";
		eyeInner.style.transform = `translateX(${coordX / 200}px) translateY(${
			coordY / 100
		}px)`;
	};
})();
