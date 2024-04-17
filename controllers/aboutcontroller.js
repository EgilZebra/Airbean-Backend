const Datastore = require("nedb-promises");

const aboutData = new Datastore({
    filename: "./databases/about.db",
    autoload: true,
  });

module.exports = {
    get: async (_req, res) => {
        try {
          const aboutGet = await aboutData.find({});
          res.json(aboutGet);
        } catch (error) {
          res.status(404).send("Could not find the page..");
        }
      },
    post: async (req, res) => {
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
      }

}