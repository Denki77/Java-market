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
            .when('/account', {
                templateUrl: 'account/index.html',
                controller: 'accountController'
            })
            .when('/account/registration', {
                templateUrl: 'account/registration.html',
                controller: 'accountController'
            })
            .when('/account/orders', {
                templateUrl: 'account/orders.html',
                controller: 'accountController'
            })
            .when('/products', {
                templateUrl: 'products/products.html',
                controller: 'productsController'
            })
            .when('/cart', {
                templateUrl: 'cart/cart.html',
                controller: 'cartController'
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

        const contextPath = 'http://localhost:8189/market';

        if ($localStorage.aprilMarketCurrentUser) {
            // проверим не протух ли токен
            $http.post(contextPath + '/auth/check_auth', $localStorage.aprilMarketCurrentUser)
                .then(function successCallback(response) {
                    if (response.data.token) {
                        $http.defaults.headers.common.Authorization = 'Bearer ' + response.data.token;
                        $rootScope.isUserLoggedIn = true;
                    } else {
                        delete $localStorage.aprilMarketCurrentUser;
                        $rootScope.isUserLoggedIn = false;
                        $http.defaults.headers.common.Authorization = '';
                    }
                }, function errorCallback(response) {
                    delete $localStorage.aprilMarketCurrentUser;
                    $rootScope.isUserLoggedIn = false;
                    $http.defaults.headers.common.Authorization = '';
                });

        } else {
            $rootScope.isUserLoggedIn = false;
            $http.defaults.headers.common.Authorization = '';
        }

        if (!$localStorage.aprilCartId) {

            $http({
                url: contextPath + '/api/v1/cart/generate',
                method: 'GET'
            }).then(function (response) {
                $localStorage.aprilCartId = response.data.str;
            });
        }

        $rootScope.mergeCarts = function () {
            console.log('ready');
            $http({
                url: contextPath + '/api/v1/cart/merge',
                method: 'GET',
                params: {
                    'cartId': $localStorage.aprilCartId
                }
            }).then(function (response) {
                console.log('ready');
                location.reload();

            });
        }

        $rootScope.tryToAuth = function () {
            $http.post(contextPath + '/auth', $rootScope.user)
                .then(function successCallback(response) {
                    if (response.data.token) {
                        $http.defaults.headers.common.Authorization = 'Bearer ' + response.data.token;
                        $localStorage.aprilMarketCurrentUser = {username: $rootScope.user.username, token: response.data.token};

                        $rootScope.mergeCarts();

                        $rootScope.user.username = null;
                        $rootScope.user.password = null;
                    }
                }, function errorCallback(response) {
                    delete $localStorage.aprilMarketCurrentUser;
                    $rootScope.isUserLoggedIn = false;
                    $http.defaults.headers.common.Authorization = '';
                });
        };

        $rootScope.tryToLogout = function () {
            $rootScope.clearUser();
            $location.path('/');
        };

        $rootScope.clearUser = function () {
            delete $localStorage.aprilMarketCurrentUser;
            $rootScope.isUserLoggedIn = false;
            $http.defaults.headers.common.Authorization = '';
            location.reload();
        };

    }
})();

angular.module('app').controller('indexController',
    function ($scope, $http, $localStorage, $location, $cookies) {
    const contextPath = 'http://localhost:8189/market';
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
                    delete $localStorage.aprilMarketCurrentUser;
                    $scope.isUserLoggedIn = false;
                    $http.defaults.headers.common.Authorization = '';
                });
        };

        $scope.tryToLogout = function () {
            $scope.clearUser();
            $location.path('/');
        };

        $scope.clearUser = function () {
            delete $localStorage.aprilMarketCurrentUser;
            $scope.isUserLoggedIn = false;
            $http.defaults.headers.common.Authorization = '';
            location.reload();
        };
});