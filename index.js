const express = require('express');
const Datastore = require('nedb-promises')
const { v4: uuidv4 } = require('uuid');

const app = express();
const menu = new Datastore( { filename:'meny.db', autoload: true } );
const about = new Datastore( { filename:'about.db', autoload: true });
const users = new Datastore( { filename:'users.db', autoload: true });
const orders = new Datastore( { filename:'orders.db', autoload: true });

app.use(express.json());

const menyItems = [
      {
        "id":1,
        "title":"Bryggkaffe",
        "desc":"Bryggd på månadens bönor.",
        "price":39
      },
      {
        "id":2,
        "title":"Caffè Doppio",
        "desc":"Bryggd på månadens bönor.",
        "price":49
      },
      {
        "id":3,
        "title":"Cappuccino",
        "desc":"Bryggd på månadens bönor.",
        "price":49
      },
      {
        "id":4,
        "title":"Latte Macchiato",
        "desc":"Bryggd på månadens bönor.",
        "price":49
      },
      {
        "id":5,
        "title":"Kaffe Latte",
        "desc":"Bryggd på månadens bönor.",
        "price":54
      },
      {
        "id":6,
        "title":"Cortado",
        "desc":"Bryggd på månadens bönor.",
        "price":39
      }
    ]
  

const aboutItems = {
    "headline": "Vårt Kaffe",
    "preamble": "Pumpkin spice mug, barista cup, sit macchiato, kopi-luwak, doppio, grounds dripper, crema, strong whipped, variety extra iced id lungo half and half mazagran. Pumpkin spice.",
    "textOne": "Que dark fair trade, spoon decaffeinated, barista wings whipped, as rich aftertaste, con panna milk black, arabica white rich beans single shot extra affogato. So affogato macchiato sit extraction instant grinder seasonal organic, turkish single shot, single origin, and robusta strong to go so dripper. Viennese froth, grounds caramelization skinny aromatic cup kopi-luwak, fair trade flavour, frappuccino medium, café au lait flavour cultivar ut bar instant kopi-luwak.",
    "textTwo": "Roast id macchiato, single shot siphon mazagran milk fair trade est aroma a half and half and, so, galão iced to go, whipped as cream cup pumpkin spice iced. At extra, rich grinder, brewed to go, steamed half and half at, that, percolator macchiato trifecta and body as arabica dripper. In galão black java milk sit trifecta, robusta, acerbic café au lait instant shop latte. Seasonal bar shop filter aroma id, crema, affogato viennese cultivar aftertaste, seasonal, percolator cream black, galão flavour, milk aromatic turkish skinny crema.",
    "image": "https://s3-alpha-sig.figma.com/img/8ff1/b748/d1177c85c176f0becf9820b16e06ef74?Expires=1713744000&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=LEf393vSSL5a2GXK~i0wO7TOVOvUoCuo9nl4ZWmZUF6vUrTN3ra3n1C6paS-f4SviAAgbIKjRHBkqLmtaxGOFbgEuvfmuewjoFpbA4mEJB65CRM77T4egUf2dMbFiwGshh~9Iu6IZ6czfwUNxaq3lKV3uChci4s7NWL1ekt4clhpyYnOdSD8EOw4zoiIvYjwEUuTakThYqWivTEIG3B3xUo0X07RJJeujfdFHZmd4bEedeObGrLXNFldSmv6XXcz5V6Qb7ZGGd0~1ZIbe8tV3dzHQEO9aZoxR4n6ExrKsplmNTg1-XrtLbzFLCSbODm77~9gG9EqZExXtcysYnNwjA__",
    "owner": "Eva Cortado",
    "position": "VD & Grundare"
}


const PORT = 9001;
const URL = '127.0.0.1';

const server = app.listen(PORT, URL, () => {
    console.log('Hej jag är en server!');
})


//Menu
app.post( '/meny', async ( req, res ) => {
    const { title, desc, price } = req.body;
    const menyItem = { title, desc, price };
    try {
        const menyPost = await menu.insert(menyItem);
        res.status(200).json(menyPost);
    } catch (error) {
        res.status(500).send('Gick inte att skapa databas!');
    }
});

app.get( `/meny`, async ( req, res ) => {
    try {
        const menyGet = await menu.find({});
        res.json(menyGet);
    } catch (error) {
        res.status(404).send('Meny finns inte!');
    }
   
});


// About
app.post( '/about', async ( req, res ) => {
    const { headline, preamble, textOne, textTwo, image, owner, position  } = req.body;
    const aboutItem = {  headline, preamble, textOne, textTwo, image, owner, position  };
    try {
        const aboutPost = await about.insert(aboutItem);
        res.status(200).json(aboutPost);
    } catch (error) {
        res.status(500).send('Gick inte att skapa databas!');
    }
});

app.get( `/about`, async ( req, res ) => {
    try {
        const aboutGet = await about.find({});
        res.json(aboutGet);
    } catch (error) {
        res.status(404).send('Aboute finns inte!');
    }
   
});

// Konto och Login
app.post( '/user/create', async ( req, res ) => {
    const user = { 
        username: req.body.username, 
        email: req.body.email,
        password: req.body.password, 
        userid: uuidv4() 
    };
    try {
        users.insert(user)
        res.status(201).json( { userid: user.userid, message: 'User created!' } );
    } catch (error) {
        res.status(400).send('Cannot create user, sorry!');
    }
})

app.get( '/user/login', async ( req, res ) => {
    const { username, password } = req.body;

    try {
       const myuser = await users.findOne({ username: username, password: password } );

       if (myuser) {
        res.json({ userid: myuser.userid, message: 'Login achieved', success: true});
       } else {
        res.json({ message: 'Login failed'});
        return
       }
    } catch (error) {
        res.status(400).json({message:'User does not exist'});
    }

})

// Lägga en Order
app.post( '/order', async ( req, res ) => {
    const { userid, cart } = req.body

    
        console.log(cart);
        let order = 0;

        const check = cart.map(( cartItem ) => {
            return menu.find(({ title, price }) => title === cartItem.item.title && price === cartItem.item.price)  })
        
        if (check.every(element => typeof element !== 'undefined')) {
                order = {
                    ordernumber: uuidv4(),
                    user: userid ? userid : 'Gäst',
                    eta: Math.floor(Math.random() * 30),
                    cart: cart
                    };
    
                    await orders.insert(order)
                    console.log(order);
        }

        console.log(check)

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
        
        res.status(200).json({ message: 'Order sent!', eta: order.eta, ordernummer: order.ordernumber });
    } catch (error) {
        res.status(400).send('Order misslyckades!')
    }}
)

