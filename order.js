const express = require("express");
const Datastore = require("nedb-promises");
const { v4: uuidv4 } = require("uuid");

const { menuData } = require("./menu.js");

const order = express();

const orderData = new Datastore({
  filename: "./databases/orders.db",
  autoload: true,
});

order.use(express.json());

// Lägga en Order
order.post("/order", async (req, res) => {
  const { userid, cart } = req.body;

  let order = 0;
  let check = [];
  const mymenu = await menuData.find({});

  for (const item of cart) {
    const menuItem = mymenu.find(
      (menuItem) =>
        menuItem.title === item.item.title && menuItem.price === item.item.price
    );
    check.push(menuItem);
    console.log("menuitem", menuItem);
  }

  try {
    if (check.every(({ element }) => element !== "undefined")) {
      order = {
        ordernumber: uuidv4(),
        user: userid ? userid : "Gäst",
        eta: Math.floor(Math.random() * 30),
        cart: cart,
      };

      await orderData.insert(order);
      res.status(200).json({
        message: "Order sent!",
        eta: order.eta,
        ordernummer: order.ordernumber,
      });
    }
  } catch (error) {
    res.status(400).send("Order misslyckades!");
  }
});

module.exports = order;
