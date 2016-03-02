var Restaurant = require('../restaurant/restModel.js');
var _ = require('underscore');
var https = require('https');
var helper = require('../util/helpers.js');

if (!process.env.GOOGLEPLACESKEY) {
  var config = require('../config.js');
}

// Function called when post request is received with lat/long
// Makes a request to
exports.getRestaurants = function(req, res) {
  console.log('Receiving a request!', req.body);

  var lat = req.body.userLocation.lat;
  var lng = req.body.userLocation.long;
  var results = [];
  var keyword = req.body.foodType || 'food';
  var api_key = process.env.GOOGLEPLACESKEY || config.placesKey;

  var query = keyword + ' in ' + req.body.location;
  var url = 'https://maps.googleapis.com/maps/api/place/textsearch/json?type=food&key=' + api_key;

  if (req.body.location) {
    url = url + '&query=' + query;
  }
  else {
    url = url + '&location=' + lat + ',' + lng + '&radius=5000&l&query=' + keyword;
  }

  https.get(url, function(response) {
    var data;
    response.on('data', function(chunk) {
      data += chunk;
    });
    response.on('end', function() {
      // console.log(data);
      var jstring = JSON.stringify(data);
      var temp = JSON.parse(jstring.slice(0,1) + jstring.slice(10));
      var place = JSON.parse(temp);

      console.log(place.results.length);
      _.each(place.results, function(item) {
        Restaurant.findOne({
          id: item.id
        }, function(err, obj) {
          if (obj === null) {
            var restaurant = new Restaurant({
              wait: "3_grey",
              geometry: {
                location: {
                  lat: item.geometry.location.lat,
                  lng: item.geometry.location.lng
                }
              },
              id: item.id,
              name: item.name,
              place_id: item.place_id,
              price_level: item.price_level,
              rating: item.rating,
              types: item.types[0],
              vicinity: item.vicinity,
              distance: 0
            });
            restaurant.distance = helper.distance(lat, lng, obj.geometry.location.lat, obj.geometry.location.lng);
            restaurant.save(function(err) {
              if (err) {
                console.log("not saved");
                throw err;
              }
              // ** TODO **: Rewrite condition that JSON is returned so it doesn't fail with too few results
              results.push(restaurant);
              console.log('RESULTS LENGTH : ', results.length);
              if (results.length === 18) {
                res.json(results);
              }
            });
          } else {
            obj.distance = helper.distance(lat, lng, obj.geometry.location.lat, obj.geometry.location.lng);
            results.push(obj);

            // ** TODO **: Rewrite condition that JSON is returned so it doesn't fail with too few results
            console.log('RESULTS LENGTH : ', results.length);

            if (results.length === 18) {
              res.json(results);
            }
          }
        });
      });
    });
  });
};

// Function that updates the wait time/color in the database
exports.updateWait = function(req, res) {
  var updatedArray;
  var date;
  Restaurant.findOne({place_id: req.body.place_id}, 'time', function(err, timeArray) {
    if (err) {
      throw err;
    }
    updatedArray = timeArray.time.slice();
    date = new Date().getTime() / 1000;
    updatedArray.push({date: date, wait: req.body.wait});
    // console.log(timeArray);
    console.log(updatedArray);
    Restaurant.findOneAndUpdate({place_id: req.body.place_id}, {time: updatedArray}, {upsert: true}, function(err, restaurant) {
      if (err) {
        throw err;
      }
      res.json(restaurant);
    });
  });
};
