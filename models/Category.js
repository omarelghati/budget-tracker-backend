const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = mongoose.Types.ObjectId;

const categorySchema = new Schema({
  _id: ObjectId,
  title: String,
  userId: {
    type: ObjectId,
    ref: "User",
  },
  isActive: Boolean,
});

categorySchema.set("toJSON", {
  transform: (_, returnedObject) => {
    returnedObject.id = returnedObject._id;
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

module.exports = mongoose.model("Category", categorySchema);
