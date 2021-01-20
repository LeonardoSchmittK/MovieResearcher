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
				checkMovie(data);
			})
			.catch((err) => handleError(err));
	}

	function handleError(err) {
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
		if (movie.Error === "Movie not found!")
			return handleError("Movie not found!");
		else {
			titles.push(movie.Title);
			return printMovieCard(movie);
		}
	}
	function printMovieCard(movie) {
		card.classList.add("banner__movie-found");
		deleteSvgImage(movie);
	}

	function deleteSvgImage(movie) {
		window.document.querySelector(".banner__image").style.display = "none";
		printMovieInfo(movie);
	}
	const cards = [];
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
			Awards,
			Production,
			Actors,
			BoxOffice,
			Poster,
		} = movie;
		const newTitles = [...new Set(titles)];
		if (JSON.stringify(newTitles) !== JSON.stringify(titles)) {
			titles.pop();
			return handleError("You've already searched...");
		} else {
			const markup = `
			<span><i  class="remove-card-icon fas fa-times"></i> </span>
			<h1 title='${Title}'>${Title}</h1>
	<p><mark>About:</mark>${Plot}</p>
	<p><mark>${checkDirectorLabel(Director)}
	</mark>${checkDirectorExistence(Director, Writer)}</p>
	<p><mark>Release:</mark>${Year}</p>
	<p style='color:${rankRating(imdbRating)}'><mark>IMDb:</mark>${imdbRating}</p>
	<p><mark>Runtime:</mark>${Runtime}</p>
	<div class='banner__card-icons'>

			   <i title='${Awards}'  style='display:${checkCardIconVisibility(
				Awards
			)};' class="card-icon fas fa-trophy"></i>

		<i  title='${Production}'	style='display:${checkCardIconVisibility(
				Production
			)};'  class="card-icon fas fa-film"></i> 

	  	<i title='${Actors}' style='display:${checkCardIconVisibility(
				Actors
			)};'  class=" card-icon fas fa-users"></i>  


				  	<i title='${BoxOffice}' style='display:${checkCardIconVisibility(
				BoxOffice
			)};'  class="card-icon fas fa-dollar-sign"></i>  

	</div>

		
		<figure ondblClick='this.style.animation="removePoster 1s ease-in-out forwards";' style='display:${validatePosterSrc(
			Poster
		)};' id='movie-img'/>
		<img   class='banner__movie-img' src='${Poster}' alt='${Title}-poster'/>
  <figcaption><i  class='remove-poster-icon fas fa-times'></i></figcaption>
</figure> 
	
		`;

			const content = makeElement("li", "banner__content", markup);

			content.style.height = calcCardHeight(Title);
			card.style.cssText = "width:inherit;margin-left:-30px;";
			cards.push(content);
			cards.reverse();
			cards.map((item) => {
				card.appendChild(item);

				item.childNodes[
					item.childNodes.length - 2
				].childNodes[3].childNodes[0].onclick = () => {
					item.childNodes[item.childNodes.length - 2].style.animation =
						"removePoster 1s ease-in-out forwards";
				};

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

	// function increasePoster() {
	// 	window.document.querySelector(".banner__movie-img").onclick = () => {
	// 		window.document.querySelector("figure").classList.add("zoomed-poster");
	// 	};
	// }

	function removePoster(poster) {
		console.log(poster);
		window.document.querySelector(".remove-poster-icon").onclick = () => {
			window.document.querySelector("figure").style.animation =
				"removePoster 1s ease-in-out forwards";
		};

		console.log("DEU CERTO!");
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

	function calcCardHeight(title) {
		if (title.length > 43) return "580px";
		else if (title.length > 26) return "480px";
		else return "400px";
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
