app.controller('paymentNewCtrl',['$scope', '$rootScope', 'membersService', 'informService', 'PAYMENT_TYPES', 'PAYMENT_AMOUNTS',
	function ($scope, $rootScope, membersService,  informService, PAYMENT_TYPES, PAYMENT_AMOUNTS) {
		'use strict';
		$scope.payment = {};

		$scope.paymentTypes = PAYMENT_TYPES;
		$scope.paymentAmounts = PAYMENT_AMOUNTS;

		$rootScope.$on('clear.new.payments', function (event, value) {
			$scope.reset($scope.paymentNewForm);
			$scope.payment.memberId = value;
		});

		var setExpirationDate = function() {
			var currentDate = new Date();
			switch ($scope.payment.type) {
				case '1' :
					$scope.payment.expirationDate = new Date((currentDate.getFullYear() + 1) + '-01-31');
					break;
				case '2' :
					$scope.payment.expirationDate = new Date(currentDate.getFullYear() + '-09-31');
					break
				case '3' :
					$scope.payment.expirationDate = new Date((currentDate.getFullYear() + 1) + '-09-31');
					break;
			}
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
			setExpirationDate();
			setAmount();
		});

		$scope.closeRight();

		var validation = function(form) {
			if (form.$invalid) {
				informService.showAlert('Błąd', 'Wypełnij poprawnie formularz');
				return false;
			} else {
				return true;
			}
		};

		$scope.save = function(form) {
			if (validation(form)) {
				membersService.setNewPayment($scope.payment)
				.success(function (data) {
					informService.showSimpleToast('Składka członkowska została zapisana');
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


		$scope.reset = function(form) {
			if (form) {
				$scope.isEdit = false;
				$scope.title = 'Nowy użytkownik';
				$scope.payment = {};
				form.$setPristine();
				form.$setUntouched();
			}
		};

		$scope.close = function(form) {
			$scope.reset(form);
			$scope.closeRight();
		};


	}]);
