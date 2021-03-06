const { json } = require("body-parser");
const express = require("express");
const router = express.Router();
const createError = require("http-errors");

const Cart = require("../models/cart.model")
const Product = require("../models/product.model");
const User = require("../models/user.model")
const stripe = require("stripe")("sk_test_51IBgegFmgEKSMttvzeuVfo8svBnfICMyk6ipU9Lpdqa68mzOag2A6KRWZeDJO4hriDwlPsuM1eQJaBFq2g5HEIbG00da23PqIm")






router.get('/', (req, res, next)=>{

   
    Product.find()
    .then((products)=>{
        res.status(200).json(products)
    }).catch(err =>{
        next( createError(err) );

    })
    
})



router.get('/cart/:id', async (req, res, next) => {
    const { id } = req.params
    const currentUser = req.session.currentUser
    console.log(currentUser)
    const product = await Product.findById(id)
    const user  = await User.find({_id:currentUser._id, 'cart.product': id })
    if(user.length===0){
        User.findByIdAndUpdate(currentUser._id, {$push: {cart:{product:product, quantity:1}}}).then((userUpdated)=>{
            console.log(userUpdated)
        }).catch((err) =>{
            next( createError(err) );

        } )

    }else{
        const quantity = user[0].cart.reduce((total,item) =>{
            if(String(item.product._id) === String(id)){
                total = item.quantity + 1
                return total
            }
            return total
        }, 0)

        await User.findByIdAndUpdate(currentUser._id, {$pull: {cart:{product:product}}})
        await User.findByIdAndUpdate(currentUser._id, {$push: {cart:{product:product, quantity:quantity}}})
    }
    

    res.json(200)
})



router.get('/cart', (req, res, next)=>{
    const {_id} = req.session.currentUser 
    // console.log("cart", req.session.currentUser)

    User.findById(_id).populate({  path: 'cart.product', model: 'Product'})
    .then((userFound)=>{
        res.status(200).json(userFound.cart)
    }).catch(err =>{
        next( createError(err) );
    })


})

router.get('/cart-item-increment/:id', async (req, res, next)=>{
    const productId = req.params.id
    const {_id} = req.session.currentUser 
    await User.findOneAndUpdate({'_id': _id, "cart.product": productId}, {$inc :{'cart.$.quantity':1}})

    res.json(200)

})

router.get('/cart-item-decrement/:id', async (req, res, next)=>{
    const productId = req.params.id
    const {_id} = req.session.currentUser 
    await User.findOneAndUpdate({'_id': _id, "cart.product": productId}, {$inc :{'cart.$.quantity':-1}})

    res.json(200)

})

router.delete('/cart/:id', async (req, res, next)=>{

    const productId = req.params.id
    const {_id} = req.session.currentUser

    await User.findByIdAndUpdate(_id, {$pull: {cart: {product: productId}}})
    res.status(200)


})

router.put('/change-cart', async (req, res, next)=>{
    const {_id} = req.session.currentUser
    const user = await User.findById(_id)
    // await User.findByIdAndUpdate(_id, {$push: {previousCart: {$each: [...user.cart]}}})
    if(user.cart.length !== 0){
   Cart.create({items:user.cart}).then((newCart)=>{

      
       const pr =  User.findByIdAndUpdate(_id, {$push: {previousCart:newCart}})
       return pr;
   }).then(()=>{
    const pr = User.findByIdAndUpdate(_id, {cart:[]})
    return pr;
   }).then(()=>{
    res.json(200)

   })
   .catch(err =>{
        next( createError(err) );

   } )
}else{
    res.json(200)
}

   
})

router.get('/previous-cart', async (req, res, next)=>{

    const populateQuery = {
        path: 'previousCart',
        model: 'Cart',
        populate: [{
            path: 'items.product',
            model: 'Product'
        }]
    }

    const {_id} = req.session.currentUser
    const user = await User.findById(_id).populate(populateQuery)
    

    res.status(200).json(user.previousCart)
})

router.get('/product-details/:id', (req, res, next)=>{
    const {id} = req.params

    Product.findById(id).then((productFound)=>{
        res.status(200).json(productFound)
    }).catch(err =>{
        next( createError(err) );
    } )

})






module.exports = router;
