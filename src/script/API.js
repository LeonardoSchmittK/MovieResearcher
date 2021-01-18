const App = (function () {
	const searchButton = document.querySelector(".header__search-button");
	const card = document.querySelector(".banner__card");
	const movieInput = document.querySelector("#search-movie");
	const titles = [];
	searchButton.onclick = searchMovie;

	document.body.onkeypress = (event) => {
		if (event.keyCode === 13) searchMovie();
	};

	function searchMovie() {
		applyAPI(movieInput.value);
	}

	function applyAPI(movie) {
		const apikey = "a1dd21cb";

		fetch(`http://www.omdbapi.com/?apikey=${apikey}&t=${movie}`)
			.then((data) => data.json())
			.then((data) => {
				titles.push(data.Title);
				checkMovie(data);
			})
			.catch((err) => handleError(err));
	}

	function handleError(err = "Movie not found") {
		var count = 0;
		let setError = setInterval(function () {
			movieInput.value = "Not found";
			count++;
			console.log(count);

			if (count === 2) {
				clearTimeout(setError);
				executeInputInitialBehavior();
			}
		}, 1000);
	}
	function checkMovie(movie) {
		if (movie.Error === "Movie not found!") return handleError();
		else return printMovieCard(movie);
	}
	function printMovieCard(movie) {
		card.classList.add("banner__movie-found");
		deleteSvgImage(movie);
	}

	function deleteSvgImage(movie) {
		window.document.querySelector(".banner__image").style.display = "none";
		printMovieInfo(movie);
	}

	function printMovieInfo(movie) {
		const {
			Title,
			Plot,
			Director,
			Year,
			Runtime,
			imdbRating,
			Genre,
			Writer,
			Poster,
		} = movie;
		// if (movieInput.value === Title) alert("ola");
		const newTitles = [...new Set(titles)];
		if (JSON.stringify(newTitles) !== JSON.stringify(titles)) {
			titles.pop();
			return handleError();
		} else {
			const markup = `<h1 title='${Title}'>${Title}</h1>
	<p><mark>About:</mark>${Plot}</p>
	<p><mark>${
		Director !== "N/A" ? "Director" : "Writers"
	}</mark>${checkDirectorExistence(Director, Writer)}</p>
	<p><mark>Release:</mark>${Year}</p>
	<p style='color:${rankRating(imdbRating)}'><mark>IMDb:</mark>${imdbRating}</p>
	<p><mark>Runtime:</mark>${Runtime}</p>
	<img style="display:${validatePosterSrc(
		Poster
	)}" id='movie-img' class='banner__movie-img' src=${Poster} alt=${Title}-poster/>
<span><i class='fas fa-times'></i></span>
		`;

			const content = makeElement("li", "banner__content", markup);

			content.style.height = calcCardHeight(Title);
			card.style.cssText = "width:inherit;margin-left:-30px;";

			card.appendChild(content);

			// sortCards(content);
			executeInputInitialBehavior();
		}
	}

	function validatePosterSrc(src) {
		return src === "N/A" ? "none" : "block";
	}

	function rankRating(rating) {
		if (rating < 6.0) return "#FF0000";
		else if (rating > 8.7) return "#b29600";
		else return "#008000";
	}

	function checkDirectorExistence(director, writer) {
		return director === "N/A" ? writer : director;
	}

	function calcCardHeight(title) {
		if (title.length > 43) return "570px";
		else if (title.length > 26) return "480px";
		else return "370px";
	}

	function executeInputInitialBehavior() {
		movieInput.value = "";
		movieInput.focus();
	}

	function makeElement(el = "div", attrClass, content = "This is a element") {
		const element = document.createElement(el);
		element.setAttribute("class", attrClass);
		element.innerHTML = content;
		return element;
	}
	// function sortCards(cards) {
	// 	const movies = [
	// 		...window.document.getElementsByClassName("banner__content"),
	// 	].reverse();
	// 	movies.map((item) => {
	// 		card.appendChild(item);
	// 	});

	// 	movies.map((item) => {
	// 		movies.filter((a) => {
	// 			console.log(item);
	// 		});
	// 	});
	// 	console.log(movies);
	// }
	// sortCards();
})();
