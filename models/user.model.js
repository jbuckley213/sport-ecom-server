const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Product = require("./product.model")
const Cart = require('./cart.model.js')

const userSchema = new Schema({
  username: String,
  password: String,
  // cart:[{type: Schema.Types.ObjectId, ref:"Product"}]
   cart:[{product:{type: Schema.Types.ObjectId, ref:"Product"}, quantity:Number}],
  //  previousCart: [{product:{type: Schema.Types.ObjectId, ref:"Product"}, quantity:Number}],
  previousCart: [{type:Schema.Types.ObjectId, ref:"Product"}],

   email: String,
   address: {
     building:String,
     street:String,
     city:String,
     postcode:String,
    country:String,
   }, 
   name:String,

}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  },
});


const User = mongoose.model('User', userSchema);

module.exports = User;