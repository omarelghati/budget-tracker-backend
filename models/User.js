const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const ObjectId = mongoose.Types.ObjectId;

const userSchema = new Schema({
  _id: ObjectId,
  fullName: String,
  email: String,
  password: String,
  salary: {
    type: ObjectId,
    ref: "Salary",
  },
  balance: {
    type: Number,
    default: 0,
  },
  currency: String,
  monthsList: Array,
  debtsList: Array,
  categoriesList: Array,
  balanceLastUpdated: Date,
  currentMonth: {
    type: mongoose.Types.ObjectId,
    ref: "Month",
  },
});

userSchema.set("toJSON", {
  transform: (_, returnedObject) => {
    returnedObject.id = returnedObject._id;
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

module.exports = mongoose.model("User", userSchema);
