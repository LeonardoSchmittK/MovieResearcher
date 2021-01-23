const App = (function () {
	const searchButton = document.querySelector(".header__search-button");
	const banner = document.querySelector(".banner__card");
	const movieInput = document.querySelector("#search-movie");
	const titles = [];
	const cards = [];

	searchButton.onclick = searchMovie;

	document.body.onkeypress = (event) => {
		if (event.keyCode === 13) searchMovie();
	};

	function searchMovie() {
		applyAPI(movieInput.value);
	}

	function applyAPI(movie) {
		// if (movie.length === 0) return handleError("Type in something");
		const apikey = "a1dd21cb";
		fetch(`http://www.omdbapi.com/?apikey=${apikey}&t=${movie}`, {
			method: "GET",
		})
			.then((data) => data.json())
			.then((data) => {
				checkMovie(data);
			})
			.catch((err) => handleError(err));
	}

	function handleError(err = "Occured and error") {
		var count = 0;
		let setError = setInterval(function () {
			movieInput.value = err;
			count++;
			console.log(count);

			if (count === 2) {
				clearTimeout(setError);
				executeInputInitialBehavior();
			}
		}, 1000);
	}
	function checkMovie(movie) {
		if (movie.Error === "Incorrect IMDb ID.")
			return handleError("Type in some series or movie");

		if (movie.Error === "Movie not found!")
			return handleError("Movie not found!");
		else {
			titles.push(movie.Title);
			return printMovieCard(movie);
		}
	}
	function printMovieCard(movie) {
		banner.classList.add("banner__movie-found");
		deleteSvgImage(movie);
	}

	function deleteSvgImage(movie) {
		window.document.querySelector(".banner__image").style.display = "none";
		printMovieInfo(movie);
	}
	function printMovieInfo(movie) {
		const newTitles = [...new Set(titles)];
		if (JSON.stringify(newTitles) !== JSON.stringify(titles)) {
			titles.pop();
			return handleError("You've already searched...");
		} else {
			const markup = cardContent(movie);
			const content = makeElement("li", "banner__content", markup);

			content.style.height = calcCardHeight(movie);
			banner.style.cssText = "width:inherit;margin-left:-30px;";
			cards.push(content);
			cards.reverse();
			cards.map((item) => {
				banner.appendChild(item);

				removePoster(item);
				increasePoster(item, movie);
				printCardIconsContent(item);
				printGenres(item);
				item.childNodes[1].childNodes[0].onclick = () => {
					item.style.display = "none";
					let i = cards.indexOf(item);
					console.log(i);
					removeIndex(i);
				};

				// removePoster(item);
				// increasePoster(item);
			});
			executeInputInitialBehavior();
		}
	}

	function validatePosterSrc(src) {
		return src === "N/A" ? "none" : "block";
	}

	function removeIndex(i) {
		cards.splice(i, 1);
	}

	function cardContent({
		Title,
		Plot,
		Director,
		Year,
		Runtime,
		imdbRating,
		Genre,
		Writer,
		Awards,
		Production,
		Actors,
		BoxOffice,
		Poster,
	}) {
		return `
			<span><i  class="remove-card-icon fas fa-times"></i> </span>
			<h1  title='${Title}'>${Title}</h1>
			<div class='genres-container'> 
      ${printGenresLabels(Genre)}
			</div>
	<p style='color:${checkExistence(Plot)};' ><mark>About:</mark>${Plot}</p>
	<p style='color:${checkExistence(
		Director,
		Writer
	)};'><mark>${checkDirectorLabel(Director)}
	</mark>${checkDirectorExistence(Director, Writer)}</p>
	<p style='color:${checkExistence(Year)};'><mark>Release:</mark>${Year}</p>
	<p style='color:${rankRating(imdbRating)};'><mark>IMDb:</mark>${imdbRating}</p>
	<p  style='color:${checkExistence(
		Runtime
	)};'><mark>Runtime:</mark>${Runtime}</p>
	<div class='banner__card-icons'>

			   <i  title='${Awards}'  style='display:${checkCardIconVisibility(
			Awards
		)};' class="card-icon fas fa-trophy"></i>

		<i   title='${Production}'	style='display:${checkCardIconVisibility(
			Production
		)};'  class="card-icon fas fa-film"></i> 

	  	<i   title='${Actors}' style='display:${checkCardIconVisibility(
			Actors
		)};'  class=" card-icon fas fa-users"></i>  


				  	<i   title='${BoxOffice}' style='display:${checkCardIconVisibility(
			BoxOffice
		)};'  class="card-icon fas fa-dollar-sign"></i>  

	</div>
<div style='display:none;' class='icons-content-container'>
						<p class='icons-content'></p>
	</div>

		<figure  style='display:${validatePosterSrc(Poster)};' id='movie-img'/>
		<img   class='banner__movie-img' src='${Poster}' alt='${Title}-poster'/>
  <figcaption><i  class='remove-poster-icon fas fa-times'></i><i class="increase-poster-icon fas fa-chart-line"></i></figcaption>
</figure> 
	
		`;
	}

	function increasePoster(item) {
		const poster = item.childNodes[item.childNodes.length - 2];
		const increasePosterIcon =
			item.childNodes[item.childNodes.length - 2].childNodes[3].childNodes[1];

		let x = (increasePosterIcon.onclick = () => {
			poster.classList.add("zoomed-poster");
			increasePosterIcon.style.transform = "rotate(180deg)";
			poster.style.height = item.style.height;

			increasePosterIcon.onclick = () => {
				poster.classList.remove("zoomed-poster");
				poster.style.height = "230px";

				increasePosterIcon.style.transform = "rotate(0deg)";

				increasePosterIcon.onclick = () => x();
			};
		});
	}

	function checkExistence(info, complement) {
		if (complement) {
			if (info === "N/A" && complement === "N/A") return "#A9A9A9";
		} else {
			if (info === "N/A") return "#A9A9A9";
		}
	}

	function removePoster(item) {
		const poster = item.childNodes[item.childNodes.length - 2];
		const removePosterIcon =
			item.childNodes[item.childNodes.length - 2].childNodes[3].childNodes[0];
		removePosterIcon.onclick = () => {
			poster.classList.remove("zoomed-poster");
			item.childNodes[19].childNodes[1].style.width = "80%";
			poster.style.animation = "removePoster 1s ease-in-out forwards";
			setTimeout(function () {
				poster.style.display = "none";
			}, 1200);
		};
	}

	function printCardIconsContent(item) {
		const iconsContainer = item.childNodes[17];
		const iconsContentContainer = item.childNodes[19];
		console.log(iconsContainer);
		console.log(iconsContentContainer);

		iconsContainer.onclick = () => {
			iconsContentContainer.style.display = "block";
		};
		iconsContainer.childNodes[1].onclick = () => {
			iconsContentContainer.childNodes[1].innerHTML =
				iconsContainer.childNodes[1].title;
		};
		iconsContainer.childNodes[3].onclick = () => {
			iconsContentContainer.childNodes[1].innerHTML =
				iconsContainer.childNodes[3].title;
		};

		iconsContainer.childNodes[5].onclick = () => {
			iconsContentContainer.childNodes[1].innerHTML =
				iconsContainer.childNodes[5].title;
		};
		iconsContainer.childNodes[7].onclick = () => {
			iconsContentContainer.childNodes[1].innerHTML =
				iconsContainer.childNodes[7].title;
		};
	}

	function printGenresLabels(genre) {
		const splitGenres = genre.split(",");
		const genres = [];
		const removeSpaces = splitGenres.map((genre, i) => {
			return genre.indexOf(" ") !== -1 ? `#${genre.slice(1)}` : `#${genre}`;
		});
		removeSpaces.map((genre) => {
			genres.push(`<span data-genre='${genre}' class='genres'>${genre}</span>`);
		});

		return genres.join(" ");
	}

	function printGenres(item) {
		const genresContainer = item.childNodes[5];
		let toggleGenres = (item.childNodes[3].onclick = () => {
			genresContainer.classList.add("toggle-genres");

			item.childNodes[3].onclick = () => {
				genresContainer.classList.remove("toggle-genres");

				item.childNodes[3].onclick = () => {
					toggleGenres();
				};
			};
		});
	}

	function rankRating(rating) {
		if (rating < 6.0) return "#FF0000";
		else if (rating > 8.7) return "#b29600";
		else if (rating > 6.0 && rating < 8.7) return "#008000";
		else return "#A9A9A9";
	}

	function checkDirectorExistence(director, writer) {
		return director === "N/A" ? writer : director;
	}

	function checkDirectorLabel(director) {
		return director === "N/A" ? "Writers:" : "Director:";
	}

	function calcCardHeight({ Title }) {
		if (Title.length > 43) return "750px";
		else if (Title.length > 26) return "580px";
		else return "480px";
	}

	function checkCardIconVisibility(value) {
		return value === undefined || value === "N/A" ? "none" : "block";
	}

	function executeInputInitialBehavior() {
		movieInput.value = "";
		movieInput.focus();
	}

	function makeElement(el = "div", attrClass, content = "this is a element") {
		const element = document.createElement(el);
		element.setAttribute("class", attrClass);
		element.innerHTML = content;
		return element;
	}
})();
