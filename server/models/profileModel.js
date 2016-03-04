//define schema for restaurant
var mongoose = require('mongoose');

var profileSchema = new mongoose.Schema({
  uid: String,
  favorites: Array,
  firstname: String,
  lastname: String,
  image_url: String
})

module.exports = mongoose.model('Profile', profileSchema)
