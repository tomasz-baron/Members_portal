app.controller('changesListCtrl', ['$scope', '$rootScope', 'usersService', 'informService', 'changeItems',
    function($scope, $rootScope, usersService, informService, changeItems) {
        'use strict';        
        $scope.items = {};
        var getChangesList = function() {
            usersService.getChangesList()
			.success(function (data) {
                changeItems.addAll(data);
                $scope.items = changeItems.getAll();
			})
			.error(function (data, status) {
				informService.showSimpleToast('Błąd pobrania listy zmian');
				if (status === 401) {
					$rootScope.$emit('session.timeout', '');
				}
			});
		};

		getChangesList();
}]);