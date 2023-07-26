import express from 'express'
import config from './db/config.js';
import routes from './routes/route.js';
import jwt from 'jsonwebtoken';
import cors from 'cors';
import path from 'path'
import { fileURLToPath } from 'url';
import {resolve} from 'path'
import stripe  from 'stripe';
import bodyParser from 'body-parser';


// Get the directory path of the current module
const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);

const app = express();
//middleware - executed before routes
app.use(express.json());//middleware for accepting data from the frontend
app.use(express.urlencoded({ extended: true}));
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true}));
app.use('/public',express.static('public'))


//jwt middleware for loginRequired(user)
app.use((req, res, next) => {
    if (req.headers && req.headers.authorization && req. headers.authorization.split (' ')[0] === 'JWT') { //first item to be passed in the token should be jwt-sql injection restriction --in login(userController)
        jwt.verify(req.headers.authorization.split(' ')[1], config.jwt_secret, (err, decode) => { //take the rest in the string array then match it with the alg (in config.jwt_secret) and decode if there's an error throw it
            if (err) req.user = undefined;
            req.user = decode; //if there's no error decode- callback function
            next();
        })
    } else { 
        req.user = undefined;
        next();
    }

})


const Stripe = new stripe('sk_test_51NVI3GJLwJLu0Jfmlcrdge2wdm5zJikJHiIKZ5pSO4u0hueTBXTx8ON4KOOAmeZUIUSTKpJynEZVQcFbw6meMC5800lOmB3FF0', {
  apiVersion: '2022-08-01',
});
app.post("/create-payment-intent", async (req, res) => {
    try {
      const paymentIntent = await Stripe.paymentIntents.create({
        currency: "EUR",
        amount: 1999,
        automatic_payment_methods: { enabled: true },
      });
  
      // Send publishable key and PaymentIntent details to client
      res.send({
        clientSecret: paymentIntent.client_secret,
      });
    } catch (e) {
      return res.status(400).send({
        error: {
          message: e.message,
        },
      });
    }
  });
  
  
app.get("/config", (req, res) => {
    res.send({
      publishableKey: 'pk_test_51NVI3GJLwJLu0JfmUJR4YAk3YfKnY3WEn5z0BdO825TRzqxTzeJcMLMltJCX6tOb5hVblXJgejwaqVCb38OkC2vQ008N7pR4jT',
    });
  });
  
  


  

app.use((req, res, next) => {
    if (req.headers && req.headers.authorization && req. headers.authorization.split (' ')[0] === 'JWT') { 
        jwt.verify(req.headers.authorization.split(' ')[1], config.jwt_secret, (err, decode) => {
            if (err) req.admin = undefined;
            req.admin = decode;
            next();
        })
    } else { 
        req.admin = undefined;
        next();
    }

})

//route
routes(app);


app.get("/", (req, res) => {
    res.send("welcome to my E-commerce API")
});

app.listen(config.port, () => {
    console.log(`server is running on ${config.url}`);
});