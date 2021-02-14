const directors = "Greg Daniels, Ricky Gervais, Stephen Merchant";
const newDir = directors.split(",");
if (newDir.length >= 3) {
	newDir.splice(-1, 1);
}
console.log(newDir.join(","));
