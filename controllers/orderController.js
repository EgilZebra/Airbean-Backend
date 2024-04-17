const { v4: uuidv4 } = require("uuid");
const { menuData } = require("../controllers/menuController");
const Datastore = require("nedb-promises");
const orderData = new Datastore({
  filename: "./databases/orders.db",
  autoload: true,
});

module.exports = {
  
    post:  async (req, res) => {
        const { userid, cart } = req.body;
        let order = 0;
        let check = [];
        const mymenu = await menuData.find({});
        const date = new Date();
      
        for (const item of cart) {
          const menuItem = mymenu.find(
            (menuItem) =>
              menuItem.title === item.item.title && menuItem.price === item.item.price
          );
          check.push(menuItem);
          console.log("menuitem", menuItem);
        }
      
        try {
          if (check.every(({ element }) => element !== "undefined")) {
            order = {
              ordernumber: uuidv4(),
              user: userid ? userid : "Gäst",
              eta: Math.floor(Math.random() * 31),
              placed: date.toLocaleString() ,
              cart: cart,
            };
      
            await orderData.insert(order);
            res.status(200).json({
              message: "Order sent!",
              placed: date.toLocaleString(),
              eta: order.eta,
              ordernummer: order.ordernumber
            });
          }
        } catch (error) {
          res.status(400).send("Order Failed!");
        }
      },

      get: async ( req, res ) => {
        const ordernumber = req.body.ordernumber;
        console.log(ordernumber)
        
          try {
            if (ordernumber === undefined) {
              res.status(404).send('Faulty request')
            }
      
            const order = await orderData.findOne({ordernumber: ordernumber })
            console.log(order);
            
            if ( order !== null) {
              res.status(200).json({'Your order': order })
            } else {
            res.status(500).send('There are no orders with that id!')
          }
          } catch (error) {
            res.status(500).send('Reqeuest Error!');
          }
      }
}