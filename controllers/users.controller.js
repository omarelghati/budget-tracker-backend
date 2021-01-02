const router = require("express").Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const Month = require("../models/Month");

const User = require("../models/User");
const { JWT_SECRET, SALT_ROUNDS } = require("../utils/config");

router.get("/", async (_, response) => {
  const users = await User.find({}, "-password").populate("Salary Month");
  response.status(200).json({ users });
});

router.post("/setbalance", async (request, response) => {
  const { email: userId, newBalance } = request.body;
  const user = await User.findByIdAndUpdate(userId, { balance: newBalance });
  response.status(200).json({ user });
});

router.post("/setMonth", async (request, response) => {
  const { monthId } = request.body;
  const userId = request.get("x-bm-userId");
  const month = await Month.findById(monthId);
  if (!month) {
    return response
      .status(400)
      .json({ error: "the specified month doesn't exist" });
  }
  const user = await User.findByIdAndUpdate(userId, { currentMonth });
  return response.status(200).json({ user });
});

router.post("/login", async (request, response) => {
  const { email, password } = request.body;

  const user = await User.findOne({ email }).populate("Salary");
  if (!user) {
    return response.status(401).json({
      error: "email or password are incorrect",
    });
  }

  const isCorrectPassword = await bcrypt.compare(password, user.password);
  if (!isCorrectPassword) {
    return response.status(401).json({
      error: "email or password are incorrect",
    });
  }

  const payload = {
    email: user.email,
    id: user.id,
  };
  const token = jwt.sign(payload, JWT_SECRET);

  response.status(200).send({
    token,
    userInfo: {
      email: user.email,
      id: user.id,
      salary: user.Salary,
      totalBalance: user.balance,
      currency: user.currency,
    },
    message: `Welcome ${user.fullName}`,
  });
});

router.post("/register", async (request, response) => {
  try {
    const hash = await bcrypt.hash(request.body.password, SALT_ROUNDS);
    const model = {
      ...request.body,
      password: hash,
      _id: new mongoose.Types.ObjectId(),
    };

    model.currency = model.currency ? model.currency : "DH";
    const { fullName, _id } = await User.create({ ...model });
    response.status(200).json({
      message: `Account successfully created for ${fullName}, ${_id}`,
    });
  } catch (error) {
    console.error(error);
    response.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
