const fruits = ["Apple", "Banana", "Apple"];
const isFound = fruits.indexOf("Apple");
const removeDuplicates = (arr) => [...new Set(arr)];

if (isFound != fruits.length - 1) {
	console.log(removeDuplicates(fruits));
} else {
	console.log("Not repeated");
}
