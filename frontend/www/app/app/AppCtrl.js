angular.module('civis.youpower.main',[]).controller('AppCtrl', AppCtrl);

/* The controller that should always be on top of routing
hierarchy as it will be loaded with abstract main state.
Here we can do the general app stuff like getting the user's
details (since this is after the user logs in).
----------------------------------------------*/
function AppCtrl($scope, $state, $ionicHistory, $ionicViewSwitcher, User,Actions) { 

	$scope.userPictures = {}; 

	$scope.actions = {}; // save action details

	$scope.commentPoints = 1; 
	$scope.feedbackPoints = 1; 

	/*
	load the data of the user ($scope.currentUser)
	*/
	User.get().$promise.then(function(data){

		$scope.currentUser = data;

		//whether the user wants to rehearse the actions, inite the variable 
		//this can be loaded from the backend TODO post the data to the backend
		$scope.currentUser.toRehearse = { setByUser: false} ;

		//get the user's picture
		User.getPicture({userId: $scope.currentUser._id}).$promise.then(function(data){
			
			console.log("user picture TODO");
			//console.log(data); 
			var b64 = btoa(data); //this doesnot work 
			//console.log(b64); 
			$scope.userPictures[$scope.currentUser._id] = ({_id: $scope.currentUser._id, image: b64});
			//console.log($scope.userPictures); 
		});

		$scope.loadActionDetails($scope.currentUser.actions.inProgress); 
		$scope.loadActionDetails($scope.currentUser.actions.pending); 
		$scope.loadActionDetails($scope.currentUser.actions.done); 

		//comments are loaded later automatically at the action details view

		console.log("user data");
		console.log($scope.currentUser); 
	});

	$scope.toRehearseSelectAll = function() {
		$scope.currentUser.toRehearse = { 
			setByUser: true, 
			declined: true, 
			done: true, 
			na: true
		}; 
	}

	$scope.toRehearseDeselectAll = function() {
		$scope.currentUser.toRehearse = { 
			setByUser: true, 
			declined: false, 
			done: false, 
			na: false
		}; 
	} 

	$scope.isToRehearse = function() {
		var a = $scope.currentUser.toRehearse; 
		return a.setByUser && (a.declined || a.done || a.na); 
	}

	$scope.isNotToRehearse = function() {
		var a = $scope.currentUser.toRehearse; 
		return a.setByUser && !a.declined && !a.done && !a.na; 
	}

	$scope.isSetRehearse = function() {
		return $scope.currentUser.toRehearse.setByUser; 
	}


	$scope.loadActionDetails = function(actions){

		//console.log("is array " + _.isArray(actions) + " " + JSON.stringify(actions, null, 4));
		if (_.isArray(actions)){
			for (var i=0; i< actions.length; i++) {
				$scope.addActionById(actions[i]._id);
			}
		}else{
			for (var action in actions) {
				$scope.addActionById(action);
			}
		}
	}

	
	$scope.addActionById = function(actionId){

		if (!$scope.actions[actionId]){
			Actions.getActionById({id:actionId}).$promise.then(function(data){
				
				$scope.actions[data._id] = data;

				console.log("action details");
				console.log($scope.actions); 
			});
		}
	}

	//update local list 
	$scope.removeActionById = function(actionId){

		if ($scope.actions[actionId]){

			delete $scope.actions[actionId];
			console.log("delete action details");
			console.log($scope.actions); 
		}
	}


	$scope.addFeedbackPoints = function(){
		$scope.currentUser.leaves += $scope.feedbackPoints; 
	}

	$scope.addCommentPoints = function(){
		$scope.currentUser.leaves += $scope.commentPoints; 
	}

	$scope.deductCommentPoints = function(){
		$scope.currentUser.leaves -= $scope.commentPoints; 
	}

	$scope.addActionPoints = function(action){
		$scope.currentUser.leaves += action.impact + action.effort; 
	}

	$scope.getActionPoints = function(action){
		return action.effort + action.impact; 
	};

	$scope.salut = function(){
		var name = $scope.currentUser.profile.name? $scope.currentUser.profile.name : $scope.currentUser.email; 
		return 'Hi, ' + name + '!';
	}

	$scope.gotoYourActions = function() {
		$ionicHistory.nextViewOptions({
			disableBack: true
		});
		$state.go("main.actions.yours");
	}

	$scope.gotoSettings = function() {
		// $ionicHistory.nextViewOptions({
		// 	disableBack: true
		// });
		$ionicViewSwitcher.nextDirection('forward'); // forward, back, enter, exit, swap
		$state.go("main.settings.index");
	}

	$scope.gotoYourSettings = function() {
		// $ionicHistory.nextViewOptions({
		// 	disableBack: true
		// });
		$ionicViewSwitcher.nextDirection('forward'); // forward, back, enter, exit, swap
		$state.go("main.settings.personal");
	}

	$scope.disableBack = function() {
		$ionicHistory.nextViewOptions({
			disableBack: true
		});
	}


	$scope.goBack= function() {
		$ionicHistory.goBack();
	}


};
