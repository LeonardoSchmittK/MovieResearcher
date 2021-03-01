function rateApp(stars) {
   const starClassActive = "footer__star fas fa-star";
   const starClassUnactive = "footer__star far fa-star";
   const starsLength = stars.length;
   let i;
   stars.map((star) => {
      star.onclick = () => {
         i = stars.indexOf(star);

         if (star.className === starClassUnactive) {
            for (i; i >= 0; --i) stars[i].className = starClassActive;
         } else {
            for (i; i < starsLength; ++i) stars[i].className = starClassUnactive;
         }
      };
   });
}

rateApp(stars);
