angular.module('app.controllers', [])

.controller('homeCtrl', function($scope) {

})

.controller('listCtrl', function(distance, Data, $scope) {
   $scope.data = [];
   $scope.userLocation = {};
   $scope.short_name = 'address, city, zip';
   $scope.foodAndLocation = {};


   $scope.$watch('foodType', function(newValue, oldValue) {
     $scope.foodType = newValue;
     console.log('this is the food type being inputed ', $scope.foodType);
   });

   $scope.$watch('location', function(newValue, oldValue) {
     $scope.location = newValue;
     console.log('this it the location being inputed ', $scope.location)
   });

   // Function called when a wait time is reported.  Saves to session storage for refresh/back cases
   // and updates database.
   $scope.transferEvent = function(obj) {
      Data.clickedItem = obj;
      sessionStorage['tempStorage'] = JSON.stringify(obj);
   }

   // Order variable used for the sorting order
   $scope.order = function(predicate) {
      $scope.predicate = predicate;
      $scope.reverse = ($scope.predicate === predicate) ? !$scope.reverse : false;
   };

   // Main function on page load
   // Gets user's geo location, sends it to server as a post request
   // Saves results returned to scope object
   $scope.restInfo = function() {
      navigator.geolocation.getCurrentPosition(function(position) {
         $scope.userLocation = {
            lat: position.coords.latitude,
            long: position.coords.longitude
         };
         Data.getData($scope.userLocation, function(fetchedData) {
            // Make a distance property for each restaurant
            for (var i = 0; i < fetchedData.length; i++) {
               var destination = {
                  lat: fetchedData[i].restaurant.geometry.location.lat,
                  long: fetchedData[i].restaurant.geometry.location.lng
               };
               fetchedData[i].restaurant.dist = distance.calc($scope.userLocation, destination);
            }
            // Save fetched data to scope object
            $scope.data = fetchedData;
            // Remove loading gif animation
            $scope.contentLoading = false;
         });
      });
   };

   $scope.restLocationInfo = function() {
     if ($scope.userLocation) {
       $scope.foodAndLocation.food = $scope.foodType;
       $scope.foodAndLocation.location = $scope.userLocation;
       console.log('using geo location ', $scope.foodAndLocation);
       /*Data.getData($scope.foodAndLocation, function(fetchedData) {
          for (var i = 0; i < fetchedData.length; i++) {
             var destination = {
                lat: fetchedData[i].restaurant.geometry.location.lat,
                long: fetchedData[i].restaurant.geometry.location.lng
             };
             fetchedData[i].restaurant.dist = distance.calc($scope.userLocation, destination);
          }
          // Save fetched data to scope object
          $scope.data = fetchedData;
          // Remove loading gif animation
          $scope.contentLoading = false;
        });*/
    } else {
      $scope.foodAndLocation.food = $scope.foodType;
      $scope.foodAndLocation.location = $scope.location;
      console.log('not using geo location ', $scope.foodAndLocation);
      /*Data.getData($scope.location,  function(fetchedData) {
         for (var i = 0; i < fetchedData.length; i++) {
            var destination = {
               lat: fetchedData[i].restaurant.geometry.location.lat,
               long: fetchedData[i].restaurant.geometry.location.lng
            };
            fetchedData[i].restaurant.dist = distance.calc($scope.userLocation, destination);
         }
         // Save fetched data to scope object
         $scope.data = fetchedData;
         // Remove loading gif animation
         $scope.contentLoading = false;
       });*/

     }
   }

   $scope.locationInfo = function() {
     var geocoder;

     if (navigator.geolocation) {
       navigator.geolocation.getCurrentPosition(successFunction, errorFunction);
     }
     //Get the latitude and the longitude;
     function successFunction(position) {
         var lat = position.coords.latitude;
         var lng = position.coords.longitude;
         codeLatLng(lat, lng)
     }

     function errorFunction(){
         alert('Geocoder failed');
     }

     function initialize() {
       geocoder = new google.maps.Geocoder();
     }

     function codeLatLng(lat, lng) {

       $scope.userLocation = {
          lat: lat,
          long: lng
       };

       console.log('This is the user location ! ', $scope.userLocation)

       var latlng = new google.maps.LatLng(lat, lng);
       geocoder.geocode({'latLng': latlng}, function(results, status) {
         if (status == google.maps.GeocoderStatus.OK) {
         console.log(results)
           if (results[1]) {
            //formatted address
            /*alert(results[0].formatted_address)*/
           //find country name
           for (var i = 0; i < results[0].address_components.length; i++) {
            for (var b = 0; b < results[0].address_components[i].types.length; b++) {
             //there are different types that might hold a city admin_area_lvl_1 usually does in come cases looking for sublocality type will be more appropriate
               if (results[0].address_components[i].types[b] == 'locality') {
                 //this is the object you are looking for
                 city = results[0].address_components[i];
                 break;
               }
               if (results[0].address_components[i].types[b] == 'administrative_area_level_1') {
                 state = results[0].address_components[i];
                 break;
               }
             }
           }
           //city data
           console.log('this is the city ', city.short_name);
           console.log('this is the state ', state.short_name);
           /*alert(city.short_name + ' ' + city.long_name)*/
           $scope.city = city;
           $scope.state = state;
           $scope.short_name = $scope.city.short_name + ', ' + $scope.state.short_name;
           } else {
             alert('No results found');
           }
         } else {
           alert('Geocoder failed due to: ' + status);
         }
       });
      }
      initialize();
     }

   // Call main post request
   $scope.restInfo();
   /*$scope.locationInfo();*/
   // Sets default order to be ascending
   $scope.reverse = true;
   $scope.order('restaurant.dist');
   $scope.contentLoading = true;
})

