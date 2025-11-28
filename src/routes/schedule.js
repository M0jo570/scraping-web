const express = require("express");
const router = express.Router();
const { getSchedule, getScheduleByDay } = require("../controllers/anime");

router.get("/", getSchedule);
router.get("/days/:day", getScheduleByDay);

module.exports = router;