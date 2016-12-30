app.controller('memberDetailsCtrl', ['$scope', '$rootScope', '$state', '$stateParams', '$location', 'informService', 'membersService', 'BOOLEAN', 'MEMBER_TYPES',
	function ($scope, $rootScope, $state, $stateParams, $location, informService, membersService, BOOLEAN, MEMBER_TYPES) {

		$scope.member = null;
		$scope.memberId = $stateParams.id;
		$scope.userRole = localStorage.getItem('UserRole');
		$scope.boolean = BOOLEAN;
		$scope.memberTypes = MEMBER_TYPES;

		if (!$scope.memberId) {
			$state.go('membersList');
		}

		var getMembersDetails = function() {
			membersService.getMemberDetails($scope.memberId)
			.success(function (data) {
				$scope.member = data;
			})
			.error(function (data, status) {
				informService.showSimpleToast('Błąd pobrania szczegółów członka');
				if (status === 401) {
					$rootScope.$emit('session.timeout', '');
				}
			});
		};
		getMembersDetails();

		$scope.clearForm = function() {
			$rootScope.$emit('clear.new.payments', $scope.memberId);
		};

		$scope.moveToOld = function() {
			membersService.moveToOld($scope.memberId)
			.success(function () {
				informService.showSimpleToast('Przeniesiono członka do byłych członków');
				$scope.member.old = 1;
			})
			.error(function (data, status) {
				informService.showSimpleToast('Błąd zapisu');
				if (status === 401) {
					$rootScope.$emit('session.timeout', '');
				}
			});
		};

		$scope.moveToCurrent = function() {
			membersService.moveToCurrent($scope.memberId)
			.success(function () {
				informService.showSimpleToast('Przeniesiono członka do aktualnych członków');
				$scope.member.old = 0;
			})
			.error(function (data, status) {
				informService.showSimpleToast('Błąd usuwania');
				if (status === 401) {
					$rootScope.$emit('session.timeout', '');
				}
			});
		};

		$scope.deleteMember = function() {
			membersService.deleteMember($scope.memberId)
			.success(function () {
				informService.showSimpleToast('Usunięto członka');
				$location.path('/membersList');
			})
			.error(function (data, status) {
				informService.showSimpleToast('Błąd zapisu');
				if (status === 401) {
					$rootScope.$emit('session.timeout', '');
				}
			});
		};
	}]);
