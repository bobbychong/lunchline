var restController = require('../controllers/restController.js');
var jsonParser = require('body-parser').json();
module.exports = function(app) {

  app.post('/search', jsonParser, restController.getRestaurants);
  app.put('/update', jsonParser, restController.updateWait);
  app.post('/recent', jsonParser, restController.getRecent);

};
