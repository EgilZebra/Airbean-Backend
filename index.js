const express = require("express");

//modules
const about = require("./about.js");
const { menu } = require("./menu.js");
const user = require("./user.js");
const order = require("./order.js");

const app = express();

app.use(express.json());
app.use("/api", about);
app.use("/api", menu);
app.use("/api", user);
app.use("/api", order);

const PORT = 9001;
const URL = "127.0.0.1";

const server = app.listen(PORT, URL, () => {
  console.log("Hej jag är en server!");
});