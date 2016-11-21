app.controller('memberDetailsCtrl', ['$scope', '$rootScope', '$state', '$stateParams', 'informService', 'membersService',
	function ($scope, $rootScope, $state, $stateParams, informService, membersService) {

		$scope.member = null;
		$scope.memberId = $stateParams.id;

		if (!$scope.memberId) {
			$state.go('membersList');
		}

		$scope.types = [
		{id: 'C', name: 'Członek zwyczajny'},
		{id: 'Z', name: 'Zarząd'},
		{id: 'R', name: "Komisja Rewizyjna"},
		{id: 'K', name: 'Koordynator grupy roboczej'},
		{id: 'H', name: 'Członek honorowy'}];

		var getMembersDetails = function() {
			membersService.getMemberDetails($scope.memberId)
			.success(function (data) {
				$scope.member = data;
			})
			.error(function () {
				informService.showSimpleToast('Błąd pobrania szczegółów członka');
			});
		};
		getMembersDetails();

		$scope.clearForm = function() {
			$rootScope.$emit('clear.new.payments', $scope.memberId);
		}


	}]);
