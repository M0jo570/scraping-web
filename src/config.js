require("dotenv").config();

const BASE_URL = process.env.BASE_URL;
const PORT = process.env.PORT || 3000;

module.exports = {
  BASE_URL,
  PORT,
};