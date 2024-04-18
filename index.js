const express = require("express");

//modules
const about = require("./routes/about.js");
const menu = require("./routes/menu.js");
const user = require("./routes/user.js");
const order = require("./routes/order.js");

const app = express();

app.use(express.json());
app.use("/api", about);
app.use("/api", menu);
app.use("/api", user);
app.use("/api", order);

const PORT = 9001;
const URL = "127.0.0.1";

app.listen(PORT, URL, () => {
  console.log("Airbean loaded!");
});