angular.module('main').directive('membersTable', function() {
	return {
		restrict: 'E',
		scope: {
			list: '=',
			query: '=',
			old: '='
		},
		templateUrl : 'include/members-table.html',
		controller: function($scope, $rootScope, $element, $location, membersService, informService, $state, paymentItems) {
			$scope.selectedItem = {};
			$scope.keys = Object.keys;
			$scope.checkExpirationDate = function(member) {
				if ($scope.old || member.type === 'H') {
					return false;
				}
				if (member.expirationDate === null || member.expirationDate === '') {
					member.expirationDate = '';
					return true;
				}
				var expDate = new Date(member.expirationDate);
				var now = new Date();
				if (expDate < now)
					return true;
				return false;
			};

			$scope.changeDeclaration = function(member) {
				membersService.setDeclaration(member)
				.success(function () {
					informService.showSimpleToast('Zmiana została zapisana');
				})
				.error(function (data, status) {
					informService.showSimpleToast('Błąd zapisu');
					if (status === 401) {
						$rootScope.$emit('session.timeout', '');
					}
				});
			};

			$scope.changeAegeeEmail = function(member) {
				membersService.setAegeeEmail(member)
				.success(function () {
					informService.showSimpleToast('Zmiana została zapisana');
				})
				.error(function (data, status) {
					informService.showSimpleToast('Błąd zapisu');
					if (status === 401) {
						$rootScope.$emit('session.timeout', '');
					}
				});
			};

			$scope.showPaymentDialog = function() {
			  informService.showPaymentDialog();
			};

			$scope.toggleItem = function(item) {
				if ($scope.old) return;
				if ($scope.selectedItem[item.id]) {
					delete $scope.selectedItem[item.id];
					paymentItems.remove(item);
				} else {
					$scope.selectedItem[item.id]= item;
					paymentItems.add(item);
				}
			};

			$scope.openDetails = function(member) {
				$state.go('memberDetails', {id: member.id});
			};

		}
	}
});
