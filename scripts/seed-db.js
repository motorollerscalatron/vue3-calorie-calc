const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const foodSchema = new Schema({}, { strict: false });
const FoodModel = mongoose.model("food", foodSchema, "food");
const data = require("../src/dummy_data/food_display_table.json");
mongoose.connect(
  `mongodb+srv://masahiro:${process.env.MONGO_USER_PASSWORD}@cluster0.gcvy4.mongodb.net/${process.env.MONGO_DB_NAME}?retryWrites=true&w=majority`,
  { useNewUrlParser: true }
);

console.log(data.Food_Display_Table.Food_Display_Row);
const foodData = data.Food_Display_Table.Food_Display_Row;

(async () => {
  const result = await FoodModel.insertMany(foodData);
  console.log("result", result);
})();
