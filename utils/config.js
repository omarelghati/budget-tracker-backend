// require("dotenv").config();

const PORT = process.env.PORT || 3001;
const MONGODB_URI = "mongodb://mongo:27017/budget-tracker";
const JWT_SECRET = "Qzp752RSBNxSK8fYNA1c";
const SALT_ROUNDS = 10;

module.exports = {
  MONGODB_URI,
  PORT,
  JWT_SECRET,
  SALT_ROUNDS,
};
