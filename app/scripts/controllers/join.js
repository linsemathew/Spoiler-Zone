'use strict';

/**
 * @ngdoc function
 * @name spoilerZoneApp.controller:JoinCtrl
 * @description
 * # JoinCtrl
 * Controller of the spoilerZoneApp
 */
angular.module('spoilerZoneApp')

  .controller('JoinCtrl',['$scope','$rootScope','$location','PubNub', function ($scope,$rootScope,$location,PubNub) {
    $scope.data ={
      username:'User_' + Math.floor(Math.random()*1000)  
    };
    
    $scope.join = function(){
        var _ref,_ref1;
        $rootScope.data || ($rootScope.data ={});
        $rootScope.data.username = (_ref = $scope.data) != null ?_ref.username : void 0;
        $rootScope.data.city = (_ref1 = $scope.data) != null ?_ref1.city : void 0;
        $rootScope.data.uuid = Math.floor(Math.random() * 1000000) + '__' +$scope.data.username;
        
        PubNub.init({

            uuid:$rootScope.data.uuid
        });
        
        return $location.path('/main');
    }
}]);
