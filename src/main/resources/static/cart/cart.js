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

    $scope.createOrder = function () {
        var inputTel = $('#inputTel').val(),
            inputAddress = $('#inputAddress').val();
        if (inputTel.length === 0 || inputAddress.length === 0) {
            alert("Заполните адрес доставки и номер телефона");
            return false;
        } else {
            var dataArray = {};
            dataArray['phone'] = inputTel;
            dataArray['address'] = inputAddress;
            $http({
                url: contextPath + '/api/v1/orders',
                data: dataArray,
                method: 'POST'
            }).then(function (response) {
                $scope.loadCart();
            });

        }
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