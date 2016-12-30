angular.module('main').directive('changesTable', function() {
	return {
		restrict: 'E',
		scope: {
			list: '=',
            type: '='
		},
		templateUrl : 'include/changes-table.html',
        controller: function($scope, $rootScope, $element, $location, membersService, informService, $state, paymentItems, CHANGE_TYPES) {
            $scope.changeTypes = CHANGE_TYPES;
        }
	}
});
