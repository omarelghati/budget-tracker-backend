const router = require("express").Router();
const Salary = require("../models/Salary");
const User = require("../models/User");
const ObjectId = require("mongoose").Types.ObjectId;

router.get("/", async (_, response) => {
  const id = request.get("x-bm-userId");
  const salaries = await Salary.find({ userId: id });
  response.status(200).json({ salaries });
});

//create salary
router.post("/", async (request, response) => {
  const userId = request.get("x-bm-userId");
  const dbId = new ObjectId();

  const salary = await Salary.create({
    ...request.body,
    userId: userId,
    _id: dbId,
  });

  await User.findByIdAndUpdate(userId, { salary: dbId });
  return response.status(200).json(salary);
});

module.exports = router;
