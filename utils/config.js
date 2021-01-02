// require("dotenv").config();

const PORT = process.env.PORT || 3001;
const MONGODB_URI =
  "mongodb+srv://omarUser:XPpj9_4_ZkqdWM5@cluster0.po8a9.mongodb.net/budget-tracker?retryWrites=true&w=majority";
const JWT_SECRET = "Qzp752RSBNxSK8fYNA1c";
const SALT_ROUNDS = 10;

module.exports = {
  MONGODB_URI,
  PORT,
  JWT_SECRET,
  SALT_ROUNDS,
};
