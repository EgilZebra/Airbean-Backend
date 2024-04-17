const express = require("express");
const Datastore = require("nedb-promises");
const about = express();
const aboutController = require('../controllers/aboutcontroller')
const route = express.Router()

route.use(express.json());


// Denna delen gjorde vi utöver Userstories då vi tyckte det kunde vara najs att kunna hämta information om företaget om man tex inte skulle ha tillgång till figmaskiss. Vi är medvetna om att detta kanske inte är väsentligt men vi körde på :)
route.post("/about", aboutController.post);

route.get(`/about`, aboutController.get), 

module.exports = route;
