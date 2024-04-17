const express = require("express");
const aboutController = require('../controllers/aboutcontroller')
const route = express.Router()

route.post("/about", aboutController.post);
route.get(`/about`, aboutController.get), 

module.exports = route;