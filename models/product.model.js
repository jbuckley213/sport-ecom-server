const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productSchema = new Schema({
  name: String,
  description: String,
  price: Number,
  oldPrice:Number,
  sale: Boolean,
  image: String,
  category: String,
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  },
});


const Product = mongoose.model('Product', productSchema);

module.exports = Product;