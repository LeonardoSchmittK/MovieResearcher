const apikey = "a1dd21cb";
const searchButton = document.querySelector(".header__search-button");
const card = document.querySelector(".banner__card");

searchButton.onclick = searchMovie;

function searchMovie() {
	const movieInput = document.querySelector("#search-movie");
	applyAPI(movieInput.value);
}

function applyAPI(movie) {
	fetch(`http://www.omdbapi.com/?apikey=${apikey}&t=${movie}`)
		.then((data) => data.json())
		.then((data) => checkMovie(data))
		.catch((err) => handleError(err));
}

function handleError(err = "Movie not found") {
	printMovieCard(false);
}
function checkMovie(movie) {
	if (movie.Error === "Movie not found!") return handleError();
	else {
		return printMovieCard(movie);
	}
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
		Poster,
		Year,
		Genre,
		Director,
		Runtime,
		imdbRating,
		Released,
	} = movie;
	const content = document.createElement("div");
	const markup = `<h1>${Title}</h1>
 <p><mark>About:</mark>${Plot}</p>
 <p><mark>Director</mark>${Director}</p>
 <p><mark>Release:</mark>${Released}</p>
	<p><mark>IMDb:</mark>${imdbRating}</p>
	<img src=${Poster} alt=${Title}/>

	`;
	content.innerHTML = markup;
	card.appendChild(content);
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
