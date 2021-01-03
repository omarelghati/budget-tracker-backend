// require("dotenv").config();
var // Local ip address that we're trying to calculate
  address,
  // Provides a few basic operating-system related utility functions (built-in)
  os = require("os"),
  // Network interfaces
  ifaces = os.networkInterfaces();

// Iterate over interfaces ...
for (var dev in ifaces) {
  // ... and find the one that matches the criteria
  var iface = ifaces[dev].filter(function (details) {
    return details.family === "IPv4" && details.internal === false;
  });

  if (iface.length > 0) address = iface[0].address;
}

const PORT = process.env.PORT || 3001;
const MONGODB_URI = `mongodb://mongo:27017/budget-tracker`;
const JWT_SECRET = "Qzp752RSBNxSK8fYNA1c";
const SALT_ROUNDS = 10;

module.exports = {
  MONGODB_URI,
  PORT,
  JWT_SECRET,
  SALT_ROUNDS,
};
