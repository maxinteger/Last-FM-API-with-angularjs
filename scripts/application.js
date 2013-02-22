var BASE_URL = "http://ws.audioscrobbler.com/2.0/?api_key=9a8a3facebbccaf363bb9fd68fa37abf&format=json";





angular.module('lastfmService', ['ngResource'])
    .factory('artistSearch', function($resource){
        return $resource(BASE_URL + '&method=artist.search&artist=:artist', {}, {
            query: {method:'GET', params:{phoneId:'phones'}, isArray:false}
        });
    });

angular.module('lastfm', ['lastfmService']).
  config(['$routeProvider', function($routeProvider) {
  $routeProvider.
      when('/', {templateUrl: 'html/list.html',   controller: SearchListCtrl}).
      when('/artist/:mbid', {templateUrl: 'html/detail.html', controller: DetailCtrl}).
      otherwise({redirectTo: '/'});
}]);

function imageTfr (images){
	for (var i in images){
		images[images[i]['size']] = images[i]['#text'];
	}
}

function SearchListCtrl($scope, artistSearch) {
	$scope.$watch('searchField', function (newVal) {
		if (newVal){
			var res = artistSearch.query({artist: newVal}, function () {
				var artists = res.results.artistmatches.artist;
				for (var a in artists) imageTfr(artists[a].image);
				console.log(artists)
				$scope.artists = res.results.artistmatches.artist;
			});
		} else {
			$scope.artists = []
		}
	})
}

function DetailCtrl ($scope, $routeParams, $http) {
	$http.get(BASE_URL + "&method=artist.getInfo&mbid=" + $routeParams.mbid).success(function(data) {
		var images = data.artist.image;
		for (var i in images){
			images[images[i]['size']] = images[i]['#text'];
		}
    	$scope.artist = data.artist;
  	});
}