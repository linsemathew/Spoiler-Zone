'use strict';

/**
 * @ngdoc function
 * @name spoilerZoneApp.controller:JoinCtrl
 * @description
 * # JoinCtrl
 * Controller of the spoilerZoneApp
 */
angular.module('spoilerZoneApp')
  .controller('JoinCtrl', [ '$scope', '$rootScope', '$location', 'Pubnub', function ($scope, $rootScope, $location, Pubnub) {
  	$scope.data = {
  		username: 'User_' +Math.floor(Math.random() * 1000)
  	}


  	$scope.join = function(){
  		console.log("joining")
  	};
  }]);
