const express = require("express");
const bodyParser = require("body-parser");
const app = express();

app.use(bodyParser.json());

const User = require("./routes/User");
const Expense = require("./routes/Expense");
const Category = require("./routes/Category");

app.use("/api/users", User);
app.use("/api/expenses", Expense);
app.use("/api/categories", Category);

const server = app.listen(process.env.PORT || 8080, function() {
  const { address, port } = server.address();
  console.log(`Server listening at http://${address}:${port}`);
});
