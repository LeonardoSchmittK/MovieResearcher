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
		backSpeed: 10,
		attr: "placeholder",
		bindInputFocusEvents: true,
		loop: true,
	});
});
