const express = require("express");
const menuController = require('../controllers/menuController')

const route = express.Router()

route.get("/menu", menuController.get );
route.post("/menu/add", menuController.post );

module.exports = route;