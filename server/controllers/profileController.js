var helpers = require('../util/helpers.js');
var Profile = require('../models/profileModel.js');
var _ = require('underscore');
var https = require('https');


exports.addUser = function(req, res) {
  var profile = new Profile({
    uid: req.body.uid,
    favorites: req.body.favorites,
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    image_url: req.body.image_url
  });

  profile.save(function(err) {
    if (err) {
      console.log("user profile not saved");
      throw err;
    }
    // ** TODO **: Rewrite condition that JSON is returned so it doesn't fail with too few results
    res.sendStatus(200);
  });
};

exports.getUser = function(req, res){
  Profile.findOne({uid: req.body.uid}, function(err, profile) {
    if (err) {
      throw err;
    }
    res.json(profile);
  });
};

exports.addFavorites = function(req, res) {
  Profile.findOne({uid: req.body.uid}, function(err, profile) {
    if(err) {
      throw err;
    }
    var fave = profile.favorites;
    fave.push(req.body.favorite);
    Profile.findOneAndUpdate({uid: req.body.uid}, {favorites: fave}, {upsert: true}, function(err, profile) {
      if (err) {
        console.log("user favorites not saved");
        throw err;
      }
      res.sendStatus(200);
    });
  });
};

exports.getFavorites = function(req, res) {
  Profile.findOne({uid: req.body.uid}, function(err, profile) {
    if(err) {
      throw err;
    }
    res.json(profile.favorites);
  });
};
