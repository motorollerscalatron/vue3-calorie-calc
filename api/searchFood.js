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

  const result = await Promise.all(
    // Loop through queries and for each return a promise
    // so that the Promise.all method receives an array of promises
    // as an argument
    data.queries.map((query) => {
      return new Promise((resolve) => {
        // Use an Immediately Invoked Function Expression (IIFE) so we can use async/await
        (async () => {
          // Get items for the query
          const items = await FoodModel.find({
            Display_Name: {
              $regex: query, // for real application we might be able to improve the performance by replacing regex with other methods like elasticsearch
              $options: "i",
            },
          });
          // Resolve with an object that has a query with data
          resolve({
            query,
            items,
          });
        })();
      });
    })
  );

  res.send({
    data: result,
  });
};
