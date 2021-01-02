const router = require("express").Router();
const Category = require("../models/Category");
const User = require("../models/User");
const ObjectId = require("mongoose").Types.ObjectId;

router.get("/", async (_, response) => {
  const categories = await Category.find();
  response.status(200).json({ categories });
});

//create category
router.post("/", async (request, response) => {
  const { title } = request.body;
  const id = request.get("x-bm-userId");
  const category = await Category.findOne({ title, userId: id });
  if (category) {
    return response.status(400).json({
      error: "there's a category with the same title",
    });
  }
  const dbId = new ObjectId();
  const payload = {
    userId: id,
    title: title,
    _id: dbId,
  };
  const { item } = await Category.create(payload);
  const user = await User.findById(id);
  if (!user.categoriesList) user.categoriesList = [];
  user.categoriesList.push(payload._id);
  await User.findByIdAndUpdate(id, { categoriesList: user.categoriesList });
  return response.status(200).json(item);
});

//update category
router.delete("/", async (request, response) => {
  const { categoryId } = request.body;
  const userId = request.get("x-bm-userId");
  const category = await Category.findByIdAndDelete(categoryId);
  return response.status(200).json(category);
});

module.exports = router;
