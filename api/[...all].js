const app = require("../src/app");

// forward Vercel requests (all /api/*) to Express app
module.exports = (req, res) => app(req, res);
