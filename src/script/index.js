const banner = window.document.getElementById("screens");

// (function animateScreens() {
// 	let scr = 1;
// 	let amount = Math.floor(Math.random() * 10) + 1;
// 	for (scr; scr <= amount; ++scr) {
// 		let screen = window.document.createElement("div");
// 		screen.style.width = `${Math.floor(Math.random() * 400) + 200}px`;
// 		screen.setAttribute("class", `banner__screen-${scr} screen`);
// 		screen.style.top = `${Math.floor(Math.random() * 500) + 10}px`;
// 		screen.style.left = `${Math.floor(Math.random() * -350) - 50}px`;
// 		screen.style.animation = `cross-window ${
// 			Math.floor(Math.random() * 50) + 2
// 		}s linear alternate infinite`;
// 		banner.appendChild(screen);
// 	}
// })();

// (function animateScreens() {
// 	let scr = 1;
// 	let amount = Math.floor(Math.random() * 10) + 1;
// 	for (scr; scr <= amount; ++scr) {
// 		let screen = window.document.createElement("div");
// 		screen.style.width = `${Math.floor(Math.random() * 400) + 200}px`;
// 		screen.setAttribute("class", `banner__screen-${scr} screen`);
// 		screen.style.top = `${Math.floor(Math.random() * 500) + 10}px`;
// 		screen.style.left = `${Math.floor(Math.random() * 350) - 50}px`;
// 		screen.style.animation = `cross-window ${
// 			Math.floor(Math.random() * 50) + 2
// 		}s linear alternate infinite`;
// 		banner.appendChild(screen);
// 	}
// })();

(function animateScreens() {
	let scr = 1;
	let amount = Math.floor(Math.random() * 10) + 5;
	const animationTime = Math.floor(Math.random() * 2) + 0.5;
	for (scr; scr <= amount; ++scr) {
		var screen = window.document.createElement("div");
		screen.style.width = `${Math.floor(Math.random() * 400) + 200}px`;
		screen.setAttribute("class", `banner__screen-${scr} screen`);
		screen.style.top = `${Math.floor(Math.random() * 500) + 10}px`;
		screen.style.left = `${Math.floor(Math.random() * 1500) - 10}px`;
		screen.style.animation = `cross-window ${animationTime}s  forwards`;
		banner.appendChild(screen);
	}
})();
