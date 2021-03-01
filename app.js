const express = require("express");
const app = express();
const path = require("path");
app.use(express.static("public"));

app.get("/", (req, res) => {
   res.sendFile(path.resolve(__dirname, "index.html"));
});

app.get("*", (req, res) => {
   res.sendFile(path.resolve(__dirname, "public/404.html"));
});

const port = process.env.PORT || 10000;
app.listen(port, () => {
   console.log(`Running on port ${port}`);
});
