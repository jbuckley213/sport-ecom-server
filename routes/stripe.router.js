const express = require("express");
const router = express.Router();
const stripe = require("stripe")("sk_test_51IBgegFmgEKSMttvzeuVfo8svBnfICMyk6ipU9Lpdqa68mzOag2A6KRWZeDJO4hriDwlPsuM1eQJaBFq2g5HEIbG00da23PqIm")
const createError = require("http-errors");


const uuid = require('uuid')
const User = require("../models/user.model")



router.get("/", async (req, res) =>{
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
                        currency: 'usd',
                        product_data:{
                            name: cartItem.product.name
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
                    currency: 'usd',
                    product_data:{
                        name: "Shipping"
                    },
                    unit_amount: 10*100
                },
                quantity: 1,
            }
        lineItems.push(shipping)
        console.log(lineItems)

    stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: lineItems,
        mode: "payment",
        success_url: `http://localhost:3000/private/?success=true`,
        cancel_url: `http://localhost:3000/private/?canceled=true`,
       
    }).then((session)=>{
        res.json({ id: session.id })
    })

})

router.post('/order/success', async (req, res) => {
    const session = await stripe.checkout.sessions.retrieve(req.query.session_id);
    const customer = await stripe.customers.retrieve(session.customer);
  
    res.send(`<html><body><h1>Thanks for your order, ${customer.name}!</h1></body></html>`);
  });


// stripe.checkout.sessions.create({
//     payment_method_types: ['card'],
//     line_items: [
//         {
//             price_data: {
//                 currency: "usd",
//                 product_data:{
//                     name: "T-Shirt"
//                 },
//                 unit_amount: 2000,
//             },
//             quantity: 1,
//         },
//     ],
//     mode: "payment",
//     success_url: "https://localhost:3000/success",
//     cancel_url: "https://localhost:3000/private"
// }).then((session)=>{
//     res.json({ id: session.id })
// })

// stripe.customers.create({
//     email: token.email,
//     source: token.id
// }).then(customer => {
//     stripe.charges.create({
//         amount: product.price*100,
//         currency: 'usd',
//         customer: customer.id,
//         receipt_email: token.email,
//         description: `purchase of ${product.name}`,
//         shipping: {
//             name: token.card.name,
//             address: {
//                 country: token.card.address_country
//             }
//         }
//     }, {idempontencyKey})
// }).then(result => {
//     res.status(200).json(result)
// }).catch(err => console.log(err))

module.exports = router;
