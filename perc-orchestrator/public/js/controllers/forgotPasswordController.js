var app = angular.module('publicApp', []);

app.controller('ForgotPasswordCtrl', function($scope, $http, $location, $window, $timeout, $sce, $anchorScroll) {

	$scope.user = {"passwordResetToken": $('#passwordResetToken').val()};
	$scope.hideForgotPasswordBlock = false;
	$scope.updateForgotPassword = function() {
		var errorHandler = function(msg,timeout) {
            $("#changePwd").html("Change Password").attr("disabled", false);
            if(!timeout) timeout = 5000;
            $("#changePwdErrAlert").html(msg).addClass("alert-danger").removeClass("hide");
            setTimeout(function() {
                $("#changePwdErrAlert").html("").removeClass("alert-danger").addClass("hide");
            }, timeout);
        };

		if($scope.user.passwordResetToken && $scope.user.newPassword && $scope.user.confirmNewPassword) {
			if($scope.user.newPassword === $scope.user.confirmNewPassword) {

				if($scope.user.newPassword.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@#$!%*?&])[A-Za-z\d$@#$!%*?&]{6,}$/)) {
					$http.post('/public/user/updateForgotPassword', $scope.user).success(function(data) {
                            if(data && data.STATUS) {
                                if(data.STATUS == "SUCCESS") {
                                	$scope.hideForgotPasswordBlock = true;
                                    var hostName = $location.host();
                                    hostName += ($location.port() == 80)? "" : ":"+$location.port();
                                    var successMessage = "Password reset successfully. Click <a href='http://" + hostName + "'>here</a> to login and start learning.";
                                    $("#changePwdSucAlert").html(successMessage).addClass("alert-success").removeClass("hide");
                                } else {
                                    $scope.user.newPassword = $scope.user.confirmNewPassword = "";
                                    errorHandler(data.errorMessage, 10000);
                                }    
                            } else {
                                errorHandler("Error while saving new password.", 10000);
                            }
                        }).error(function(err) {
                            errorHandler("Error while saving new password.", 10000);
                        });
                    } else {
                        $scope.user.newPassword = $scope.user.confirmNewPassword = "";
                        errorHandler("Password should contain at least 6 characters, 1 number, 1 lowercase character (a-z), 1 uppercase character (A-Z) and 1 special character.", 10000);
                    }
			} else {
				$scope.user.newPassword = $scope.user.confirmNewPassword = "";
				errorHandler("Password does not match the confirm password. Please re-enter the passwords.");
			}


		} else {
			errorHandler("Please fill all fields.");
		}
	}

});