const express = require("express");
const router = express.Router();
const { getGenreList, getGenreContent } = require("../controllers/anime");

router.get("/", getGenreList);
router.get("/:slug", getGenreContent);

module.exports = router;