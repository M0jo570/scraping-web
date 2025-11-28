const express = require("express");

const homeRoute = require("./routes/home");
const ongoingRoute = require("./routes/ongoing");
const completeRoute = require("./routes/complete");
const detailRoute = require("./routes/detail");
const searchRoute = require("./routes/search");
const animeListRoute = require("./routes/animeList");
const episodeRoute = require("./routes/episode");
const app = express();

app.get("/", (req, res) => {
  res.send("Otakudesu scraping by mojoWasTaken");
});

// router
app.use("/api/anime/home", homeRoute);
app.use("/api/anime/ongoing", ongoingRoute);
app.use("/api/anime/complete", completeRoute);
app.use("/api/anime/detail", detailRoute);
app.use("/api/anime/search", searchRoute);
app.use("/api/anime/list", animeListRoute);
app.use("/api/anime/episode", episodeRoute);


const PORT = 3000;
app.listen(PORT, () => console.log("Server running on port", PORT));