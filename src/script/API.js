const apikey = "a1dd21cb";
const searchButton = document.querySelector(".header__search-button");
const card = document.querySelector(".banner__card");
const movieInput = document.querySelector("#search-movie");

searchButton.onclick = searchMovie;

document.body.onkeypress = (e) => {
	if (e.keyCode === 13) searchMovie();
};

function searchMovie() {
	applyAPI(movieInput.value);
}

function applyAPI(movie) {
	fetch(`http://www.omdbapi.com/?apikey=${apikey}&t=${movie}`)
		.then((data) => data.json())
		.then((data) => checkMovie(data))
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
			movieInput.value = "";
		}
	}, 1000);
}
function checkMovie(movie) {
	if (movie.Error === "Movie not found!") return handleError();
	else return printMovieCard(movie);
}
function printMovieCard(movie) {
	card.classList.add("banner__movie-found");
	deleteImage(movie);
}

function deleteImage(movie) {
	window.document.querySelector(".banner__image").style.display = "none";
	printMovieInfo(movie);
}

function printMovieInfo(movie) {
	const {
		Title,
		Plot,
		Director,
		Year,
		imdbRating,
		Genre,
		Writer,
		Poster,
	} = movie;
	const movieInfo = [Title, Plot, Director, Year, imdbRating, Genre];
	const movieInfoClasses = [
		"Title",
		"Plot",
		"Director",
		"Year",
		"imdbRating",
		"Genre",
	];
	// const y = movieInfoClasses.map((info, i) => {
	// 	movieInfo.map((infoMovie, index) => {
	// 		// console.log(`${movieInfoClasses[i]}------------${movieInfo[i]}`);

	// 		window.document.querySelector(`.movie-${movieInfoClasses[i]}`).innerHTML =
	// 			movieInfo[i];
	// 	});
	// });
	// const movieContent = window.document.querySelector(".banner__content");
	// movieContent.style.display = "block";

	const content = document.createElement("li");
	content.setAttribute("class", "banner__content");
	const markup = `<h1 title='${Title}'>${Title}</h1>
	<p><mark>About:</mark>${Plot}</p>
	<p><mark>${Director !== "N/A" ? "Director" : "Writers"}</mark>${
		Director !== "N/A" ? Director : Writer
	}</p>
	<p><mark>Release:</mark>${Year}</p>
	<p style='color:${
		imdbRating > 8.7 ? "#DAA520" : imdbRating <= 5 ? "red" : "green"
	}'><mark>IMDb:</mark>${imdbRating}</p>
	<img style="display:${
		Poster === "N/A" ? "none" : "block"
	}" id='movie-img' class='banner__movie-img' src=${Poster} alt=${Title}-poster/>
<span><i class='fas fa-times'></i></span>
		`;

	content.innerHTML = markup;
	content.style.height =
		Title.length >= 42 ? "570px" : Title.length > 26 ? "450px" : "370px";
	card.style.width = "inherit";
	card.style.marginLeft = "-30px";
	card.appendChild(content);
	movieInput.value = "";
	movieInput.focus();
}

// function executeMovie(data) {
// 	document.querySelector("#movie-poster").src = data.Poster;
// 	document.querySelector("h1").textContent = data.Title;
// 	document.querySelector("h2").textContent = data.imdbRating;
// }

// String.prototype.capitalize = function () {
// 	const movie = this.split(/\s+/);
// 	const x = movie.map((item, key) => {
// 		return [...item];
// 	});
// 	const res = x.map((item, key) => {
// 		const cut = item.slice(1);
// 		const res = item[0].toUpperCase();
// 		const res2 = res + cut.join("");
// 		return res2;
// 	});
// 	return res.join("-");
// };

// const API_KEY = "bc2b82a37c132259573b89350a001724";
// const API_BASE = "https://api.themoviedb.org/3";
// const basicFetch = async (endpoint) => {
// 	const req = await fetch(`${API_BASE}${endpoint}`);
// 	const json = await req.json();
// 	return json;
// };

// const res = await basicFetch(
// 	`/discover/tv?with_network=213&language=pt-BR&_api_key=${API_KEY}`
// );
// fetch(
// 	`${API_BASE}/discover/tv?with_network=213&language=pt-BR&api_key=${API_KEY}`
// )
// 	.then((data) => data.json())
// 	.then((data) => console.log(data.results[22].name))
// 	.catch((err) => console.log(err));
