const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Product = require("./product.model")


const userSchema = new Schema({
  username: String,
  password: String,
  // cart:[{type: Schema.Types.ObjectId, ref:"Product"}]
   cart:[{product:{type: Schema.Types.ObjectId, ref:"Product"}, quantity:Number}],
   previousCart: [{product:{type: Schema.Types.ObjectId, ref:"Product"}, quantity:Number}],

}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  },
});


const User = mongoose.model('User', userSchema);

module.exports = User;