angular.module('lunchline.routes', [])

.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider
  .state('menu.home', {
    url: '/page1',
    views: {
      'side-menu21': {
        templateUrl: 'templates/home.html',
        controller: 'homeController'
      }
    }
  })
  .state('menu.list', {
    url: '/page2',
    views: {
      'side-menu21': {
        templateUrl: 'templates/list.html',
        controller: 'listController'
      }
    }
  })
  .state('menu.restaurant', {
    url: '/page3',
    views: {
      'side-menu21': {
        templateUrl: 'templates/restaurant.html',
        controller: 'restaurantController'
      }
    }
  })
  .state('menu', {
    url: '/side-menu21',
    templateUrl: 'templates/menu.html',
    abstract:true
  })
  .state('favorites', {
    url: '/page4',
    templateUrl: 'templates/favorites.html',
    controller: 'favoritesController'
  })
  .state('menu.profile', {
    url: '/page5',
    views: {
      'side-menu21': {
        templateUrl: 'templates/profile.html',
        controller: 'profileController'
      }
    }
  })
  .state('login', {
    url: '/page6',
    templateUrl: 'templates/login.html',
    controller: 'authController'
  })
  .state('signup', {
    url: '/page7',
    templateUrl: 'templates/signup.html',
    controller: 'authController'
  })

$urlRouterProvider.otherwise('/side-menu21/page1')

})
/*.config(['cfpLoadingBarProvider', function(cfpLoadingBarProvider) {
    cfpLoadingBarProvider.includeSpinner = false;
}]);*/
