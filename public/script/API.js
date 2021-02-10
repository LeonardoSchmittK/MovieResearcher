"use strict";
const App = (() => {
	const searchButton = document.querySelector(".header__search-button");
	const banner = document.querySelector(".banner__card");
	const movieInput = document.querySelector("#search-movie");
	const imageBg = document.querySelector("#banner__image");

	const [titles, cards] = [[], []];
	searchButton.onclick = () => searchMovie(movieInput.value);

	document.body.onkeypress = (event) => {
		if (event.keyCode === 13) searchMovie(movieInput.value);
	};

	function searchMovie(movieInput) {
		if (movieInput.indexOf("fav") != -1) {
			const movie = movieInput.split("fav")[0];
			applyAPI(movie, true);
			console.log(movie);
		}
		applyAPI(movieInput);
	}

	function applyAPI(movie) {
		if (movie === "") {
			return (movieInput.value = "");
		}
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
		showPopup(true, err, "Error", "Warning");
		executeInputInitialBehavior();
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
		deleteSvgImage(true);
		printMovieInfo(movie);
	}

	function deleteSvgImage(isPresent) {
		if (!isPresent) imageBg.classList.remove("banner__disableImgRender");
		else imageBg.classList.add("banner__disableImgRender");
	}
	function printMovieInfo(movie) {
		const newTitles = [...new Set(titles)];
		if (JSON.stringify(newTitles) !== JSON.stringify(titles)) {
			titles.pop();

			return handleError("You've already searched...");
		} else {
			executeFirebase(movie);

			const markup = cardContent(movie);
			const content = makeElement("li", "banner__content", markup);

			content.style.height = calcCardHeight(movie);
			// banner.style.cssText = "width:100%;margin-left:-30px;";
			cards.push(content);
			cards.reverse();

			cards.map((item) => {
				banner.appendChild(item);

				removePoster(item);
				increasePoster(item, movie);
				printCardIconsContent(item);
				printGenres(item);

				item.childNodes[1].childNodes[0].onclick = () => {
					db.collection("cards")
						.where("Title", "==", item.childNodes[3].textContent)
						.get()
						.then((querySnapshot) => {
							querySnapshot.forEach((doc) => {
								doc.ref.delete();
							});
						});
					item.style.display = "none";
					let i = titles.indexOf(item);
					console.log(i);
					removeIndex(i);
					if (titles.length === 0) {
						deleteSvgImage(false);
						banner.style.cssText = "width:100%;";
					}
				};
			});
			executeInputInitialBehavior();
		}
	}

	function validatePosterSrc(src) {
		return src === "N/A" ? "none" : "block";
	}

	function removeIndex(i) {
		titles.splice(i, 1);
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
		console.log(item.childNodes[19].childNodes[2]);
		const testa = item.childNodes[19].childNodes[2];
		const increasePosterIcon =
			item.childNodes[item.childNodes.length - 2].childNodes[3].childNodes[1];

		let x = (increasePosterIcon.onclick = () => {
			poster.classList.add("zoomed-poster");
			increasePosterIcon.style.transform = "rotate(180deg)";
			poster.style.height = item.style.height;
			increasePosterIcon.onclick = () => {
				poster.classList.remove("zoomed-poster");
				increasePosterIcon.style.transform = "rotate(0deg)";
				poster.style.height = "250px";

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
			poster.childNodes[3].style.display = "none";
			item.childNodes[19].childNodes[1].style.width = "90%";
			poster.style.animation = "removePoster 1s ease-in-out forwards";
			setTimeout(function () {
				poster.style.display = "none";
			}, 1200);
		};
	}

	function printCardIconsContent(item) {
		const iconsContainer = item.childNodes[17];
		const iconsContentContainer = item.childNodes[19];
		iconsContainer.onclick = () => {
			iconsContentContainer.style.display = "block";
		};
		for (let i = 1; i <= 7; ++i) {
			if (i % 2 !== 0) {
				iconsContainer.childNodes[i].onclick = () => {
					iconsContentContainer.childNodes[1].innerHTML =
						iconsContainer.childNodes[i].title;
				};
			}
		}
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
		else if (rating > 6.0 && rating <= 8.7) return "#008000";
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

	const authInputEffect = [
		...window.document.getElementsByClassName("auth__input"),
	];

	authInputEffect.map((input) => {
		input.onfocus = () => toggleInputEffect(input);
	});

	function toggleInputEffect(input) {
		input.labels[0].classList.add("toggle");
		if (window.screen.availWidth <= 500) {
			document.querySelector(".overlay").style.display = "block";
			auth.style.zIndex = "999999999999999999999";
			document.body.style.overflowX = "hidden";
			document.body.style.overflowY = "hidden";
			window.scrollTo(0, 0);
			input.onblur = () => {
				document.querySelector(".overlay").style.display = "none";
				auth.style.zIndex = "999";
				document.body.style.overflowX = "hidden";
				document.body.style.overflowY = "auto";
			};
		}
	}

	window.document.querySelector(".auth__input").onblur = () =>
		console.log("deu certo");
	const rating = document.querySelector(".footer__stars");
	let stars = [...document.getElementsByClassName("footer__star")];
	let i;
	let p;
	function rateApp(stars, i) {
		let execute = stars.map((star) => {
			star.onclick = () => {
				if (star.className === "footer__star far fa-star") {
					i = stars.indexOf(star);

					stars.splice(i + 1, 10);

					stars.map((item) => {
						item.className = "footer__star fas fa-star";

						stars = [...document.getElementsByClassName("footer__star ")];
					});
				} else {
					i = stars.indexOf(star);
					stars.reverse().splice(i + 1, -10);

					stars.reverse().map((item) => {
						item.className = "footer__star far fa-star";
					});
				}
			};
		});
	}
	rateApp(stars, i);

	var db = firebase.firestore();
	let paths = [];
	function executeFirebase({
		Title,
		Plot = "N/A",
		Director = "N/A",
		Runtime = "N/A",
		imdbRating = "N/A",
		Genre = "N/A",
		Writer = "N/A",
		Awards = "N/A",
		Production = "N/A",
		Actors = "N/A",
		BoxOffice = "N/a",
		Poster = "N/A",
	}) {
		firebase.auth().onAuthStateChanged((user) => {
			let UserEmail = user.email + "";
			db.collection("cards")
				.add({
					UserEmail,
					Title,
					Director,
					Genre,
					Plot,
					Runtime,
					imdbRating,
					Writer,
					Awards,
					Production,
					Actors,
					BoxOffice,
					Poster,
				})
				.then(function (docRef) {
					console.log(docRef.path);
					paths.push(docRef.path);
				})
				.catch(function (error) {
					console.error("Error adding document: ", error);
				});
		});
	}

	firebase.auth().onAuthStateChanged(function (user) {
		if (user) {
			db.collection("cards")
				.where("UserEmail", "==", user?.email)
				.get()
				.then((querySnapshot) => {
					querySnapshot.forEach((doc) => {
						searchMovie(doc.data().Title);

						doc.ref.delete();
					});
				});
		} else {
			console.log("eee");
		}
	});
	var size;
	// firebase.auth().onAuthStateChanged(function (user) {
	// 	if (user) {
	// 		db.collection("cards")
	// 			.where("UserEmail", "==", user?.email)
	// 			.get()
	// 			.then((snap) => {
	// 				size = snap.size;
	// 				if (size >= 6) {
	// 					showPopup(
	// 						true,
	// 						"You can easily label your favorite movies by adding <mark>Fav</mark> after the name of the movie or series...",
	// 						"Fav",
	// 						""
	// 					);
	// 				}
	// 			});
	// 	}
	// });

	const cardsHero = document.querySelector(".banner__card");
	const toggleView = (btnChangeView.onclick = () => {
		cardsHero.style.cssText =
			"display: flex;flex-wrap: nowrap;position:relative;left:-31px;top:-25px;	margin-bottom: 100px;	justify-content: unset;	overflow: auto;		height: 730px;padding-left:none;";

		btnChangeView.onclick = () => {
			cardsHero.style.cssText =
				"display: flex;flex-wrap: wrap;	margin-bottom: 200px;left:-25px;	justify-content: center;	overflow: hidden;		height:auto;";

			btnChangeView.onclick = () => toggleView();
		};
	});

	const notices = [
		"You can add your favorite movies by appling the title plus <mark>fav</mark>, press enter, and  Vuoi la!!",
		"For search only your favorite movies, just press the exclamation button on the search bar...",
		"For search only your favorite movies, just press the star button on the search bar...",
		"You can easily check out the <mark>genre</mark> of the movie by clicking on the title in the card.",
	];

	btnNotice.onclick = () => {
		showPopup(
			true,
			notices[Math.floor(Math.random() * notices.length)],
			"Hey, you!",
			""
		);
	};
	const cardss = [...document.getElementsByClassName("banner__content")];
	firebase.auth().onAuthStateChanged(function (user) {
		if (user === null) {
			[...document.getElementsByClassName("header__button")].map(
				(btn) => (btn.disabled = true)
			);
		} else {
			[...document.getElementsByClassName("header__button")].map(
				(btn) => (btn.disabled = false)
			);
		}
	});
})();
