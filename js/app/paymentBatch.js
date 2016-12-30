
app.controller('paymentBatchCtrl',['$scope', '$mdDialog', '$rootScope', 'membersService', 'informService', 'PAYMENT_TYPES', 'PAYMENT_AMOUNTS', 'paymentItems',
	function ($scope, $mdDialog, $rootScope, membersService,  informService, PAYMENT_TYPES, PAYMENT_AMOUNTS, paymentItems) {
		'use strict';

    $scope.items = paymentItems.get();
    $scope.paymentTypes = PAYMENT_TYPES;
    $scope.paymentAmounts = PAYMENT_AMOUNTS;
	
	angular.forEach($scope.items, function(value, key) {
		value.paymentDate = new Date();
		value.expirationDate = new Date();
    });

    $scope.cancel = function() {
      $mdDialog.cancel();
    };

		var setExpirationDates = function() {
			var currentDate = new Date();
			switch ($scope.payment.type) {
				case '1' :
					setExpDate(new Date((currentDate.getFullYear() + 1) + '-01-31'));
					break;
				case '2' :
					setExpDate(new Date(currentDate.getFullYear() + '-09-31'));
					break
				case '3' :
					setExpDate(new Date((currentDate.getFullYear() + 1) + '-09-31'));
					break;
			}
		};

		var setExpDate = function(date) {
			angular.forEach($scope.items, function(value, key) {
				value.expirationDate = date;
	    });
		};

		var setAmount = function() {
			switch ($scope.payment.type) {
				case '1' :
				case '2' :
					$scope.payment.amount = 20;
					break
				case '3' :
					$scope.payment.amount = 40;
					break;
			}
		};

		$scope.$watch('payment.type', function() {
			setExpirationDates();
			setAmount();
		});

		var validation = function(form) {
			if (form.$invalid) {
				informService.showAlert('Błąd', 'Wypełnij poprawnie formularz');
				return false;
			} else {
				return true;
			}
		};

		$scope.save = function(form) {
			$scope.payment.memberIds = [];
			$scope.payment.paymentDates = [];
			$scope.payment.expirationDates = [];
			angular.forEach($scope.items, function(value, key) {
				$scope.payment.memberIds.push(value.id);
				$scope.payment.paymentDates.push(value.paymentDate);
				$scope.payment.expirationDates.push(value.expirationDate);
	    });

			if ($scope.payment.memberIds.length > 0) {
				membersService.setNewPayments($scope.payment)
				.success(function (data) {
					informService.showSimpleToast('Składki członkowskie zostały zapisane');
					form.$setPristine();
					form.$setUntouched();
					$rootScope.$emit('refresh.payments.table', '');
					$scope.close(form);
				})
				.error(function (data, status) {
					informService.showAlert('Błąd', 'Dane nie zostały zapisane');
					if (status === 401) {
						$rootScope.$emit('session.timeout', '');
					}
				});
			}
		};

	}]);
