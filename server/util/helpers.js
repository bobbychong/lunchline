var path = require('path');
var fs = require('fs');

module.exports = {

  errorLogger: function(error, req, res, next) {
    // log the error then send it to the next middleware in
    // middleware.js
    console.error(error.stack);
    next(error);
  },

  errorHandler: function(error, req, res, next) {
    // send error message to client
    // message for gracefull error handling on app
    res.status(500).send({error: error.message});
  },

  avgTime: function(obj, callback){
    // grabs wait color of all time instances of current restaurant
    // that falls within the past 30 minutes. Then calculates
    // the average of these times and sends corresponding color(waittime).
    var date = new Date().getTime() / 1000;
    var flag = true;
    var times = obj.time;
    var results = [];
    var totalTime = 0;
    var avgTime;
    var color;

    for(var i = times.length - 1; i >= 0; i--){
      if(flag === false){
        break;
      }
      if((date - times[i].date) < 1800){
        if(times[i].wait === '0_green') {
          results.push(10);
        }
        if(times[i].wait === '1_yellow') {
          results.push(20);
        }
        if(times[i].wait === '2_red') {
          results.push(30);
        }
      }else{
        flag = false;
      }
    }

    if(results.length === 0){
      color = '3_grey';
    }else{
      for(var j = 0; j < results.length; j++){
        totalTime = totalTime + results[j];
      }

      avgTime = totalTime / results.length;

      if(avgTime < 15){
        color = '0_green';
      }
      if(avgTime >= 15 && avgTime < 25){
        color = '1_yellow';
      }
      if(avgTime >= 25){
        color = '2_red';
      }
    }
    console.log("THISISTHECOLORRRR", times);
    callback(color);
  },

  distance: function(lat1, lon1, lat2, lon2) {
    var p = 0.017453292519943295;    // Math.PI / 180
    var c = Math.cos;
    var a = 0.5 - c((lat2 - lat1) * p)/2 +
    c(lat1 * p) * c(lat2 * p) *
    (1 - c((lon2 - lon1) * p))/2;
    // returns distance in miles
    return Math.round(12742 * Math.asin(Math.sqrt(a))/1.60932*10)/10;
  }
};
