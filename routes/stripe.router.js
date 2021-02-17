const express = require("express");
const router = express.Router();
const stripe = require("stripe")("sk_test_51IBgegFmgEKSMttvzeuVfo8svBnfICMyk6ipU9Lpdqa68mzOag2A6KRWZeDJO4hriDwlPsuM1eQJaBFq2g5HEIbG00da23PqIm")
const createError = require("http-errors");
const nodemailer = require("nodemailer");
const {email} = require('../helpers/email-template')



const uuid = require('uuid');
const { getMaxListeners } = require("../app");
const User = require("../models/user.model")


router.post("/details", (req, res, next)=>{
    const {_id} = req.session.currentUser
    const {name, building, city, street, postcode, country} = req.body

    const address = {
        building, city, street, postcode, country
    }
    console.log(address)

    User.findByIdAndUpdate(_id, {address:address, name:name}).then((userUpdated)=>{
        res.status(200).json(userUpdated)
    }).catch(err => {
        next( createError(err) );

    })

})

router.get("/review", (req, res, next) => {
    const {_id} = req.session.currentUser
    User.findById(_id).populate('cart.product')
    .then((user)=>{
        user.password = "*"
        res.status(200).json(user)
    }).catch(err => {
        next( createError(err) );

    })

})


router.get("/", async (req, res) =>{
    let sessionHolder;
    const {product, token} = req.body
    console.log("routeCalled")
    // console.log("Product", product)
    // console.log("Price", product.price)
    const currentUser = req.session.currentUser
    console.log(req.session)
    const user = await User.findById(currentUser._id).populate('cart.product')

    const lineItems = user.cart
            .reduce((lineArray, cartItem)=>{
                console.log(cartItem)
                const lineItem = {

                    price_data:{
                        currency: 'eur',
                        product_data:{
                            name: cartItem.product.name,
                            // image: cartItem.product.image,

                        },
                        unit_amount: cartItem.product.price*100
                    },
                    quantity: cartItem.quantity
                }
                lineArray.push(lineItem)
                return lineArray;
        },[])
    const shipping  = { 
                price_data:{
                    currency: 'eur',
                    product_data:{
                        name: "Shipping"
                    },
                    unit_amount: 10*100
                },
                quantity: 1,
            }
        lineItems.push(shipping)
        console.log(lineItems)
        

const paymentIntent = await stripe.paymentIntents.create({
    amount: 1099,
    currency: 'eur',
    payment_method_types: ['card'],
    receipt_email: 'jbuckley213@gmail.com',
  });

    stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: lineItems,
        customer_email: user.email,
        mode: "payment",
        // success_url: `http://localhost:3000/success/?success=true`,
        // // cancel_url: `http://localhost:3000/success/?canceled=true`,
        // cancel_url: `http://localhost:3000/review`,

        success_url: "https://sports-hub.herokuapp.com/success/?success=true",
        cancel_url: "https://sports-hub.herokuapp.com/review"

       
    }).then((session)=>{
        sessionHolder = session
        console.log(session)
        const paymentIntent =  stripe.paymentIntents.retrieve(
            session.payment_intent
          );
   
        return paymentIntent
    }).then((response)=>{
        console.log(response)
        res.json({ id: sessionHolder.id })

    })

})

router.post('/order/success', async (req, res) => {
    const session = await stripe.checkout.sessions.retrieve(req.query.session_id);
    const customer = await stripe.customers.retrieve(session.customer);
  
    let testAccount = await nodemailer.createTestAccount();

    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: testAccount.user, // generated ethereal user
        pass: testAccount.pass, // generated ethereal password
      },
    });
  
    // send mail with defined transport object
    let info = await transporter.sendMail({
      from: '"Fred Foo 👻" <jbuckley213@gmail.com>', // sender address
      to: "bar@example.com, jbuckley213@gmail.com", // list of receivers
      subject: "Hello ✔", // Subject line
      text: "Hello world?", // plain text body
      html: "<b>Hello world?</b>", // html body
    });
  
    console.log("Message sent: %s", info.messageId);
    // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
  
    // Preview only available when sending through an Ethereal account
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
  
  


    res.send(`<html><body><h1>Thanks for your order, ${customer.name}!</h1></body></html>`);
  });


router.post('/confirmation-email', async (req,res, next)=>{
    const {_id} = req.session.currentUser
    const {messageHTML} = req.body
    const populateQuery = {
        path: 'previousCart',
        model: 'Cart',
        populate: [{
            path: 'items.product',
            model: 'Product'
        }]
    }
    // let testAccount = await nodemailer.createTestAccount();
   User.findById(_id).populate(populateQuery).then((user)=> {

//   var transport = nodemailer.createTransport({
//     host: "smtp.mailtrap.io",
//     port: 2525,
//     auth: {
//       user: "d3e96021f4dfcd",
//       pass: process.env.MAILTRAP_PASS
//     }
//   });

 var transport = nodemailer.createTransport({
    service:"gmail",

    auth: {
      user: "sportshub213@gmail.com",
      pass: process.env.EMAIL_PASSWORD
    }
  });



transport.sendMail({
  from: '"SportsHub" <sportshub213@gmail.com>', // sender address
  to: user.email, // list of receivers
  subject: "Thank You For Your Order ✔", // Subject line
//   text: "Hello world?", // plain text body
//   html: email(user.name, user.address), // html body
html:messageHTML,
}).then((info)=>{

    console.log("Message sent: %s", info.messageId);
    // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
    
    // Preview only available when sending through an Ethereal account
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
    
    res.json(200)
    
    

})



   }).catch((err) => console.log(err))
  

})






module.exports = router;
