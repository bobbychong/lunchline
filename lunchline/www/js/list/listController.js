angular.module('lunchline.list', [])

.controller('listController', function(distance, Data, $scope, Geolocation) {
   $scope.data = [];
   $scope.userLocation = {};
   $scope.short_name = 'address, city, zip';
   $scope.foodAndLocation = {};
   $scope.search = { foodType: null, location:null };

   $scope.foodTypeChange = function(v) {
     $scope.search.foodType = v;
   };

   $scope.foodTypeChange = function(v) {
     $scope.search.location = v;
   };

   // Function called when a wait time is reported.  Saves to session storage for refresh/back cases
   // and updates database.
   $scope.transferEvent = function(obj) {
      Data.clickedItem = obj;
      sessionStorage['tempStorage'] = JSON.stringify(obj);
      // hides search button when a specific restaurant is clicked
      if ($scope.locationBarShow === true) {
        $scope.showLocationBar();
      }
   }

   // Order variable used for the sorting order
   $scope.order = function(predicate) {
      $scope.predicate = predicate;
      $scope.reverse = ($scope.predicate === predicate) ? !$scope.reverse : false;
   };

   $scope.$root.restLocationInfo = function() {
     if ($scope.userLocation && $scope.search.location === null) {
       $scope.foodAndLocation.foodType = $scope.search.foodType;
       $scope.foodAndLocation.userLocation = $scope.userLocation;
       console.log('using geo location ', $scope.foodAndLocation);
       Data.getData($scope.foodAndLocation, function(fetchedData) {
          for (var i = 0; i < fetchedData.length; i++) {
             var destination = {
                lat: fetchedData[i].restaurant.geometry.location.lat,
                long: fetchedData[i].restaurant.geometry.location.lng
             };
             /*fetchedData[i].restaurant.dist = distance.calc($scope.userLocation, destination);*/
          }
          // Save fetched data to scope object
          $scope.searchCalled = true;
          $scope.data = fetchedData;
          console.log(fetchedData);
          // Remove loading gif animation
          $scope.contentLoading = false;
        });
    } else {
      $scope.foodAndLocation.foodType = $scope.search.foodType;
      $scope.foodAndLocation.userLocation = $scope.userLocation;
      $scope.foodAndLocation.location = $scope.search.location
      console.log('not using geo location ', $scope.foodAndLocation);
      Data.getData($scope.foodAndLocation, function(fetchedData) {
         for (var i = 0; i < fetchedData.length; i++) {
            var destination = {
               lat: fetchedData[i].restaurant.geometry.location.lat,
               long: fetchedData[i].restaurant.geometry.location.lng
            };
            console.log('this is the destination', destination);
            console.log('this is the $scope.userLocation ', $scope.userLocation);
            /*console.log('Let\'s Calculate the distance on the fly! ', distance.calc($scope.userLocation, destination));*/
            /*fetchedData[i].restaurant.dist = distance.calc($scope.userLocation, destination);*/
         }
         // Save fetched data to scope object
         $scope.searchCalled = true;
         $scope.data = fetchedData;
         console.log(fetchedData);

         // Remove loading gif animation
         $scope.contentLoading = false;
       });

     }
   }

   // Sets default order to be ascending
   $scope.reverse = true;
   $scope.order('restaurant.distance');
   $scope.contentLoading = true;
   
   $scope.locationInfo = function() {
     Geolocation.locationInfo(function(userLocation) {
       $scope.userLocation = userLocation;
       $scope.short_name = userLocation.city.short_name + ', ' + userLocation.state.short_name;
       console.log('this is the callback of userLocation', $scope.userLocation)
     });
   };

   $scope.locationInfo();

   // controls the location search bar and button showing up
   $scope.locationBarShow = false;
   $scope.$root.locationBarShow = false;

   $scope.showLocationBar = function() {
     if ($scope.locationBarShow === false) {
       $scope.locationBarShow = true;
       $scope.$root.locationBarShow = true;
     } else {
       $scope.locationBarShow = false;
       $scope.$root.locationBarShow = false;
     }
   }

   // show header filter when search is called
   $scope.searchCalled = false;
})
