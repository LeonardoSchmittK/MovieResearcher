// const el = window.document.querySelector(".header__search-movie");
// var typed = new Typed(
// 	'window.document.querySelector(".header__search-movie")',
// 	{
// 		strings: [
// 			"The Avengers",
// 			"Toy Story",
// 			"Friends",
// 			"Titanic",
// 			"The Dark Knight",
// 			"Avatar",
// 			"Once Upon a Time in Hollywood ",
// 		],
// 		typeSpeed: 50,
// 		backSpeed: 50,
// 	}
// );

const type = document.addEventListener("DOMContentLoaded", function () {
	new Typed("#search-movie", {
		strings: [
			"The Avengers",
			"Mulan",
			"The Dark Knight",
			"Spider-Man 2",
			"Jurassic Park ",
			"Tenet",
			"Lighthouse",
			"The Wolf of Wall Street",
			"Friends",
			"The Office",
			"The Witcher",
			"Toy Story",
			"Kill: Bill",
			"Split",
		],
		typeSpeed: 120,
		backSpeed: 200,
		attr: "placeholder",
		bindInputFocusEvents: true,
		loop: true,
	});
});
