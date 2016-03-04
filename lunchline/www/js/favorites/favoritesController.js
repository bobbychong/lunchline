angular.module('lunchline.favorites', [])

.controller('favoritesController', function($window, $scope, User, Favorites) {
  var user = JSON.parse($window.localStorage['firebase:session::instalunchline'])

  $scope.data = {};
  // User.getUser(user)
  // .then(function(item){
  //   $scope.user = item;
  // })

  $scope.getFavorites = function(){
    $scope.data = Favorites.getFavorites(user)
      .then(function(items){
        $scope.data = items
      });
  }
  $scope.getFavorites();
  console.log($scope.data);
})
