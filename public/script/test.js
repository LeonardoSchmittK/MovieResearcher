const Genre = "Animation, Adventure, Comedy, Family, Fantasy";

const splitGenres = Genre.split(",");

const removeSpaces = splitGenres.map((genre, i) => {
	return genre.indexOf(" ") !== -1 ? `#${genre.slice(1)}` : `${genre}`;
});

console.log(removeSpaces);
