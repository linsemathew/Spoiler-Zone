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
  		var _ref, _ref2;
  		$rootScope.data || ($rootScope.data = {});
  		$rootScope.data.username = (_ref = $scope.data) != null ? _ref.username : void 0;
  		$rootScope.data.city = (_ref2 = $scope.data) != null ? _ref2.city : void 0;
  		$rootScope.data.uuid = Math.floor(Math.random() * 1000000) + '__' + $scope.data.username;

  		Pubnub.init({
  			subscribe_key: 'sub-c-dcfbfba2-82fa-11e6-afcd-02ee2ddab7fe',
  			publish_key: 'pub-c-a0c4eb4c-d737-42c5-b58e-d01c1c177ae4',
  			uuid: $rootScope.data.uuid
  		});

  		return $location.path('/main')
  	};
  }]);
