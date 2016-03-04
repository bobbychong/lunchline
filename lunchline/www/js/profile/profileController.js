angular.module('lunchline.profile', [])

.controller('profileController', function($scope, User, Favorites, $window) {

  var user = JSON.parse($window.localStorage['firebase:session::instalunchline'])

  User.getUser(user)
  .then(function(item){
    $scope.user = item;
  })

})
