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

	 	if (!PubNub.initialized()) {
	 		$location.path('/join');
	 	}

	 	$scope.controlChannel = '__controlchannel';
	 	$scope.channels = [];

	 	//Publish a message
 		$scope.publish = function() {
 			if (!$scope.selectedChannel) {
 				return;
 			}
 		
 			PubNub.ngPublish({
	 			channel: $scope.selectedChannel,
	 			message: {
	 				text: $scope.newMessage,
	 				user: $scope.data.username
 				}
 			});

 			return $scope.newMessage = '';
 		};

 		String.prototype.capitalize = function() {
 			var words = this.split(" ");
 			var i = 0;
 			var showTitle = "";
 			for (i; i < words.length; i++){
 				showTitle += words[i].charAt(0).toUpperCase() + words[i].slice(1).toLowerCase();
 				if (i !== 0 || !(i >= (words.length - 1))){
 					showTitle += " "
 				}
 			};
 			return showTitle;
		};

		$scope.createChannel = function() {
			if ($scope.newChannel){ 
			  	var channel;
			  	channel = $scope.newChannel.capitalize();
				$scope.newChannel = '';

		  		PubNub.ngGrant( {
			  		channel: channel,
			  		read: true,
			  		write: true,
			  		callback: function(){
			  			return console.log(channel + 'All Set', arguments);				
			  		}
			  	});

			  	PubNub.ngGrant( {
			  		channel: channel + '-pnpres',
			  		read: true,
			  		write: false,
			  		callback: function(){
				  		return console.log(channel + 'Presence All Set', arguments);
				  	}
			  	});

				PubNub.ngPublish({
			  		channel: $scope.controlChannel,
			  		message: channel
			  	});

			  	return setTimeout(function() {
			  		$scope.subscribe(channel);
			  		return $scope.showCreate = false;
			  	}, 100);
			} else {
				$scope.errorMessage = "Please enter a valid show."
				}
		};

	    $scope.subscribe = function(channel) {
		    var _ref;

		    if (channel === $scope.selectedChannel) {
				return;
	    	}

	    	if ($scope.selectedChannel) {
		    	PubNub.ngUnsubscribe({
		        	channel: $scope.selectedChannel
				});
		    }

	    	$scope.selectedChannel = channel;
	    	$scope.messages = ["You are in the " + "'" + channel +"'" + " room."];

	    	PubNub.ngSubscribe({
	    		channel: $scope.selectedChannel,
	    		state: {
	    			"city": ((_ref = $rootScope.data) !== null ? _ref.city : void 0) || 'unknown'
	    		}
	    	});

	    	// Display users
	    	$rootScope.$on(PubNub.ngPrsEv($scope.selectedChannel), function(event, payload) {
	    		return $scope.$apply(function() {
	        		var newData, userData;
	        		userData = PubNub.ngPresenceData($scope.selectedChannel);
	        		newData = {};
	        		$scope.users = PubNub.map(PubNub.ngListPresence($scope.selectedChannel), function(x) {
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
	    	$rootScope.$on(PubNub.ngMsgEv($scope.selectedChannel), function(event, payload) {
	     		var msg;
	     		msg = payload.message.user ? "[" + payload.message.user + "] " + payload.message.text : payload.message.text;
	     		return $scope.$apply(function() {
	      			return $scope.messages.unshift(msg);
	    		});
	   		});

	    	// Previous messages on a channel 
	    	return PubNub.ngHistory({
	     		channel: $scope.selectedChannel,
	     		auth_key: $scope.authKey,
	     		count: 500
	   		});
		};

		PubNub.ngSubscribe({
	    	channel: $scope.controlChannel
	  	});

		$rootScope.$on(PubNub.ngMsgEv($scope.controlChannel), function(event, payload) {
	    	return $scope.$apply(function() {
	     		if ($scope.channels.indexOf(payload.message) < 0) {
	      			return $scope.channels.push(payload.message);
	    		}
	  		});
	    });

		PubNub.ngHistory({
	    	channel: $scope.controlChannel,
	    	count: 500
	  	});


		// Default room when a user joins
		$scope.newChannel = 'Lobby';
		return $scope.createChannel();

}]);
