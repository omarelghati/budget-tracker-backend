const router = require("express").Router();
const Category = require("../models/Category");
const User = require("../models/User");
const ObjectId = require("mongoose").Types.ObjectId;

router.get("/", async (request, response) => {
  const userId = request.get("x-bm-userId");
  const user = await User.findById(userId);
  if (!user) {
    return response.status(200).json({ error: "user not found" });
  }
  console.log(user.categoriesList);
  if (!user.categoriesList) {
    return response.status(200).json({ error: "this user has no categories" });
  }

  const categoryIds = user.categoriesList.map((x) => ObjectId(x));
  const categories = await Category.find({ _id: { $in: categoryIds } });
  return response.status(200).json({ categories });
});

//create category
router.post("/", async (request, response) => {
  const { title } = request.body;
  const id = request.get("x-bm-userId");
  let category = await Category.findOne({ title, userId: id });
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
  category = await Category.create(payload);
  const user = await User.findById(id);
  if (!user.categoriesList) user.categoriesList = [];
  user.categoriesList.push(payload._id);
  await User.findByIdAndUpdate(id, { categoriesList: user.categoriesList });
  return response.status(200).json({ category });
});

//update category
router.delete("/", async (request, response) => {
  const { categoryId } = request.body;
  const userId = request.get("x-bm-userId");
  const category = await Category.findByIdAndDelete(categoryId);
  return response.status(200).json(category);
});

module.exports = router;
