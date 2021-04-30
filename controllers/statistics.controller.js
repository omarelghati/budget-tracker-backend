const router = require("express").Router();
const Transaction = require("../models/Transaction");
const User = require("../models/User");
const Month = require("../models/Month");
const ObjectId = require("mongoose").Types.ObjectId;
const Debt = require("../models/Debt");

router.get("/monthly", async (request, response) => {
  //get current month from user
  //get list of transactions
  //get debts
  //classify transactions to paid and unpaid.
  //classify debts paid on this month or not yet.
  const id = request.get("x-bm-userId");
  const user = await User.findById(id).populate("salary");
  const month = await Month.findById(user.currentMonth);
  const firstOfMonth = new Date(
    month.date.getFullYear(),
    month.date.getMonth(),
    1
  );
  const transactionIds = month.transactionsList;
  const allTransactions = (
    await Transaction.find({
      _id: { $in: transactionIds },
    })
  ).filter((x) => x.debtId == null);
  const debtIds = user.debtsList.map((x) => new ObjectId(x));
  let allUserDebts = await Debt.find({ _id: { $in: debtIds } });
  if (!(allUserDebts instanceof Array)) allUserDebts = [allUserDebts];
  let json = {
    allTransactions: allTransactions.map((x) => {
      return {
        description: x.description,
        monthlyAmount: x.monthlyAmount,
      };
    }),
    unpaidDebts: [],
    paidDebts: [],
  };

  if (allUserDebts && allUserDebts.length !== 0) {
    const paidDebts = allUserDebts
      .filter((x) => x.lastPaidOn >= firstOfMonth)
      .map((x) => {
        return {
          description: x.description,
          monthlyAmount: x.monthlyAmount,
        };
      });
    const unpaidDebts = allUserDebts
      .filter((x) => !x.lastPaidOn || x.lastPaidOn < firstOfMonth)
      .map((x) => {
        return {
          description: x.description,
          monthlyAmount: x.monthlyAmount,
        };
      });

    json = {
      ...json,
      paidDebts,
      unpaidDebts,
      remainingBalance: month.balance,
      salary: user.salary.amount,
    };
  }
  return response.status(200).json(json);
});

module.exports = router;
