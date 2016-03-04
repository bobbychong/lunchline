angular.module('lunchline.favorites', [])

.controller('favoritesController', function($window, $scope, User, Favorites) {
  var user = JSON.parse($window.localStorage['firebase:session::instalunchline'])

  $scope.data = {};

  $scope.getFavorites = function(){
    $scope.data = Favorites.getFavorites(user)
      .then(function(items){
        $scope.data = items
      });
  }
  $scope.getFavorites();
})
