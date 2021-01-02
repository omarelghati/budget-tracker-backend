// require("dotenv").config();

const PORT = process.env.PORT || 3001;
const MONGODB_URI = "mongodb://localhost/budget-tracker-db";
const JWT_SECRET = "Qzp752RSBNxSK8fYNA1c";
const SALT_ROUNDS = 10;

module.exports = {
  MONGODB_URI,
  PORT,
  JWT_SECRET,
  SALT_ROUNDS,
};
