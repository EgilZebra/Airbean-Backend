const express = require("express");
const orderController = require("../controllers/orderController");
const route = express.Router()


// Lägga en Order
route.post("/order", orderController.post);

route.get('/order/status', orderController.get )

module.exports = route;