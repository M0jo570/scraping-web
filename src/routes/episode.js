const express = require("express");
const router = express.Router();
const { getEpisode } = require("../controllers/anime");

router.get("/:slug", getEpisode);

module.exports = router;