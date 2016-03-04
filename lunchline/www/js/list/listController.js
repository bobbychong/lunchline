angular.module('lunchline.list', [])

.controller('listController', function(distance, Data, $scope, Geolocation, $ionicLoading) {
   $scope.data = [];
   $scope.userLocation = JSON.parse(sessionStorage['locationStorage']) || {};
   $scope.short_name = 'address, city, zip';
   $scope.foodAndLocation = {};
   $scope.search = { foodType: null, location:null };

   if($scope.userLocation.city.short_name) {
     $scope.short_name = $scope.userLocation.city.short_name + ', ' + $scope.userLocation.state.short_name;
   }

   $scope.foodTypeChange = function(v) {
     $scope.search.foodType = v;
   };

   $scope.foodTypeChange = function(v) {
     $scope.search.location = v;
   };

   $scope.time = new Date();

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
     $scope.show();
     if ($scope.userLocation && $scope.search.location === null) {
       $scope.foodAndLocation.foodType = $scope.search.foodType;

       $scope.foodAndLocation.userLocation = $scope.userLocation;
       console.log('using geo location ', $scope.foodAndLocation);
       Data.getData($scope.foodAndLocation, function(fetchedData) {
          // Save fetched data to scope object
          $scope.searchCalled = true;
          $scope.data = fetchedData;
          console.log(fetchedData);
          // Remove loading gif animation
          $scope.hide();
        });
    } else {
      $scope.foodAndLocation.foodType = $scope.search.foodType;
      $scope.foodAndLocation.userLocation = $scope.userLocation;
      $scope.foodAndLocation.location = $scope.search.location
      console.log('not using geo location ', $scope.foodAndLocation);
      Data.getData($scope.foodAndLocation, function(fetchedData) {
         // Save fetched data to scope object
         $scope.searchCalled = true;
         $scope.data = fetchedData;
         console.log(fetchedData);

         // Remove loading gif animation
         $scope.hide();
       });

     }
   }

   // Sets default order to be ascending
   $scope.reverse = true;
   $scope.order('restaurant.distance');

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

   // loading
   $scope.show = function() {
     $ionicLoading.show({
       // The text to display in the loading indicator
       content: '<i class=" ion-loading-c"></i> ',

       // The animation to use
       animation: 'fade-in',

       // Will a dark overlay or backdrop cover the entire view
       showBackdrop: true,

       // The maximum width of the loading indicator
       // Text will be wrapped if longer than maxWidth
       maxWidth: 200,

       // The delay in showing the indicator
       showDelay: 0
     });
   };

   $scope.hide = function(){
     $ionicLoading.hide();
   };

})
