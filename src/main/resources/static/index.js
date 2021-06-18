(function ($localStorage) {
    'use strict';

    angular
        .module('app', ['ngRoute', 'ngStorage', 'ngCookies'])
        .config(config)
        .run(run);

    function config($routeProvider, $httpProvider) {
        $routeProvider
            .when('/', {
                templateUrl: 'home/home.html',
                controller: 'homeController'
            })
            .when('/products', {
                templateUrl: 'products/products.html',
                controller: 'productsController'
            })
            .when('/cart', {
                templateUrl: 'cart/cart.html',
                controller: 'cartController'
            })
            .when('/orders', {
                templateUrl: 'orders/orders.html',
                controller: 'ordersController'
            })
            .when('/product_info/:productIdParam', {
                templateUrl: 'product_info/product_info.html',
                controller: 'productInfoController'
            })
            .otherwise({
                redirectTo: '/'
            });
    }

    function run($rootScope, $http, $localStorage) {
        if ($localStorage.aprilMarketCurrentUser) {
            $http.defaults.headers.common.Authorization = 'Bearer ' + $localStorage.aprilMarketCurrentUser.token;
        }

        if ($localStorage.aprilCartId) {
        } else {
            const contextPath = 'http://localhost:8189/market';

            $http({
                url: contextPath + '/api/v1/cart/generate',
                method: 'GET'
            }).then(function (response) {
                $localStorage.aprilCartId = response.data.str;
            });
        }
    }
})();

angular.module('app').controller('indexController', function ($scope, $http, $localStorage, $location, $cookies) {
    const contextPath = 'http://localhost:8189/market';

    $scope.mergeCarts = function () {
        console.log('ready');
        $http({
            url: contextPath + '/api/v1/cart/merge',
            method: 'GET',
            params: {
                'cartId': $localStorage.aprilCartId
            }
        }).then(function (response) {
            console.log('ready');
        });
    }

    $scope.tryToAuth = function () {
        $http.post(contextPath + '/auth', $scope.user)
            .then(function successCallback(response) {
                if (response.data.token) {
                    $http.defaults.headers.common.Authorization = 'Bearer ' + response.data.token;
                    $localStorage.aprilMarketCurrentUser = {username: $scope.user.username, token: response.data.token};

                    $scope.mergeCarts();

                    $scope.user.username = null;
                    $scope.user.password = null;
                }
            }, function errorCallback(response) {
            });
    };

    $scope.tryToLogout = function () {
        $scope.clearUser();
        $location.path('/');
    };

    $scope.clearUser = function () {
        delete $localStorage.aprilMarketCurrentUser;
        $http.defaults.headers.common.Authorization = '';
    };

    $scope.isUserLoggedIn = function () {
        if ($localStorage.aprilMarketCurrentUser) {
            return true;
        } else {
            return false;
        }
    };
});