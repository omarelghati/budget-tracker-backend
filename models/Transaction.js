const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = mongoose.Types.ObjectId;

const transactionSchema = new Schema({
  _id: ObjectId,
  date: Date,
  description: String,
  amount: Number,
  monthId: ObjectId,
  categoryId: ObjectId,
  isPaid: Boolean,
  userId: ObjectId,
});

transactionSchema.set("toJSON", {
  transform: (_, returnedObject) => {
    returnedObject.id = returnedObject._id;
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

module.exports = mongoose.model("Transaction", transactionSchema);
