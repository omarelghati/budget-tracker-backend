const router = require("express").Router();
const Month = require("../models/Month");
const User = require("../models/User");
const ObjectId = require("mongoose").Types.ObjectId;

router.get("/", async (_, response) => {
  const months = await Month.find();
  response.status(200).json({ months });
});

//create month
router.post("/", async (request, response) => {
  let { date } = request.body;
  const dateObject = new Date(date);
  console.log(dateObject);
  const userId = request.get("x-bm-userId");
  const user = await User.findById(userId).populate("salary");
  const month = await Month.aggregate([
    {
      $project: {
        userId: "$userId",
        year: { $year: "$date" },
        month: { $month: "$date" },
      },
    },
    {
      $match: {
        month: new Date(date).getMonth() + 1,
        year: new Date(date).getFullYear(),
        userId: ObjectId(user._id),
      },
    },
  ]);
  if (month.length > 0) {
    return response.status(400).json({
      error:
        "There's a month with the same period, please enter another period or use the existing month",
    });
  }
  if (user.currentMonth) {
    const userMonth = await Month.findById(user.currentMonth);
    if (!userMonth.isClosed)
      return response
        .status(400)
        .json({ error: "Please close last month in order to start a new one" });
  }
  const dbId = new ObjectId();

  const payload = {
    _id: dbId,
    userId: userId,
    balance: user.salary.amount,
    date: new Date(
      Date.UTC(dateObject.getFullYear(), dateObject.getMonth(), 1)
    ),
  };

  //check if the month created is the latest
  if (user.currentMonth) {
    const currentMonth = await Month.findById(user.currentMonth);
    if (currentMonth.date < payload.date) {
      user.currentMonth = payload._id;
      user.balance += currentMonth.balance;
    }
    if (!user.monthsList) user.monthsList = [];
    user.monthsList.push(payload._id);
  } else {
    user.currentMonth = payload._id;
    if (!user.monthsList) user.monthsList = [];
    user.monthsList.push(payload._id);
  }
  // await User.updateOne(user);
  await Month.create(payload);
  await User.findByIdAndUpdate(userId, user);
  return response.status(200).json(payload);
});

router.post("/close/:id", async (request, response) => {
  const userId = request.get("x-bm-userId");
  const user = await User.findById(userId);
  const monthId = request.params.id;
  let month = await Month.findById(monthId);
  if (!month) {
    return response.status(400).json({ error: "month not found" });
  }
  if (String(month.userId) !== String(userId)) {
    console.log("something");
    return response
      .status(400)
      .json({ error: "month doesn't belong to this user" });
  }
  user.balance += month.balance;
  console.log(user);
  await User.findByIdAndUpdate(userId, { balance: user.balance });
  await Month.findByIdAndUpdate(monthId, { isClosed: true });
  return response.status(200).json(month);
});
//update Month
//TODO: refactor this
router.put("/", async (request, response) => {
  const { date } = request.body;
  const id = request.get("x-bm-userId");
  const month = await Month.findOne({ date, _id: ObjectId(_id) });
  if (month) {
    return response.status(400).json({
      error:
        "There's a month with the same period, please enter another period or use the existing month",
    });
  }
  const payload = {
    userId: id,
    _id,
    title,
  };

  await Month.updateOne({ ...payload });
  return response.status(200);
});

module.exports = router;
