angular.module('app').controller('ordersController', function ($scope, $http, $localStorage, $location) {
    const contextPath = 'http://localhost:8189/market';

    $scope.showMyOrders = function () {
        $http({
            url: contextPath + '/api/v1/orders',
            method: 'GET'
        }).then(function (response) {
            $scope.myOrders = response.data;
        });
    };

    $scope.isUserLoggedIn = function () {
        if ($localStorage.aprilMarketCurrentUser) {
            return true;
        } else {
            return false;
        }
    };

    if (!$scope.isUserLoggedIn()) {
        $location.path('/');
    }

    $scope.showMyOrders();
});