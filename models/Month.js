const mongoose = require("mongoose");
const timeZone = require("mongoose-timezone");
const Schema = mongoose.Schema;
const ObjectId = mongoose.Types.ObjectId;

const monthSchema = new Schema({
  _id: ObjectId,
  date: Date,
  balance: {
    type: Number,
    default: 0,
  },
  userId: ObjectId,
  transactionsList: [ObjectId],
  paidDebtsList: [ObjectId],
  isClosed: Boolean,
});

monthSchema.set("toJSON", {
  transform: (_, returnedObject) => {
    returnedObject.id = returnedObject._id;
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});
monthSchema.plugin(timeZone);
module.exports = mongoose.model("Month", monthSchema);
