angular.module('lunchline.home', [])

.controller('homeController', function($scope, Auth, $state) {

  $scope.logout = function(){
    console.log("Attempting to logout");
    Auth.logout();
    $state.go('login')
  }

})
