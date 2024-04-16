const express = require("express");
const Datastore = require("nedb-promises");

const menuData = new Datastore({
  filename: "./databases/menu.db",
  autoload: true,
});

const menu = express();
menu.use(express.json());
//Menu
menu.get("/menu", async (_req, res) => {
  try {
    const menuItems = await menuData.find({});
    if (menuItems.length === 0) {
      res.status(404).send("No menu items found");
    } else {
      res.status(200).json(menuItems);
    }
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
});

menu.post("/menu/add", async (req, res) => {
  const menuItem = {
    title: req.body.title,
    desc: req.body.desc,
    price: req.body.price,
  };
  try {
    const checkDuplicate = await menuData.findOne({ title: menuItem.title });
    if (checkDuplicate) {
      res.status(406).send("Item already exists in menu");
      return;
    }
    if (!menuItem.title || !menuItem.desc || !menuItem.price) {
      res.status(400).send("All fields (title, desc, price) are required");
      return;
    } else {
      const newItem = await menuData.insert(menuItem);
      res.status(200).json(newItem);
    }
  } catch (error) {
    res.status(500).send("Server error");
  }
});

module.exports = { menu, menuData };
