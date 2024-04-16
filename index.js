const express = require("express");
const Datastore = require("nedb-promises");
const { v4: uuidv4 } = require("uuid");

//modules
const about = require("./about.js");
const menu = require("./menu.js");
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

// // Lägga en Order
// app.post("/order", async (req, res) => {
//   const { userid, cart } = req.body;

//   let order = 0;
//   let check = [];
//   const mymenu = await menu.find({});

//   for (const item of cart) {
//     const menuItem = mymenu.find(
//       (menuItem) =>
//         menuItem.title === item.item.title && menuItem.price === item.item.price
//     );
//     check.push(menuItem);
//     console.log("menuitem", menuItem);
//   }

//   try {
//     if (check.every(({ element }) => element !== "undefined")) {
//       order = {
//         ordernumber: uuidv4(),
//         user: userid ? userid : "Gäst",
//         eta: Math.floor(Math.random() * 30),
//         cart: cart,
//       };

//       await orders.insert(order);
//       res.status(200).json({
//         message: "Order sent!",
//         eta: order.eta,
//         ordernummer: order.ordernumber,
//       });
//     }
//   } catch (error) {
//     res.status(400).send("Order misslyckades!");
//   }
// });
