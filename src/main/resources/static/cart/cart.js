angular.module('app').controller('cartController', function ($scope, $http, $localStorage) {
    const contextPath = 'http://localhost:8189/market';

    $scope.loadCart = function (page) {
        $http({
            url: contextPath + '/api/v1/cart',
            method: 'GET',
            params: {
                cartName: $localStorage.aprilCartId
            }
        }).then(function (response) {
            $scope.cartDto = response.data;
        });
    };

    $scope.clearCart = function () {
        $http({
            url: contextPath + '/api/v1/cart/clear',
            method: 'GET',
            params: {
                cartName: $localStorage.aprilCartId
            }
        }).then(function (response) {
            $scope.loadCart();
        });
    };

    $scope.isUserLoggedIn = function () {
        if ($localStorage.aprilMarketCurrentUser) {
            return true;
        } else {
            return false;
        }
    };

    $scope.createOrder = function () {
        $http({
            url: contextPath + '/api/v1/orders',
            method: 'POST'
        }).then(function (response) {
            $scope.loadCart();
        });
    };

    $scope.decrementProduct = function (productId) {
        $http({
            url: contextPath + '/api/v1/cart/dec/',
            method: 'GET',
            params: {
                prodId: productId,
                cartName: $localStorage.aprilCartId
            }
        }).then(function (response) {
            $scope.loadCart();
        });
    }

    $scope.addToCart = function (productId) {
        $http({
            url: contextPath + '/api/v1/cart/add/',
            method: 'GET',
            params: {
                prodId: productId,
                cartName: $localStorage.aprilCartId
            }
        }).then(function (response) {
            $scope.loadCart();
        });
    }

    $scope.loadCart();
});