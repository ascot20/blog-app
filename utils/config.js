require("dotenv").config();

const url = process.env.MONGODB_URI;
const port = process.env.PORT;

module.exports = {
  url,
  port,
};
