const apikey = "a1dd21cb";
const inputVal = document.querySelector(".header__search-movie");
const searchButton = document.querySelector(".header__search-button");
searchButton.onclick = searchMovie;

function searchMovie() {
	const movie = inputVal.value;
	fetch(`http://www.omdbapi.com/?apikey=${apikey}&t=${movie}`)
		.then((data) => data.json())
		.then((data) => console.log(data))
		.catch((err) => console.log(err));
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
