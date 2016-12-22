angular.module('main.inform', [])
.factory('informService', ['$mdDialog', '$mdToast', 'PAYMENT_TYPES', 'PAYMENT_AMOUNTS',
 function($mdDialog, $mdToast, PAYMENT_TYPES, PAYMENT_AMOUNTS) {
	'use strict';
	var informService={};

	informService.showAlert = function(title, content) {
		$mdDialog.show(
			$mdDialog.alert()
			.parent(angular.element(document.querySelector('#popupContainer')))
			.clickOutsideToClose(true)
			.title(title)
			.textContent(content)
			.ariaLabel('Ok')
			.ok('Ok')
			);
	};

	informService.showSimpleToast = function(content, delay) {
		$mdToast.show(
			$mdToast.simple()
			.textContent(content)
			.position('bottom right')
			.hideDelay(delay || 3000)
			);
	};

	informService.showConfirm = function(title, content) {
		return $mdDialog.confirm()
			.title(title)
			.textContent(content)
			.ariaLabel(content)
			.cancel('Anuluj')
			.ok('Tak');

	};

	informService.showPaymentDialog = function(items) {
		$mdDialog.show({
			clickOutsideToClose: true,
			preserveScope: true,
			templateUrl: 'include/paymentBatch.html',
			controller: 'paymentBatchCtrl'
		});
	};

	return informService;
}]);
