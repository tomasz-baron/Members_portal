angular.module('login.loginFactory', [])
.factory('loginService', ['$http', function($http) {
	'use strict';
	var loginService={};

	loginService.login = function(username, password) {
		return $http({
			method: 'post',
			url: 'login',
			data: {
				username: username,
				password: password
			}
		});
	};

	loginService.isUserLogged = function() {
		return $http({
			method: 'post',
			url: 'isUserLogged',
			data: {
				username: localStorage.getItem('Username'),
				session_id: localStorage.getItem('SessionID')
			}
		});
	};

	loginService.ping = function() {
		return $http({
			method: 'post',
			url: 'ping',
			data: {
				username: localStorage.getItem('Username'),
				session_id: localStorage.getItem('SessionID')
			}
		});
	};

	loginService.logout = function() {
		return $http({
			method: 'post',
			url: 'logout',
			data: {
				username: localStorage.getItem('Username'),
				session_id: localStorage.getItem('SessionID')
			}
		});
	};

	loginService.getNews = function() {
		return $http({
			method: 'post',
			url: 'getNews',
			data: {
				username: localStorage.getItem('Username')
			}
		});
	};

	return loginService;
}]);
