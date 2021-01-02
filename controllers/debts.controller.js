const router = require("express").Router();
const Debt = require("../models/Debt");
const User = require("../models/User");
const Month = require("../models/Month");
const ObjectId = require("mongoose").Types.ObjectId;
const Transaction = require("../models/Transaction");

//get all debts
router.get("/", async (_, response) => {
  const userid = _.get("x-bm-userId");
  const debts = await Debt.find({ userId: userid });
  response.status(200).json(debts);
});

//add debt
//pay debt
router.post("/", async (request, response) => {
  const userid = request.get("x-bm-userId");

  const user = await User.findById(userid, "-password");

  const debt = await Debt.create({
    ...request.body,
    userId: userid,
    _id: new ObjectId(),
  });
  if (!user.debtsList) {
    user.debtsList = [];
  }
  user.debtsList.push(debt._id);
  await User.findByIdAndUpdate(userid, { debtsList: user.debtsList });
  return response.status(200).json(debt);
});

router.post("/pay/:id", async (request, response) => {
  const userid = request.get("x-bm-userId");
  const debtId = request.params.id;
  const debt = await Debt.findById(debtId);
  const user = await User.findById(userid);
  const month = await Month.findById(user.currentMonth);

  debt.lastPaidOn = new Date();
  if (!debt.remainingAmount) debt.remainingAmount = debt.initialAmount;
  debt.remainingAmount -= debt.monthlyAmount;

  if (!debt.paymentDatesList) debt.paymentDatesList = [];
  debt.paymentDatesList.push(debt.lastPaidOn);

  if (!month.paidDebtsList) month.paidDebtsList = [];
  month.paidDebtsList.push(debt.id);

  month.balance -= debt.monthlyAmount;

  await Month.findByIdAndUpdate(user.currentMonth, { ...month });
  await Debt.findByIdAndUpdate(debtId, { ...debt });
  return response.status(200).json(month);
});

module.exports = router;
