var app = angular.module('movie', ['ui.router']);

app.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider
    .state({
      name: 'search',
      url: '/',
      templateUrl: 'search.html',
      controller: 'MainController'
    })
    .state({
      name: 'search_results',
      url: '/{search}',
      templateUrl: 'search_results.html',
      controller: 'SearchResults'
    })
    .state({
      name: 'movie_details',
      url: '/movie/{id}',
      templateUrl: 'movie_details.html',
      controller: 'MovieDetails'
    });

    $urlRouterProvider.otherwise('/');
});

app.factory('MovieService', function($http) {
  var service = {};
  var API_KEY = '4ad86033d8e9416fbee65fb2201a242a';
  service.nowPlaying = function () {
    var url = 'http://api.themoviedb.org/3/movie/now_playing';
    return $http({
      method: 'GET',
      url: url,
      params: {api_key: API_KEY}
    });
  };
  service.getDetails = function(id) {
    var url = 'http://api.themoviedb.org/3/movie/' + id;
    return $http({
      method: 'GET',
      url: url,
      params: {api_key: API_KEY}
    });
  };
  service.searchMovie = function(search) {
    var url = 'http://api.themoviedb.org/3/search/movie';
    return $http({
      method: 'GET',
      url: url,
      params: {api_key: API_KEY, query: search}
    });
  };
  return service;
});

app.controller('MainController', function($scope, MovieService, $stateParams, $state) {
  $scope.nowplaying = function() {
    MovieService.nowPlaying().success(function(results) {
      $scope.results = results.results;
    });
  };

  $scope.searchmovie = function(search) {
    $state.go('search_results', {search: $scope.search});
  };
});

app.controller('SearchResults', function($scope, MovieService, $stateParams, $state) {

  $scope.search = $stateParams.search;
  MovieService.searchMovie($scope.search).success(function(data) {
    console.log(data);
    $scope.data = data.results;
    $scope.title = data.title;
    $scope.overview = data.overview;
    $scope.poster_path = data.poster_path;
  });

  $scope.getmovieid = function(entry) {
    $scope.id = entry.id;
    $state.go('movie_details', {id : $scope.id});
  };

  $scope.searchmovie = function(search) {
    $state.go('search_results', {search: $scope.search});
  };
});

app.controller('MovieDetails', function($scope, MovieService, $stateParams, $state) {
  $scope.id = $stateParams.id;
  MovieService.getDetails($scope.id).success(function(data) {
    $scope.title = data.title;
    $scope.overview = data.overview;
    $scope.poster_path = data.poster_path;
    $scope.runtime = data.runtime;
    $scope.release_date = data.release_date;
    $scope.tagline = data.tagline;
  });

  $scope.searchmovie = function(search) {
    $state.go('search_results', {search: $scope.search});
  };
});
