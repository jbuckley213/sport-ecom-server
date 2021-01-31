require("dotenv").config();

const mongoose = require('mongoose');

// //requiring the schema
// const User = require('./../models/user.model');
const Product = require('./../models/product.model');
// const saltRounds = 10;
// const bcrypt = require('bcrypt');

// var faker = require('faker');


// //requiring the 'fake' objects
// const users = require('./user-mock-data');
 const products = require('./product.mock.data');


// SEED SEQUENCE

// const randomImage = faker.image.food
// const randomProduct = faker.commerce

// console.log("Product", randomProduct.productName())
// console.log("Description", randomProduct.productDescription(), randomProduct.price())

// 0. ESTABLISH CONNECTION TO MONGO DATABASE
mongoose
    .connect(process.env.MONGODB_URI, {

        // .connect(process.env.MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
    }).then((x) => {
        // 1. DROP THE DATABASE
        const pr = x.connection.dropDatabase();

        return pr;
    })
    .then(() => {
        // 2.  CREATE THE DOCUMENTS FROM ARRAY OF authors
        const pr = Product.create(products);
        return pr; // forwards the promise to next `then`
    }) 
    .then((createdProducts) => {
        console.log(`${createdProducts.length} products created`)
        mongoose.connection.close();

    })

    .catch((err) => console.log(err));