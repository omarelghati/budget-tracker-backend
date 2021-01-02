const mongoose = require("mongoose");
const timeZone = require("mongoose-timezone");
const Schema = mongoose.Schema;
const ObjectId = mongoose.Types.ObjectId;
const debtSchema = new Schema({
  _id: ObjectId,
  description: String,
  initialAmount: Number,
  remainingAmount: Number,
  monthlyAmount: Number,
  paymentDatesList: [Date],
  lastPaidOn: Date,
  userId: ObjectId,
});
debtSchema.plugin(timeZone);
debtSchema.set("toJSON", {
  transform: (_, returnedObject) => {
    returnedObject.id = returnedObject._id;
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

module.exports = mongoose.model("Debt", debtSchema);
