const PORT = process.env.PORT || 3001;
const MONGODB_URI = `mongodb+srv://omar_dbuser:Ir4cyGe4e8u81Gw9@budget-tracker-cluster.mnl3o.mongodb.net/budget-tracker?retryWrites=true&w=majority`;
const JWT_SECRET = "Qzp752RSBNxSK8fYNA1c";
const SALT_ROUNDS = 10;

module.exports = {
  MONGODB_URI,
  PORT,
  JWT_SECRET,
  SALT_ROUNDS,
};
