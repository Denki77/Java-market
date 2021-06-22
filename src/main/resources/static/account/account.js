angular.module('app').controller('accountController',
    function ($scope, $http, $localStorage, $location, $cookies) {
        const contextPath = 'http://localhost:8189/market';

        $scope.showMyOrders = function () {
            $http({
                url: contextPath + '/api/v1/orders',
                method: 'GET'
            }).then(function (response) {
                $scope.myOrders = response.data;
            });
        };

        $scope.createUser = function () {
            if ($scope.newUser.password !== $scope.newUser.confirmpassword) {
                $("#message_errors").html("Пароли должны совпадать");
            }
            if ($scope.newUser.email === "" || $scope.newUser.username === ""  || $scope.newUser.password === "") {
                $("#message_errors").html("Заполните обязательные поля");
            }
            $http.post(contextPath + '/api/v1/account/register', $scope.newUser)
            .then(function (response) {
                console.log(response);
                if (response.data.status === 200) {
                    $scope.user = $scope.newUser;
                    $scope.tryToAuth();
                } else {
                    $("#message_errors").html(response.data.messages);
                    return;
                }
                $location.path('/account/');
            });
        };

        if (!$scope.isUserLoggedIn) {
            $location.path('/account/registration');
            return;
        } else if ($location.path() === '/account/registration') {
            $location.path('/account/');
            return;
        } else {
            $scope.showMyOrders();
        }

    }
);