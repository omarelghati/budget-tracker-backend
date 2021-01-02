const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = mongoose.Types.ObjectId;

const salarySchema = new Schema({
  _id: ObjectId,
  company: String,
  amount: Number,
  userId: ObjectId,
});

salarySchema.set("toJSON", {
  transform: (_, returnedObject) => {
    returnedObject.id = returnedObject._id;
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

module.exports = mongoose.model("Salary", salarySchema);
