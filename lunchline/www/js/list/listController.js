angular.module('lunchline.list', [])

.controller('listController', function(distance, Data, $scope) {
   $scope.data = [];
   $scope.userLocation = {};
   $scope.short_name = 'address, city, zip';
   $scope.foodAndLocation = {};

   $scope.query = {};

   $scope.$watch('foodType', function(newValue, oldValue) {
     $scope.query.foodType = newValue;
     console.log('this is the food type being inputed ', $scope.query.foodType);
   });

   $scope.$watch('location', function(newValue, oldValue) {
     $scope.query.location = newValue;
     console.log('this it the location being inputed ', $scope.query.location)
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
         $scope.query.userLocation = {
            lat: position.coords.latitude,
            long: position.coords.longitude
         };
         Data.getData($scope.query, function(fetchedData) {
            // Make a distance property for each restaurant
            for (var i = 0; i < fetchedData.length; i++) {
               var destination = {
                  lat: fetchedData[i].restaurant.geometry.location.lat,
                  long: fetchedData[i].restaurant.geometry.location.lng
               };
               fetchedData[i].restaurant.dist = distance.calc($scope.query.userLocation, destination);
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
