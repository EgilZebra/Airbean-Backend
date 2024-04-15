const express = require("express");
const Datastore = require("nedb-promises");
const { v4: uuidv4 } = require("uuid");

const app = express();
const menu = new Datastore({ filename: "meny.db", autoload: true });
const about = new Datastore({ filename: "about.db", autoload: true });
const users = new Datastore({ filename: "users.db", autoload: true });
const orders = new Datastore({ filename: "orders.db", autoload: true });

app.use(express.json());

const menyItems = [
  {
    id: 1,
    title: "Bryggkaffe",
    desc: "Bryggd på månadens bönor.",
    price: 39,
  },
  {
    id: 2,
    title: "Caffè Doppio",
    desc: "Bryggd på månadens bönor.",
    price: 49,
  },
  {
    id: 3,
    title: "Cappuccino",
    desc: "Bryggd på månadens bönor.",
    price: 49,
  },
  {
    id: 4,
    title: "Latte Macchiato",
    desc: "Bryggd på månadens bönor.",
    price: 49,
  },
  {
    id: 5,
    title: "Kaffe Latte",
    desc: "Bryggd på månadens bönor.",
    price: 54,
  },
  {
    id: 6,
    title: "Cortado",
    desc: "Bryggd på månadens bönor.",
    price: 39,
  },
];

const PORT = 9001;
const URL = "127.0.0.1";

const server = app.listen(PORT, URL, () => {
  console.log("Hej jag är en server!");
});

//Menu
app.get("/meny", async (_req, res) => {
  try {
    const menuItems = await menu.find({});
    if (menuItems.length === 0) {
      res.status(404).send("No menu items found");
    } else {
      res.status(200).json(menuItems);
    }
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
});

app.post("/meny/add", async (req, res) => {
  const menuItem = {
    title: req.body.title,
    desc: req.body.desc,
    price: req.body.price,
  };
  try {
    const checkDuplicate = await menu.findOne({ title: menuItem.title });
    if (checkDuplicate) {
      res.status(406).send("Item already exists in menu");
      return;
    }
    if (!menuItem.title || !menuItem.desc || !menuItem.price) {
      res.status(400).send("All fields (title, desc, price) are required");
      return;
    } else {
      const newItem = await menu.insert(menuItem);
      res.status(200).json(newItem);
    }
  } catch (error) {
    res.status(500).send("Server error");
  }
});

// Denna delen gjorde vi utöver Userstories då vi tyckte det kunde vara najs att kunna hämta information om företaget om man tex inte skulle ha tillgång till figmaskiss. Vi är medvetna om att detta kanske inte är väsentligt men vi körde på :)
app.post("/about", async (req, res) => {
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
    const aboutPost = await about.insert(aboutItem);
    res.status(200).json(aboutPost);
  } catch (error) {
    res.status(500).send("Could not add post to database");
  }
});

app.get(`/about`, async (_req, res) => {
  try {
    const aboutGet = await about.find({});
    res.json(aboutGet);
  } catch (error) {
    res.status(404).send("Could not find the page..");
  }
});

// Konto och Login
app.post("/user/signup", async (req, res) => {
  const user = {
    username: req.body.username,
    email: req.body.email,
    password: req.body.password,
    userid: uuidv4(),
  };

  try {
    const checkUsername = await users.findOne({ user: user.username });
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
      users.insert(user);
      res.status(201).json({ userid: user.userid, message: "User created!" });
    }
  } catch (error) {
    res.status(400).send("Cannot create user, sorry!");
  }
});

app.get("/user/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const myuser = await users.findOne({
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
});

// Lägga en Order
app.post("/order", async (req, res) => {
  const { userid, cart } = req.body;

  console.log(cart);
  let order = 0;

  const check = cart.map((cartItem) => {
    return menu.find(
      ({ title, price }) =>
        title === cartItem.item.title && price === cartItem.item.price
    );
  });

  if (check.every((element) => typeof element !== "undefined")) {
    order = {
      ordernumber: uuidv4(),
      user: userid ? userid : "Gäst",
      eta: Math.floor(Math.random() * 30),
      cart: cart,
    };

    await orders.insert(order);
    console.log(order);
  }

  console.log(check);

  // for ( let i = 0; i < cart.length; i++ ) {
  //     for( let j = 0; j < menyItems.length; j++ ) {
  //         if ( menyItems[j].title == cart[i].item.title && menyItems[j].price == cart[i].item.price) {
  //             console.log('YES')
  //               order = {
  //                 ordernumber: uuidv4(),
  //                 user: userid ? userid : 'Gäst',
  //                 eta: Math.floor(Math.random() * 30),
  //                 cart: cart
  //                 }

  //             await orders.insert(order)
  //             console.log(order);
  //             }
  //             }}

  try {
    res.status(200).json({
      message: "Order sent!",
      eta: order.eta,
      ordernummer: order.ordernumber,
    });
  } catch (error) {
    res.status(400).send("Order misslyckades!");
  }
});

app.get("/user/orderhistory", async (req, res) => {
  const { userid } = req.body;

  if (
    !(
      userid === "Gäst" ||
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/.test(
        userid
      )
    )
  ) {
    res.status(404).send("Wrong userID, must be UUID or (Gäst)");
    return;
  }

  try {
    const orderHistory = await orders.find({ user: userid });
    if (orderHistory.length === 0) {
      res.status(404).send("No users found with this userID");
    } else {
      res.status(200).json(orderHistory);
    }
  } catch (error) {
    res.status(500).send("Server error while fetching order history");
  }
});
