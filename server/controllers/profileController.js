var helpers = require('../util/helpers.js');
var Profile = require('../models/profileModel.js');
var Restaurant = require('../models/restModel.js');
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
    if(_.indexOf(fave, {id: req.body.favorite.id}) === -1) {
      fave.push({id: req.body.favorite.id});
    }
    console.log(fave);
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
    var results = [];
    // JSON.parse(profile.favorites);
    _.each(profile.favorites, function(item) {
      Restaurant.findOne(item, function(err, obj) {
        results.push(obj);
        if(results.length === profile.favorites.length) {
          res.json(results);
        }
      })
    });
  });
};
