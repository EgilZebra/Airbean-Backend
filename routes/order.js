const express = require("express");
const orderController = require("../controllers/orderController");
const route = express.Router()

route.post("/order", orderController.post);
route.get('/order/status', orderController.get )

module.exports = route;