const mainAppExecution = (function () {
   const [titles, cards] = [[], []];

   searchMovieButton.onclick = () => validateMovie(movieInput.value);

   auth.onAuthStateChanged((user) => {
      if (user) {
         document.body.onkeypress = (e) => {
            if (e.which === 13 || e.keyCode === 13 || e.charCode === 13 || e.code === "Enter")
               validateMovie(movieInput.value);
         };
      }
   });

   authWrapper.onkeypress = (event) => {
      if (event.code === "Enter") {
         handleLogin(event);
      }
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

   async function applyAPI(movie, isFavorite) {
      const apikey = "a1dd21cb";

      try {
         const data = await fetch(`http://www.omdbapi.com/?apikey=${apikey}&t=${movie}`, {
            method: "GET",
         });
         const moviee = await data.json();
         checkMovie(moviee, isFavorite);
      } catch (err) {
         handleError(err);
      }
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
         appendCarsToHero(item);
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

   const appendCarsToHero = (item) => cardsHero.appendChild(item);

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
         card.setAttribute("data-isremoved", true);
         removeIndex(titles.indexOf(card));

         if (titles.length === 0) deleteSvgImage(false);
      };
   }

   function removeCardFromFirestore(query) {
      dbCards
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
      const cardMarks = [...document.getElementsByClassName("card__content__subtitle")];

      cardMarks.map((mark) => {
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
      return title.length <= 35 ? title : `${title.split("").splice(0, 32).join("")}...`;
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

<h1  title='${formatTitle(Title)}${isFavorite ? " | favorite" : " "}'>${formatTitle(Title)}</h1>

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
         </mark>${checkDirectorExistence(Director, Writer)}
      </p>

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

<figure class='banner__poster' style='display:${validatePosterSrc(Poster)};' id='movie-img'/>
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
               iconsContentContainer.childNodes[1].innerHTML = iconsContainer.childNodes[i].title;
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

      setCssProperties(overlay, { display: "block" });
      setCssProperties(document.body, { overflow: "hidden" });
      setCssProperties(authentication, { "z-index": "5" });

      window.scrollTo(0, 0);

      input.onblur = () => {
         setCssProperties(overlay, { display: "none" });
         setCssProperties(document.body, {
            overfloX: "hidden",
            overflowY: "auto",
         });
      };
   }

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
      auth.onAuthStateChanged((user) => {
         let UserEmail = user.email + "";
         if (user) {
            dbCards
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
               .catch(function (error) {
                  handleError(error);
               });
         }
      });
   }

   document.addEventListener("DOMContentLoaded", printCardWhenDOMStart);

   function printCardWhenDOMStart() {
      auth.onAuthStateChanged(function (user) {
         if (user) {
            dbCards
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
         }
      });
   }

   btnFavorites.onclick = () => {
      const cardss = [...document.getElementsByClassName("banner__content")];
      const newCardss = [...new Set(cardss)];

      newCardss.map((i) => {
         if (
            i.style.border === "4px solid rgb(235, 195, 52)" &&
            i.getAttribute("data-isremoved") === null
         ) {
            headSecondaryBtns.style.width = "120px";
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
      const cardss = [...document.getElementsByClassName("banner__content")];
      const newCardss = [...new Set(cardss)];

      newCardss.map((i) => {
         if (
            i.style.border !== "4px solid rgb(235, 195, 52)" &&
            i.getAttribute("data-isremoved") === null
         ) {
            headSecondaryBtns.style.width = "120px";
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
      const chosenNotice = notices[Math.floor(Math.random() * notices.length)];
      showPopup(true, chosenNotice, "Hey, you!", "");
   };

   iconGoToTop.onclick = () => scrollTo(0, 0);

   btnRemoveCards.onclick = (e) => {
      auth.onAuthStateChanged(function (user) {
         dbCards
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

   function checkSpeechRecognition() {
      if (!window.webkitSpeechRecognition) setCssProperties(btnMicrophone, { display: "none" });
   }

   checkSpeechRecognition();

   btnMicrophone.onclick = () => startRecognition();

   function startRecognition() {
      btnMicrophone.classList.add("mic-on");
      let SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.interimResults = true;
      recognition.lang = "en-US";
      recognition.continuous = true;
      recognition.start();
      recognition.onresult = () => getContent(event);
   }

   function getContent(e) {
      let i = e.resultIndex;
      let resultsLength = results.length;

      for (let i = e.resultIndex; i < resultsLength; i++) {
         console.log(e.results[i]);

         if (e.results[i].isFinal) {
            console.log(e.results[i][0]);
            const content = e.results[i][0].transcript.trim();
            validateMovie(content);
            btnMicrophone.classList.remove("mic-on");
            recognition.stop();
         }
      }
   }
})();
