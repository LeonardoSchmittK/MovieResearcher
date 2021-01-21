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
		fetch(`http://www.omdbapi.com/?apikey=${apikey}&t=${movie}`)
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
	<p style='color:${checkExistence(Plot)};' ><mark>About:</mark>${Plot}</p>
	<p style='color:${checkExistence(Plot)};'><mark>${checkDirectorLabel(Director)}
	</mark>${checkDirectorExistence(Director, Writer)}</p>
	<p style='color:${checkExistence(Year)};'><mark>Release:</mark>${Year}</p>
	<p style='color:${rankRating(imdbRating)};'><mark>IMDb:</mark>${imdbRating}</p>
	<p  style='color:${checkExistence(
		Runtime
	)};'><mark>Runtime:</mark>${Runtime}</p>
	<div class='banner__card-icons'>

			   <i onclick='document.querySelector(".icons-content").innerHTML="${Awards}"' title='${Awards}'  style='display:${checkCardIconVisibility(
			Awards
		)};' class="card-icon fas fa-trophy"></i>

		<i onclick='document.querySelector(".icons-content").innerHTML="${Production}"'  title='${Production}'	style='display:${checkCardIconVisibility(
			Production
		)};'  class="card-icon fas fa-film"></i> 

	  	<i onclick='document.querySelector(".icons-content").innerHTML="${Actors}"'  title='${Actors}' style='display:${checkCardIconVisibility(
			Actors
		)};'  class=" card-icon fas fa-users"></i>  


				  	<i onclick='document.querySelector(".icons-content").innerHTML="${BoxOffice}"'  title='${BoxOffice}' style='display:${checkCardIconVisibility(
			BoxOffice
		)};'  class="card-icon fas fa-dollar-sign"></i>  

	</div>
<div class='icons-content-container'>
						<p class='icons-content'>${Awards}</p>
	</div>
		
		<figure  style='display:${validatePosterSrc(Poster)};' id='movie-img'/>
		<img   class='banner__movie-img' src='${Poster}' alt='${Title}-poster'/>
  <figcaption><i  class='remove-poster-icon fas fa-times'></i><i class="increase-poster-icon fas fa-chart-line"></i></figcaption>
</figure> 
	
		`;
	}

	function increasePoster(item, movie) {
		const poster = item.childNodes[item.childNodes.length - 2];

		const increasePosterIcon =
			item.childNodes[item.childNodes.length - 2].childNodes[3].childNodes[1];

		let x = (increasePosterIcon.onclick = () => {
			poster.classList.add("zoomed-poster");
			increasePosterIcon.style.transform = "rotate(180deg)";
			poster.style.height = calcCardHeight(movie);

			increasePosterIcon.onclick = () => {
				poster.classList.remove("zoomed-poster");
				poster.style.height = "230px";

				increasePosterIcon.style.transform = "rotate(0deg)";

				increasePosterIcon.onclick = () => x();
			};
		});
		// window.document.querySelector(".banner__movie-img").onclick = () => {
		// 	window.document.querySelector("figure").classList.add("zoomed-poster");
		// };
	}

	function checkExistence(info) {
		if (info === "N/A") return "#A9A9A9";
	}

	function removePoster(item) {
		const poster = item.childNodes[item.childNodes.length - 2];
		const removePosterIcon =
			item.childNodes[item.childNodes.length - 2].childNodes[3].childNodes[0];
		removePosterIcon.onclick = () => {
			poster.classList.remove("zoomed-poster");
			console.log((item.childNodes[17].childNodes[1].style.width = "80%"));
			poster.style.animation = "removePoster 1s ease-in-out forwards";
		};
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
		if (Title.length > 43) return "730px";
		else if (Title.length > 26) return "540px";
		else return "450px";
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
