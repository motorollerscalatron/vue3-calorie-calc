const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const foodSchema = new Schema({}, { strict: false });
const FoodModel = mongoose.model("food", foodSchema, "food");

mongoose.connect(
  `mongodb+srv://masahiro:${process.env.MONGO_USER_PASSWORD}@cluster0.gcvy4.mongodb.net/${process.env.MONGO_DB_NAME}?retryWrites=true&w=majority`,
  { useNewUrlParser: true }
);

module.exports = async (req, res) => {
  console.log("body", req.body);
  const data = JSON.parse(req.body);
  console.log("in fetch data", data.queries);
  console.log("text?", data.queries[0]);

  const items = await FoodModel.find({
    Display_Name: {
      $regex: data.queries.join("|"),
    },
  });
  console.log("items", items);
  // await item.save();
  res.send({
    items,
  });
};
