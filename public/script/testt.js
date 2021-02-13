const word =
	"Borat: Cultural Learnings of America for Make Benefit Glorious Nation of Kazakhstan";

const res =
	word.length <= 40 ? word : word.split("").splice(0, 37).join("") + "...";
console.log(res);
