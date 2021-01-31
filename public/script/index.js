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

// const samplePosters = [
// 	"https://m.media-amazon.com/images/M/MV5BNDYxNjQyMjAtNTdiOS00NGYwLWFmNTAtNThmYjU5ZGI2YTI1XkEyXkFqcGdeQXVyMTMxODk2OTU@._V1_SX300.jpg",
// 	"https://m.media-amazon.com/images/M/MV5BZmE0MGJhNmYtOWNjYi00Njc5LWE2YjEtMWMxZTVmODUwMmMxXkEyXkFqcGdeQXVyMTkxNjUyNQ@@._V1_SX300.jpg",
// 	"https://m.media-amazon.com/images/M/MV5BMjM2MDgxMDg0Nl5BMl5BanBnXkFtZTgwNTM2OTM5NDE@._V1_SX300.jpg",
// 	"https://m.media-amazon.com/images/M/MV5BMDU2ZWJlMjktMTRhMy00ZTA5LWEzNDgtYmNmZTEwZTViZWJkXkEyXkFqcGdeQXVyNDQ2OTk4MzI@._V1_SX300.jpg",
// 	"https://m.media-amazon.com/images/M/MV5BMTMxNTMwODM0NF5BMl5BanBnXkFtZTcwODAyMTk2Mw@@._V1_SX300.jpg",
// 	"https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
// 	"https://m.media-amazon.com/images/M/MV5BMjExMTg5OTU0NF5BMl5BanBnXkFtZTcwMjMxMzMzMw@@._V1_SX300.jpg",
// 	"https://m.media-amazon.com/images/M/MV5BNzM3NDFhYTAtYmU5Mi00NGRmLTljYjgtMDkyODQ4MjNkMGY2XkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_SX300.jpg",
// 	"https://m.media-amazon.com/images/M/MV5BMTU2MDY3MzAzMl5BMl5BanBnXkFtZTcwMTg0NjM5NA@@._V1_SX300.jpg",
// 	"https://m.media-amazon.com/images/M/MV5BNjU1YjM2YzAtZWE2Ny00ZWNiLWFkZWItMDJhMzJiNDQwMmI4XkEyXkFqcGdeQXVyNTU1MjgyMjk@._V1_SX300.jpg",
// 	"https://m.media-amazon.com/images/M/MV5BNDVkYjU0MzctMWRmZi00NTkxLTgwZWEtOWVhYjZlYjllYmU4XkEyXkFqcGdeQXVyNTA4NzY1MzY@._V1_SX300.jpg",
// 	"https://m.media-amazon.com/images/M/MV5BMjE0NTA2MTEwOV5BMl5BanBnXkFtZTgwNzg4NzU2NjE@._V1_SX300.jpg",
// 	"https://m.media-amazon.com/images/M/MV5BMjUxMDQwNjcyNl5BMl5BanBnXkFtZTgwNzcwMzc0MTI@._V1_SX300.jpg",
// 	"https://m.media-amazon.com/images/M/MV5BMzY2ODk4NmUtOTVmNi00ZTdkLTlmOWYtMmE2OWVhNTU2OTVkXkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_SX300.jpg",
// 	"https://m.media-amazon.com/images/M/MV5BN2EyZjM3NzUtNWUzMi00MTgxLWI0NTctMzY4M2VlOTdjZWRiXkEyXkFqcGdeQXVyNDUzOTQ5MjY@._V1_SX300.jpg",
// 	"https://m.media-amazon.com/images/M/MV5BMmYxZWY2NzgtYzJjZC00MDFmLTgxZTctMjRiYjdjY2FhODg3XkEyXkFqcGdeQXVyNjk1Njg5NTA@._V1_SX300.jpg",
// ];

// function randomArrayShuffle(array) {
// 	var currentIndex = array.length,
// 		temporaryValue,
// 		randomIndex;
// 	while (0 !== currentIndex) {
// 		randomIndex = Math.floor(Math.random() * currentIndex);
// 		currentIndex -= 1;
// 		temporaryValue = array[currentIndex];
// 		array[currentIndex] = array[randomIndex];
// 		array[randomIndex] = temporaryValue;
// 	}
// 	return array;
// }

// const shuffleSamplePosters = randomArrayShuffle(samplePosters);
const banner = window.document.getElementById("screens");

(function animateScreens() {
	let scr = 1;
	let count = 0;
	let amount = Math.floor(Math.random() * 10) + 0;
	const animationTime = Math.floor(Math.random() * 2) + 0.5;
	for (scr; scr <= amount; ++scr) {
		var screen = window.document.createElement("div");
		screen.style.width = `${Math.floor(Math.random() * 400) + 200}px`;
		screen.setAttribute("class", `banner__screen-${scr} screen`);
		screen.style.top = `${Math.floor(Math.random() * 500) + 10}px`;
		screen.style.left = `${Math.floor(Math.random() * 1500) - 10}px`;

		// screen.style.animation = `cross-window ${animationTime}s alternate infinite ,opacityToggle 2s forwards`;

		count = count + 1;
		banner.appendChild(screen);
		screen.style.opacity = "0.4";

		banner.onmousemove = (event) => {
			let coordX = event.clientX;
			let coordY = event.clientY;
			// console.log(coordX);
			[...document.getElementsByClassName("screen")].map((item) => {
				item.style.transition = "all linear 2s ";
				item.style.opacity = "0.2";
				item.style.transform = `translateX(${Math.floor(coordX) / 3}px)`;
			});
		};
	}
})();

const eyeInner = window.document.querySelector(".popup__eye__inner");
const eyeOuter = window.document.querySelector(".popup__eye__outer");

document.onmousemove = (e) => {
	const coordX = e.clientX;
	const coordY = e.clientY;

	eyeOuter.style.display = "flex";

	eyeInner.style.transform = `translateX(${coordX / 200}px) translateY(${
		coordY / 100
	}px)`;
};
