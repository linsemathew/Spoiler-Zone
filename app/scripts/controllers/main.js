'use strict';

/**
 * @ngdoc function
 * @name spoilerZoneApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the spoilerZoneApp
 */
angular.module('spoilerZoneApp')
	.controller('MainCtrl', ['$scope', '$rootScope', '$location', 'PubNub', function ($scope, $rootScope, $location, PubNub) {
 			var _ref;

	  		if(!PubNub.initialized()){
	  			$location.path('/join');
	  		}

	  		$scope.controlChannel = '__controlChannel';
	  		$scope.channels = []

	  		$scope.createChannel = function(){
	  			var channel;
	  			channel = $scope.newChannel;
	  			$scope.newChannel = '';
	  			Pubnug.ngGrant({
	  				channel: channel,
	  				read: true,
	  				write: true
	  			});
	  			Pubnug.ngGrant({
	  				channel: channel+'pnpres',
	  				read: true,
	  				write: true
	  			})
	  			PubNub.ngPublish({
	  				channel: $scope.controlChannel,
	  				message: channel
	  			});
	  			return setTimeout(function(){
	  				$scope.subscribe(channel);
	  				return $scope.showCreate = false
	  			}, 100);
	  		};

	  		$scope.subscribe = function(channel){
	  			var _ref;
	  			if (channel === $scope.selectedChannel){
	  				return;
	  			}
	  			if($scope.selectedChannel){
	  				PubNub.ngUnsubscribe({
	  					channel: $scope.selectedChannel
	  				});
	  			}
	  			$scope.selectedChannel = channel;
	  			$scope.messages = ['Welcome to ' +channel]
	  			PubNub.ngSubscribe({
	  				channel: $scope.selectedChannel,
	  				state: {
	  					"city": ((_ref = $rootScope.data) != null ? _ref.city : void 0) || 'unknown'
	  				}
	  			});
	  		}

	  		// Display users
	        $rootScope.$on(PubNub.ngPrsEv($scope.selectedChannel), function (event, payload) {
	            return $scope.$apply(function () {
	                var newData, userData;
	                userData = PubNub.ngPresenceData($scope.selectedChannel);
	                newData = {};
	                $scope.users = PubNub.map(PubNub.ngListPresence($scope.selectedChannel), function (x) {
	                    var newX;
	                    newX = x;
	                    if (x.replace) {
	                        newX = x.replace(/\w+__/, "");
	                    }
	                    if (x.uuid) {
	                        newX = x.uuid.replace(/\w+__/, "");
	                    }
	                	newData[newX] = userData[x] || {};
	                   	return newX;
	                });
	                return $scope.userData = newData;
	            });
	        });

	        // Retrieve current users
	        PubNub.ngHereNow({
	            channel: $scope.selectedChannel
	        });

	        // Display messages in the window
	        $rootScope.$on(PubNub.ngMsgEv($scope.selectedChannel), function (ngEvent, payload) {
	            var msg;
	            msg = payload.message.user ? "[" + payload.message.user + "] " + payload.message.text : "[unknown] " + payload.message;
	            return $scope.$apply(function () {
	            return $scope.messages.unshift(msg);
	            });
	        });

			// Previous messages on a channel     
	        return PubNub.ngHistory({
	            channel: $scope.selectedChannel,
	            auth_key: $scope.authKey,
	            count: 500
	            });

	        $scope.subscribe = function () {
	            PubNub.ngSubscribe({
	                channel: $scope.controlChannel
	            });
	        }


	        $scope.message = function(){
		        $rootScope.$on(PubNub.ngMsgEv($scope.controlChannel), function (ngEvent, payload) {
		            return $scope.$apply(function () {
		                if ($scope.channels.indexOf(payload.message) < 0) {
		                    return $scope.channels.push(payload.message);
		                }
		            });
		        });
	        };

	        $scope.ngHistory = function(){
		        PubNub.ngHistory({
		            channel: $scope.controlChannel,
		            count: 500
		        });
	        };

	        $scope.newChannel = 'WaitingRoom';
	        return $scope.createChannel();
  }]);
