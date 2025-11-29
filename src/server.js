const app = require("./app");
const { PORT } = require("./config");

const PORT = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server running on port ${PORT}`));