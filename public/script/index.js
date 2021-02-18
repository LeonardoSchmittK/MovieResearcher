const App = (function () {
	const [titles, cards] = [[], []];

	searchMovieButton.onclick = () => validateMovie(movieInput.value);

	document.body.onkeypress = (event) => {
		if (
			event.which === 13 ||
			event.keyCode === 13 ||
			event.charCode === 13 ||
			event.code === "Enter"
		)
			validateMovie(movieInput.value);
	};

	function validateMovie(movieInput) {
		let [title, isFavorite] = [movieInput, false];
		({ title, isFavorite } = checkIsFavorite(movieInput, title, isFavorite));
		return applyAPI(title, isFavorite);
	}

	function checkIsFavorite(movieInput, title, isFavorite) {
		if (movieInput.indexOf("fav") !== -1) {
			title = movieInput.replace("fav", "");
			isFavorite = true;
		}
		return { title, isFavorite };
	}

	function applyAPI(movie, isFavorite) {
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

	function checkMovie(movie, isFavorite) {
		const errors = ["Incorrect IMDb ID.", "Movie not found!"];
		const { Error } = movie;
		return errors.includes(Error)
			? handleError(Error === "Incorrect IMDb ID." ? "Type in a movie!" : Error)
			: prepareCards(movie, isFavorite);
	}

	function prepareCards(movie, isFavorite) {
		saveTitle(movie);
		deleteSvgImage(true);
		preventDuplicateMovies(movie, isFavorite);
	}

	const saveTitle = (movie) => titles.push(movie.Title);

	function deleteSvgImage(isPresent) {
		if (isPresent) bannerSvg.classList.add("banner__disableImgRender");
		else bannerSvg.classList.remove("banner__disableImgRender");
	}

	function preventDuplicateMovies(movie, isFavorite) {
		const nonDuplicateTitles = [...new Set(titles)];
		if (JSON.stringify(nonDuplicateTitles) !== JSON.stringify(titles)) {
			removeLastItem(titles);
			return handleError("You've already searched...");
		}
		return printCard(movie, isFavorite);
	}

	const removeLastItem = (arr) => arr.pop();

	function printCard(movie, isFavorite) {
		executeFirebase(movie, isFavorite);

		let [markup, content] = ["", ""];
		({ markup, content } = generateCard(markup, content, movie, isFavorite));

		cards.push(content);
		cards.reverse();

		cards.map((item) => {
			cardsHero.appendChild(item);
			calcCardHeight(movie, content);
			removePoster(item);
			increasePoster(item, movie);
			printCardIconsContent(item);
			printGenres(item);
			checkFavoriteCard(item);
			removeCard(item);
			executeInputInitialBehavior();
		});
	}

	function generateCard(markup, content, movie, isFavorite) {
		markup = cardContent(movie, isFavorite);
		content = makeElement("li", "banner__content", markup);
		return { markup, content };
	}

	function removeCard(card) {
		const closeCardIcon = card.childNodes[1].childNodes[0];
		const cardTitle = card.childNodes[3].textContent;
		closeCardIcon.onclick = () => {
			removeCardFromFirestore(cardTitle);
			setCssProperties(card, { display: "none" });
			removeIndex(titles.indexOf(card));
			if (titles.length === 0) deleteSvgImage(false);
		};
	}

	function removeCardFromFirestore(query) {
		db.collection("cards")
			.where("Title", "==", query)
			.get()
			.then((querySnapshot) => {
				querySnapshot.forEach((doc) => {
					doc.ref.delete();
				});
			});
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
			if (item.contains(mark))
				setCssProperties(mark, {
					background: favoriteCardColor,
					color: "#fff",
				});
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

	function formatTitle(title) {
		return title.length <= 35
			? title
			: `${title.split("").splice(0, 32).join("")}...`;
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
		return `
		
			<span><i  class="remove-card-icon fas fa-times"></i> </span>
			<h1  title='${formatTitle(Title)}${
			isFavorite ? " | favorite" : " "
		}'>${formatTitle(Title)}</h1>
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
		const increasePosterIcon =
			item.childNodes[item.childNodes.length - 2].childNodes[3].childNodes[1];

		increasePosterIcon.onclick = () => {
			toggleElement(poster, "zoomed-poster");
		};

		document.body.onkeyup = (e) => {
			if (e.keyCode === 66 && e.ctrlKey === true) {
				const posters = [...document.getElementsByClassName("banner__poster")];
				zoomAllPosters(posters);
			}
		};
	}

	function zoomAllPosters(posters) {
		posters.map((poster) => {
			toggleElement(poster, "zoomed-poster");
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
		const cardIconsContainerContent = item.childNodes[19].childNodes[1];
		const cardFigcaption = poster.childNodes[3];

		removePosterIcon.onclick = () => {
			poster.classList.remove("zoomed-poster");
			setCssProperties(poster, {
				animation: "removePoster 1s ease forwards",
			});
			setCssProperties(cardIconsContainerContent, { width: "90%" });
			setCssProperties(removePosterIcon, { color: "red" });
			setCssProperties(cardFigcaption, { display: "none" });

			setTimeout(() => {
				setCssProperties(poster, { display: "none" });
			}, 1000);
		};
	}

	function printCardIconsContent(item) {
		const iconsContainer = item.childNodes[17];
		const iconsContentContainer = item.childNodes[19];
		iconsContainer.onclick = () => {
			setCssProperties(iconsContentContainer, { display: "block" });
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

		item.childNodes[3].onclick = () => {
			toggleElement(genresContainer, "toggle-genres");
		};
	}

	function rankRating(rating) {
		if (rating < 6.0) return "#FF0014";
		else if (rating >= 6.0 && rating <= 7.3) return "#4CA64C";
		else if (rating > 7.3 && rating <= 8.7) return "#008000";
		else if (rating >= 8.8) return "#b29600";
		return "#A9A9A9";
	}

	const checkDirectorExistence = (director, writer) =>
		director === "N/A" ? abridge(writer) : abridge(director);

	function abridge(director) {
		const dir = director.split(",");
		if (dir.length >= 3) {
			dir.splice(-1, 1);
			return dir.join(",") + "...";
		}
		return dir;
	}

	function checkDirectorLabel(director) {
		return director === "N/A" ? "Writers:" : "Director:";
	}

	function calcCardHeight({ Title }, content) {
		return Title.length > 26
			? (content.style.height = "580px")
			: (content.style.height = "480px");
	}

	const checkCardIconVisibility = (value) =>
		value === undefined || value === "N/A" ? "none" : "block";

	authInputEffect.map((input) => {
		input.onblur = () => toggleInputEffect(input);
		input.onfocus = () => toggleInputEffect(input);
	});

	function toggleInputEffect(input) {
		input.labels[0].classList.add("toggle");
		if (window.screen.availWidth <= 2800) {
			setCssProperties(overlay, { display: "block" });
			setCssProperties(document.body, { overflow: "hidden" });
			window.scrollTo(0, 0);
			input.onblur = () => {
				setCssProperties(overlay, { display: "none" });
				setCssProperties(document.body, {
					overfloX: "hidden",
					overflowY: "auto",
				});
			};
		}
	}

	let stars = [...document.getElementsByClassName("footer__star")];
	let i;
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
			BoxOffice = "N/A",
			Poster = "N/A",
		},
		isFavorite = false
	) {
		firebase.auth().onAuthStateChanged((user) => {
			let UserEmail = user.email + "";
			if (user) {
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
			}
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
							validateMovie(movieTitle);
							doc.ref.delete();
						});
					});
			} else {
			}
		});
	}

	btnFavorites.onclick = () => {
		headSecondaryBtns.style.width = "120px";
		const cardss = [...document.getElementsByClassName("banner__content")];
		const newCardss = [...new Set(cardss)];
		newCardss.map((i) => {
			if (i.style.border === "4px solid rgb(235, 195, 52)") {
				i.style.display = "block";
				setCssProperties(btnSearched, { display: "block" });
				setCssProperties(btnFavorites, { display: "none" });
			} else {
				i.style.display = "none";
				setCssProperties(btnSearched, { display: "flex" });
				setCssProperties(btnFavorites, { display: "none" });
			}
		});
	};

	btnSearched.onclick = () => {
		headSecondaryBtns.style.width = "120px";
		const cardss = [...document.getElementsByClassName("banner__content")];
		const newCardss = [...new Set(cardss)];
		newCardss.map((i) => {
			if (i.style.border !== "4px solid rgb(235, 195, 52)") {
				setCssProperties(i, { display: "block" });
				setCssProperties(btnSearched, { display: "none" });
				setCssProperties(btnFavorites, { display: "flex" });
			} else {
				setCssProperties(i, { display: "none" });
				setCssProperties(btnSearched, { display: "none" });
				setCssProperties(btnFavorites, { display: "flex" });
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
				position: "relative",
				top: "-14px",
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

	iconGoToTop.onclick = () => scrollTo(0, 0);

	btnRemoveCards.onclick = () => {
		firebase.auth().onAuthStateChanged(function (user) {
			db.collection("cards")
				.where("UserEmail", "==", user.email)
				.get()
				.then((querySnapshot) => {
					querySnapshot.forEach((doc) => {
						doc.ref.delete();
						location.reload();
					});
				});
		});
	};

	btnMicrophone.onclick = () => startRecognition();
	function startRecognition() {
		btnMicrophone.classList.add("mic-on");
		const recognition = new webkitSpeechRecognition();
		recognition.interimResults = true;
		recognition.lang = "en-US";
		recognition.continuous = true;
		recognition.start();
		recognition.onresult = () => getContent(event);
		function getContent(event) {
			for (let i = event.resultIndex; i < event.results.length; i++) {
				if (event.results[i].isFinal) {
					const content = event.results[i][0].transcript.trim();
					// movieInput.value = content;
					validateMovie(content);
					console.log(content);
					btnMicrophone.classList.remove("mic-on");
					recognition.stop();
				}
			}
		}
	}
})();
