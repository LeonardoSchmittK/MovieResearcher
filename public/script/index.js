const App = (function () {
	const [titles, cards] = [[], []];

	searchMovieButton.onclick = () => searchMovie(movieInput.value);

	document.body.onkeypress = (event) => {
		if (event.keyCode === 13) searchMovie(movieInput.value);
	};
	function searchMovie(movieInput) {
		if (movieInput.indexOf("fav") != -1) {
			const movie = movieInput.split("fav")[0];
			console.log(movie);
			let isFavorite = true;
			return applyAPI(movie, isFavorite);
		}
		return applyAPI(movieInput);
	}

	function applyAPI(movie, isFavorite) {
		if (movie === "") {
			return (movieInput.value = "");
		}
		const apikey = "a1dd21cb";
		fetch(`http://www.omdbapi.com/?apikey=${apikey}&t=${movie}`, {
			method: "GET",
		})
			.then((data) => data.json())
			.then((data) => {
				checkMovie(data, isFavorite);
			})
			.catch((err) => handleError(err));
	}

	function handleError(err = "Occured and error") {
		showPopup(true, err, "Error", "Warning");
		executeInputInitialBehavior();
	}

	function checkMovie(movie, isFavorite) {
		if (movie.Error === "Incorrect IMDb ID.")
			return handleError("Type in some series or movie");

		if (movie.Error === "Movie not found!")
			return handleError("Movie not found!");
		else {
			titles.push(movie.Title);
			return printMovieCard(movie, isFavorite);
		}
	}

	function printMovieCard(movie, isFavorite) {
		deleteSvgImage(true);
		printMovieInfo(movie, isFavorite);
	}

	function deleteSvgImage(isPresent) {
		if (!isPresent) bannerSvg.classList.remove("banner__disableImgRender");
		else bannerSvg.classList.add("banner__disableImgRender");
	}
	function printMovieInfo(movie, isFavorite) {
		const newTitles = [...new Set(titles)];
		if (JSON.stringify(newTitles) !== JSON.stringify(titles)) {
			titles.pop();

			return handleError("You've already searched...");
		} else {
			executeFirebase(movie, isFavorite);

			const markup = cardContent(movie, isFavorite);
			const content = makeElement("li", "banner__content", markup);

			content.style.height = calcCardHeight(movie);
			cards.push(content);
			cards.reverse();

			cards.map((item) => {
				cardsHero.appendChild(item);

				removePoster(item);
				increasePoster(item, movie);
				printCardIconsContent(item);
				printGenres(item);
				checkFavoriteCard(item);

				item.childNodes[1].childNodes[0].onclick = () => {
					db.collection("cards")
						.where("Title", "==", item.childNodes[3].textContent)
						.get()
						.then((querySnapshot) => {
							querySnapshot.forEach((doc) => {
								doc.ref.delete();
							});
						});
					setCssProperties(item, { display: "none" });
					let i = titles.indexOf(item);
					console.log(i);
					removeIndex(i);
					if (titles.length === 0) {
						btnFavorites.disabled = true;
						btnSearched.disabled = true;
						deleteSvgImage(false);
						setCssProperties(cardsHero, { width: "100%" });
					}
				};
			});
			executeInputInitialBehavior();
		}
	}

	function checkFavoriteCard(item) {
		const movieTitle = item.childNodes[3].title;
		if (movieTitle.indexOf("favorite") !== -1) styleFavoriteCard(item);
	}

	function styleFavoriteCard(item) {
		const favoriteCardColor = "#ebc334";
		const poster = item.childNodes[21].childNodes[1];
		const marks = [
			...document.getElementsByClassName("card__content__subtitle"),
		];
		marks.map((mark) => {
			if (item.contains(mark)) {
				setCssProperties(mark, {
					background: favoriteCardColor,
					color: "#fff",
				});
			}
		});

		setCssProperties(item, { border: `4px solid ${favoriteCardColor}` });
		setCssProperties(poster, { border: `4px solid ${favoriteCardColor}` });
	}

	function validatePosterSrc(src) {
		return src === "N/A" ? "none" : "block";
	}

	function removeIndex(i) {
		titles.splice(i, 1);
	}

	function cardContent(
		{
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
		},
		isFavorite
	) {
		const res =
			Title.length <= 35
				? Title
				: Title.split("").splice(0, 32).join("") + "...";
		return `
		
			<span><i  class="remove-card-icon fas fa-times"></i> </span>
			<h1  title='${Title}${isFavorite ? " | favorite" : " "}'>${res}</h1>
			<div class='genres-container'> 
      ${printGenresLabels(Genre)}
			</div>
	<p class='card__content__p' style='color:${checkExistence(
		Plot
	)};' ><mark class='card__content__subtitle'>About:</mark>${Plot}</p>
	  <p class='card__content__p' style='color:${checkExistence(
			Director,
			Writer
		)};'><mark class='card__content__subtitle'>${checkDirectorLabel(Director)}
	</mark>${checkDirectorExistence(Director, Writer)}</p>
	<p class='card__content__p' style='color:${checkExistence(
		Year
	)};'><mark class='card__content__subtitle'>Release:</mark>${Year}</p>
	<p class='card__content__p' style='color:${rankRating(
		imdbRating
	)};'><mark class='card__content__subtitle'>IMDb:</mark>${imdbRating}</p>
	<p class='card__content__p'  style='color:${checkExistence(
		Runtime
	)};'><mark class='card__content__subtitle'>Runtime:</mark>${Runtime}</p>
	<div class='banner__card-icons'>

			   <i   title='${Awards}'  style='display:${checkCardIconVisibility(
			Awards
		)};' class="card__content__subtitle card__content__subtitle card-icon fas fa-trophy"></i>

		<i   title='${Production}'	style='display:${checkCardIconVisibility(
			Production
		)};'  class="card__content__subtitle card-icon fas fa-film"></i> 

	  	<i   title='${Actors}' style='display:${checkCardIconVisibility(
			Actors
		)};'  class="card__content__subtitle card-icon fas fa-users"></i>  


				  	<i   title='${BoxOffice}' style='display:${checkCardIconVisibility(
			BoxOffice
		)};'  class="card__content__subtitle  card-icon fas fa-dollar-sign"></i>  

	</div>
<div style='display:none;' class='icons-content-container'>
						<p class='icons-content'></p>
	</div>

		<figure class='banner__poster' style='display:${validatePosterSrc(
			Poster
		)};' id='movie-img'/>
		<img   class='banner__movie-img' src='${Poster}' alt='${Title}-poster'/>
		<figcaption><i  class='card__content__subtitle remove-poster-icon fas fa-times'></i><i class="card__content__subtitle increase-poster-icon fas fa-chart-line"></i></figcaption>

</figure> 
	
		`;
	}
	function increasePoster(item) {
		const poster = item.childNodes[item.childNodes.length - 2];
		const testa = item.childNodes[19].childNodes[2];
		const increasePosterIcon =
			item.childNodes[item.childNodes.length - 2].childNodes[3].childNodes[1];

		increasePosterIcon.onclick = () => {
			toggleElement(poster, "zoomed-poster");
		};

		const posters = [...document.getElementsByClassName("banner__poster")];
		document.body.onkeyup = (e) => {
			if (e.keyCode === 66 && e.ctrlKey === true) {
				posters.map((poster) => {
					toggleElement(poster, "zoomed-poster");
				});
			}
		};
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
		return director === "N/A" ? abridge(writer) : abridge(director);
	}

	function abridge(director) {
		const dir = director.split(",");
		if (dir.length >= 3) {
			dir.splice(-1, 1);
			return dir.join(",") + "...";
		} else {
			return dir;
		}
	}

	function checkDirectorLabel(director) {
		return director === "N/A" ? "Writers:" : "Director:";
	}

	function calcCardHeight({ Title }) {
		if (window.screen.availHeight >= 500) {
			if (Title.length > 26) return "580px";
			return "480px";
		} else {
			if (Title.length > 26) return "500px";
			return "400px";
		}
	}

	function checkCardIconVisibility(value) {
		return value === undefined || value === "N/A" ? "none" : "block";
	}

	function executeInputInitialBehavior() {
		movieInput.value = "";
		movieInput.focus();
	}

	authInputEffect.map((input) => {
		input.onfocus = () => toggleInputEffect(input);
		// if (input.value !== 0) toggleInputEffect(input);
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
	function executeFirebase(
		{
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
		},
		isFavorite = false
	) {
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
					isFavorite,
				})
				.then(function (docRef) {
					paths.push(docRef.path);
				})
				.catch(function (error) {
					handleError(error);
				});
		});
	}

	document.addEventListener("DOMContentLoaded", printCardWhenDOMStart);

	function printCardWhenDOMStart() {
		firebase.auth().onAuthStateChanged(function (user) {
			if (user) {
				db.collection("cards")
					.where("UserEmail", "==", user?.email)
					.get()
					.then((querySnapshot) => {
						querySnapshot.forEach((doc) => {
							const movieTitle = doc.data().isFavorite
								? doc.data().Title + " fav"
								: doc.data().Title;
							searchMovie(movieTitle);
							doc.ref.delete();
						});
					});
			} else {
			}
		});
	}

	btnFavorites.onclick = () => {
		[...document.getElementsByClassName("banner__content")].map((i) => {
			if (i.style.border !== "4px solid rgb(235, 195, 52)") {
				i.style.display = "none";
				// setCssProperties(btnSearched, { display: "block" });
				// setCssProperties(btnFavorites, { display: "none" });
			} else {
				i.style.display = "block";
			}
		});
	};

	btnSearched.onclick = () => {
		[...document.getElementsByClassName("banner__content")].map((i) => {
			if (i.style.border !== "4px solid rgb(235, 195, 52)") {
				setCssProperties(i, { display: "block" });
			} else {
				setCssProperties(i, { display: "none" });
			}
		});
	};

	const blurBars = [...document.getElementsByClassName("blur-bar")];

	const toggleView = (btnChangeView.onclick = () => {
		[...document.getElementsByClassName("banner__content")].map((i) => {
			i.style.marginTop = "35px";
		});
		setCssProperties(cardsHero, {
			display: "flex",
			"flex-wrap": "nowrap",
			position: "relative",
			top: "-14px",
			"margin-bottom": "100px",
			"justify-content": "unset",
			"align-items": "flex-start",
			overflow: "auto",
			// height: "735px",
			"padding-left": "none",
		});

		blurBars.map((bar) => (bar.style.display = "block"));
		btnChangeView.onclick = () => {
			[...document.getElementsByClassName("banner__content")].map((i) => {
				i.style.marginTop = "50px";
			});
			setCssProperties(cardsHero, {
				display: "flex",
				"flex-wrap": "wrap",
				"margin-bottom": "100px",
				"justify-content": "center",
				"align-items": "center",
				overflow: "hidden",
				height: "auto",
			});
			blurBars.map((bar) => (bar.style.display = "none"));

			btnChangeView.onclick = () => toggleView();
		};
	});

	const notices = [
		"You can add your favorite movies by appling the title plus <mark>fav</mark>, press enter, and  Vuoi la!!",
		"For search only your favorite movies, just press the star button on the search bar...",
		"For search only your searched movies, just press the clock button on the search bar...",
		"You can easily check out the <mark>genre</mark> of the movie by clicking on the title in the card.",
		"If you are using a computer, just hold <mark>ctrl</mark> + <mark style='margin-left:7px;'>b</mark>",
	];

	btnNotice.onclick = () => {
		showPopup(
			true,
			notices[Math.floor(Math.random() * notices.length)],
			"Hey, you!",
			""
		);
	};
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

	iconGoToTop.onclick = () => window.scrollTo(0, 0);
	btnRemoveCards.onclick = () => removeAllCards();

	function removeAllCards() {
		firebase.auth().onAuthStateChanged(function (user) {
			if (user) {
				db.collection("cards")
					.where("UserEmail", "==", user?.email)
					.get()
					.then((querySnapshot) => {
						querySnapshot.forEach((doc) => {
							doc.ref.delete();
							location.reload();
						});
					});
			} else {
				handleError();
			}
		});
	}
})();
