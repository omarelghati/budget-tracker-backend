const router = require("express").Router();
const Transaction = require("../models/Transaction");
const User = require("../models/User");
const Month = require("../models/Month");
const ObjectId = require("mongoose").Types.ObjectId;

router.get("/", async (request, response) => {
  const id = request.get("x-bm-userId");
  const user = await User.findById(id);
  const month = await Month.findById(user.currentMonth);
  const monthIds = user.monthsList.map((x) => ObjectId(x));
  const months = await Month.find({ _id: { $in: monthIds } }, ["date", "id"], {
    sort: {
      amunt: 1, //Sort by Date Added Asc
    },
  });
  let allTransactions = await Transaction.find(
    {
      _id: { $in: month.transactionsList },
    },
    "-userId",
    {
      sort: {
        date: 1, //Sort by Date Added Asc
      },
    }
  );

  return response.status(200).json({ allTransactions, months });
});

router.get("/:month", async (request, response) => {
  const monthId = request.params.month;
  const userId = request.get("x-bm-userId");
  const exists = (await User.findById(userId)).monthsList.includes(monthId);
  if (!exists) return response.status(400).json({ error: "month not found" });
  const month = await Month.findById(monthId);
  const allTransactions = await Transaction.find({
    _id: { $in: month.transactionsList },
  });
  return response.status(200).json({ allTransactions });
});

//add transaction
router.post("/", async (request, response) => {
  const userid = request.get("x-bm-userId");
  const dbId = new ObjectId();
  const user = await User.findById(userid).populate("salary");
  const { date } = request.body;
  const transaction = await Transaction.create({
    ...request.body,
    userId: userid,
    monthId: user.currentMonth,
    _id: dbId,
  });
  let requireNewMonth = false;
  if (user.currentMonth) {
    console.log(transaction.date);
    const month = await Month.findById(user.currentMonth);
    console.log(month);
    if (
      month.date.getMonth() == transaction.date.getMonth() &&
      month.date.getFullYear() == transaction.date.getFullYear()
    ) {
      if (!month.transactionsList) {
        month.transactionsList = [];
      }
      month.transactionsList.push(transaction._id);

      if (transaction.isPaid === true) {
        month.balance -= transaction.amount;
      }
      await Month.findByIdAndUpdate(month._id, {
        transactionsList: month.transactionsList,
        balance: month.balance,
      });
    } else {
      requireNewMonth = true;
    }
  } else {
    requireNewMonth = true;
  }

  const initialAmount = user.salary ? user.salary.amount : 0;
  if (requireNewMonth === true) {
    //create the month with the initial salary value
    const transactionsMonth = await Month.aggregate([
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
          userId: ObjectId(user.id),
        },
      },
    ]);

    if (transactionsMonth.length === 0) {
      return response
        .status(400)
        .json({ error: "Please create a month for this transaction's date" });
    }
  }
  return response.status(200).json(transaction);
});

router.put("/", async (request, response) => {
  const userid = request.get("x-bm-userId");
  const newTransaction = { ...request.body };
  console.log(request.body);
  const oldTransaction = await Transaction.findOne({
    _id: request.body.id,
    userId: userid,
  });
  if (!oldTransaction)
    return response.status(400).json({ error: "Transaction not found" });

  if (oldTransaction.isPaid == false && newTransaction.isPaid == true) {
    const month = await Month.findById(oldTransaction.monthId);
    month.balance -= oldTransaction.amount;
    await Month.findByIdAndUpdate(month.id, { balance: month.balance });
  } else if (oldTransaction.isPaid == true && newTransaction.isPaid == false) {
    const month = await Month.findById(oldTransaction.monthId);
    month.balance += oldTransaction.amount;
    await Month.findByIdAndUpdate(month.id, { balance: month.balance });
  }

  await Transaction.findByIdAndUpdate(oldTransaction.id, newTransaction);
  return response.status(200).json(newTransaction);
});

module.exports = router;
