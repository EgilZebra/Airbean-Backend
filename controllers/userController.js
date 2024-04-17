const { v4: uuidv4 } = require("uuid");
const Datastore = require("nedb-promises");
const usersData = new Datastore({
    filename: "./databases/users.db",
    autoload: true,
  });

module.exports = {
    post: async (req, res) => {
        const user = {
          username: req.body.username,
          email: req.body.email,
          password: req.body.password,
          userid: uuidv4(),
        };
      
        try {
          const checkUsername = await usersData.findOne({ user: user.username });
          if (checkUsername) {
            res.status(406).send("Username taken, try again!");
            return;
          }
          if (!user.username) {
            res.status(400).send("You must write an username!");
            return;
          }
          if (!user.email) {
            res.status(400).send("You must write an email!");
            return;
          }
          if (!user.password) {
            res.status(400).send("You must add a password!");
            return;
          } else {
            usersData.insert(user);
            res.status(201).json({ userid: user.userid, message: "User created!" });
          }
        } catch (error) {
          res.status(400).send("Cannot create user, sorry!");
        }
      },

      get: async (req, res) => {
        const { username, password } = req.body;
      
        try {
          const myuser = await usersData.findOne({
            username: username,
            password: password,
          });
      
          if (myuser) {
            res.json({
              userid: myuser.userid,
              message: "Login achieved",
              success: true,
            });
          } else {
            res.json({ message: "Login failed" });
            return;
          }
        } catch (error) {
          res.status(400).json({ message: "User does not exist" });
        }
      }
}