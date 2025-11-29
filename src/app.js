const express = require("express");
const cors = require("cors");

const homeRoute = require("./routes/home");
const ongoingRoute = require("./routes/ongoing");
const completeRoute = require("./routes/complete");
const detailRoute = require("./routes/detail");
const searchRoute = require("./routes/search");
const animeListRoute = require("./routes/animeList");
const episodeRoute = require("./routes/episode");
const genreRoute = require("./routes/genre");
const scheduleRoute = require("./routes/schedule");

const app = express();
app.use(cors());

app.get(["/", "/api"], (req, res) => {
  res.send("Otakudesu scraping by mojoWasTaken");
});

// router
app.use("/anime/home", homeRoute);
app.use("/anime/ongoing", ongoingRoute);
app.use("/anime/complete", completeRoute);
app.use("/anime/detail", detailRoute);
app.use("/anime/search", searchRoute);
app.use("/anime/list", animeListRoute);
app.use("/anime/episode", episodeRoute);
app.use("/anime/genres", genreRoute);
app.use("/anime/schedule", scheduleRoute);

module.exports = app;