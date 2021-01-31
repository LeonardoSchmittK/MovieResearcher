// const str = "Leonardo Schmitt Kreuch do";
// const substr = "do";
// const indexes = [];
// function findStrs(str, subst) {
// 	const ocurrence = str.indexOf(subst);
// 	const x = str.slice(ocurrence, ocurrence + substr.length);
// 	indexes.push(ocurrence);
// 	if (str.indexOf(subst) === -1) {
// 		return indexes;
// 	} else {
// 		return x;
// 	}
// }

// console.log(findStrs(str, substr));

const arr = ["A", "B"];
const t = arr.splice("A", 1);
console.log(t);
