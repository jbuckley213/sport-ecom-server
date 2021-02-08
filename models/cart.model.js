const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Product = require("./product.model")


const cartSchema = new Schema({

    items:[{product:{type: Schema.Types.ObjectId, ref:"Product"}, quantity:Number}],
    

}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  },
});


const Cart = mongoose.model('Cart', cartSchema);

module.exports = Cart;