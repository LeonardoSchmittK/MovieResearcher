const express = require("express");
const app = express();
const fs = require("fs");
const path = require("path");
app.use(express.static("public"));

app.get("/", (req, res) => {
	res.end(homePage);
	res.sendFile(path.resolve(__dirname, "index.html"));
});

const port = process.env.PORT || 4000;
app.listen(port, () => {
	console.log(`Running on port ${port}`);
});
