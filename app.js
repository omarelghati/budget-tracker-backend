const express = require("express");
const mongoose = require("mongoose");
const morgan = require("morgan");
const helmet = require("helmet");
const compression = require("compression");
const cors = require("cors");
const { MONGODB_URI, PORT } = require("./config");

const usersRouter = require("./controllers/users.controller");
const categoriesRouter = require("./controllers/categories.controller");
const salariesRouter = require("./controllers/salaries.controller");
const transactionsRouter = require("./controllers/transactions.controller");
const monthsRouter = require("./controllers/months.controller");
const debtsRouter = require("./controllers/debts.controller");
const statsRouter = require("./controllers/statistics.controller");

const app = express();

app.use(express.json());
app.use(helmet());
app.use(compression());

app.use(morgan("dev"));
app.use(cors("*"));
app.use("/api/users", usersRouter);
app.use("/api/categories", categoriesRouter);
app.use("/api/salaries", salariesRouter);
app.use("/api/transactions", transactionsRouter);
app.use("/api/months", monthsRouter);
app.use("/api/debts", debtsRouter);
app.use("/api/statistics", statsRouter);

function connectWithRetry() {
  mongoose
    .connect(MONGODB_URI, { useNewUrlParser: true })
    .then(() => console.log("Connected to MongoDB"))
    .catch((error) => {
      console.error(
        "Failed to connect to mongo on startup - retrying in 3 sec",
        error.message
      );
      setTimeout(connectWithRetry, 3000);
    });
}
connectWithRetry();
app.listen(PORT, () => console.log(`Listening on port: ${PORT}`));

module.exports = app;
