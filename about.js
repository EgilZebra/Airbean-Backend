const express = require("express");
const Datastore = require("nedb-promises");
const about = express();
about.use(express.json());

const aboutData = new Datastore({
  filename: "./databases/about.db",
  autoload: true,
});
// Denna delen gjorde vi utöver Userstories då vi tyckte det kunde vara najs att kunna hämta information om företaget om man tex inte skulle ha tillgång till figmaskiss. Vi är medvetna om att detta kanske inte är väsentligt men vi körde på :)
about.post("/about", async (req, res) => {
  const { headline, preamble, textOne, textTwo, image, owner, position } =
    req.body;
  const aboutItem = {
    headline,
    preamble,
    textOne,
    textTwo,
    image,
    owner,
    position,
  };
  try {
    const aboutPost = await aboutData.insert(aboutItem);
    res.status(200).json(aboutPost);
  } catch (error) {
    res.status(500).send("Could not add post to database");
  }
});

about.get(`/about`, async (_req, res) => {
  try {
    const aboutGet = await aboutData.find({});
    res.json(aboutGet);
  } catch (error) {
    res.status(404).send("Could not find the page..");
  }
});

module.exports = about;