.controller('restCtrl', function($scope, Data, Update) {

  $scope.restaurant = {
    id: '',
    name: '',
    category: '',
    lat: '',
    lng: '',
    rating: 0,
    price: 0,
    address: '',
    hours: '',
    waitTime: ''
  };

  // Check if object doesn't exist, use session storage.
  // This way, on refresh or back, it won't have all undefined values
  if (!Data.clickedItem.id) {
    Data.clickedItem = JSON.parse(sessionStorage.tempStorage);
  }

  if (Data.clickedItem.id) {
    // Get data from clicked item
    var item = Data.clickedItem;

    $scope.restaurant.place_id = item.place_id;
    $scope.restaurant.name = item.name;

    var type = item.types;
    var capitalizedType = type.charAt(0).toUpperCase() + type.substring(1);

    $scope.restaurant.category = capitalizedType;
    $scope.restaurant.address = item.vicinity;
    $scope.restaurant.waitTime = item.wait;
    $scope.restaurant.lat = item.geometry.location.lat;
    $scope.restaurant.lng = item.geometry.location.lng;

    // Get restaurant rating and build string for star display
    $scope.restaurant.rating = item.rating;
    var whiteStar = String.fromCharCode(9734);
    var blackStar = String.fromCharCode(9733);
    var starArray = [];

    for (var i = 0; i < 5; i++) {
      starArray.push(whiteStar);
    }

    for (var i = 0; i < Math.round($scope.restaurant.rating); i++) {
      starArray.splice(i, 1, blackStar);
    }

    $scope.starString = starArray.join('');

    // Calculate Price And Convert to Dollar Signs
    var price = item.price_level;
    var dollarSigns = '';

    for (var i = 0; i < price; i++) {
      dollarSigns += '$';
    }

    $scope.restaurant.price = dollarSigns;

    // Change color of main indicator div based on wait time from database
    switch ($scope.restaurant.waitTime) {
      case '2_red':
        angular.element(document.querySelector('#currWait')).addClass('red');
        $scope.waitString = '> 30 Mins';
        break;
      case '1_yellow':
        angular.element(document.querySelector('#currWait')).addClass('yellow');
        $scope.waitString = '~ 20 Mins';
        break;
      case '0_green':
        angular.element(document.querySelector('#currWait')).addClass('green');
        $scope.waitString = '< 10 Mins';
        break;
      case '3_grey':
        angular.element(document.querySelector('#currWait')).addClass('oliveGreen');
        $scope.waitString = 'not available';
        break;
    }
  } else { // No data loaded.  Load default values.
    angular.element(document.querySelector('#currWait')).addClass('oliveGreen');
    $scope.waitString = 'not available';
  }

  // When a Check in Button is clicked, update the wait time on page and DB
  $scope.updateWait = function(wait) {
    console.log('Update Wait called : ', wait);

    var sendObj = {
      place_id: $scope.restaurant.place_id,
      wait: wait
    };

    updateWaitColorDiv(wait);
    Update.updateWait(sendObj);
  };

  // Sweet Alert popup to thank users when they check in a wait time.
  function updateWaitColorDiv(wait) {
    swal({
      html: '<p id="sweetAlert">Thanks for checking in!</p>',
      type: 'success',
      timer: 1500,
      width: 600,
      showConfirmButton: false
    });

    // Change the wait color of the div by removing and adding classes
    switch (wait) {
      case '2_red':
        angular.element(document.querySelector('#currWait')).removeClass('yellow');
        angular.element(document.querySelector('#currWait')).removeClass('green');
        angular.element(document.querySelector('#currWait')).removeClass('oliveGreen');
        angular.element(document.querySelector('#currWait')).addClass('red');
        $scope.waitString = '> 30 Mins';
        break;
      case '1_yellow':
        angular.element(document.querySelector('#currWait')).removeClass('red');
        angular.element(document.querySelector('#currWait')).removeClass('green');
        angular.element(document.querySelector('#currWait')).removeClass('oliveGreen');
        angular.element(document.querySelector('#currWait')).addClass('yellow');
        $scope.waitString = '~ 20 Mins';
        break;
      case '0_green':
        angular.element(document.querySelector('#currWait')).removeClass('yellow');
        angular.element(document.querySelector('#currWait')).removeClass('red');
        angular.element(document.querySelector('#currWait')).removeClass('oliveGreen');
        angular.element(document.querySelector('#currWait')).addClass('green');
        $scope.waitString = '< 10 Mins';
        break;
    }
  }
})

.controller('favoritesCtrl', function($scope) {

})

.controller('profileCtrl', function($scope) {

})

.controller('loginCtrl', function($scope) {

})

.controller('signupCtrl', function($scope) {

})
