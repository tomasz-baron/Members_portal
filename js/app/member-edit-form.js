function memberEditController($scope, $rootScope, $stateParams, $state, informService, membersService, MEMBER_TYPES) {
	$scope.member = $stateParams.member;
	$scope.mentors = null;
	if ($scope.member) {
		$scope.member.birthDate = new Date($scope.member.birthDate);
		$scope.member.accessionDate = new Date($scope.member.accessionDate);
	} else {
		$scope.member = {};
	}

	var phoneRegex = new RegExp('[0-9]{9}');
	var privateEmailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
	var cardNumberRegex = new RegExp('[a-z0-9]{6}-[a-z0-9]{6}', 'i');

	$scope.memberTypes = MEMBER_TYPES;

	var validate = function(form) {
		if (form.$invalid) {
			informService.showAlert('Błąd', 'Wypełnij poprawnie formularz');
			return false;
		} else if (!phoneRegex.test($scope.member.phone)){
			informService.showAlert('Błąd', 'Numer telefonu jest niepoprawny');
			return false;
		} else if (!privateEmailRegex.test($scope.member.privateEmail)){
			informService.showAlert('Błąd', 'Adres e-mail jest niepoprawny');
			return false;
		}  else if (!cardNumberRegex.test($scope.member.cardNumber)){
			informService.showAlert('Błąd', 'Numer karty członkowskiej jest niepoprawny');
			return false;
		} else {
			return true;
		}
	};

	$scope.saveMember = function(form) {
		if (validate(form)) {
			if (angular.isUndefined($scope.member.id)) {
				membersService.saveMember($scope.member)
				.success(function () {
					informService.showSimpleToast('Zapisano nowego członka');
					$scope.member = null;
					getMentors();
					form.$setPristine();
					form.$setUntouched();
				})
				.error(function (data, status) {
					informService.showAlert('Błąd', 'Zapis nie powiódł się.');
					if (status === 401) {
						$rootScope.$emit('session.timeout', '');
					}
				});
			} else {
				membersService.changeMember($scope.member)
				.success(function () {
					informService.showSimpleToast('Zapisano zmiany w danych członka');
					$state.go('membersList');
				})
				.error(function (data, status) {
					informService.showAlert('Błąd', 'Zapis nie powiódł się.');
					if (status === 401) {
						$rootScope.$emit('session.timeout', '');
					}
				});
			}
		}
	};

	var getMentors = function() {
		membersService.getMentors()
		.success(function (data) {
			$scope.mentors = data;
		})
		.error(function (data, status) {
			informService.showSimpleToast('Błąd pobrania listy mentorów');
			if (status === 401) {
				$rootScope.$emit('session.timeout', '');
			}
		});
	};

	var init = function() {
		getMentors();
	};

	init();
};

app.component('memberEditForm', {
	templateUrl: 'include/member-edit-form.html',
	controller: memberEditController,
	bindings: {
		save: '&'
	}
});
