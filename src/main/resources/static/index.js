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

        $rootScope.clearUser = function (needReload = true) {
            delete $localStorage.aprilMarketCurrentUser;
            $rootScope.isUserLoggedIn = false;
            $http.defaults.headers.common.Authorization = '';
            if (needReload) {
                location.reload();
            }
        };

        if ($localStorage.aprilMarketCurrentUser) {
            // проверим не протух ли токен
            $http.post(contextPath + '/auth/check_auth', $localStorage.aprilMarketCurrentUser)
                .then(function successCallback(response) {
                    if (response.data.token) {
                        $http.defaults.headers.common.Authorization = 'Bearer ' + response.data.token;
                        $rootScope.isUserLoggedIn = true;
                    } else {
                        $rootScope.clearUser();
                    }
                }, function errorCallback(response) {
                    $rootScope.clearUser();
                });

        } else {
            $rootScope.clearUser(false);
        }

        if (!$localStorage.aprilCartId) {

            $http({
                url: contextPath + '/api/v1/cart/generate',
                method: 'GET'
            }).then(function (response) {
                $localStorage.aprilCartId = response.data.str;
            });
        }

        $rootScope.tryToAuth = function (user = null) {
            if (user === null) {
                return;
            }
            $http.post(contextPath + '/auth', user)
                .then(function successCallback(response) {
                    if (response.data.token) {
                        $http.defaults.headers.common.Authorization = 'Bearer ' + response.data.token;
                        $localStorage.aprilMarketCurrentUser = {username: user.username, token: response.data.token};

                        $rootScope.mergeCarts();

                        user.username = null;
                        user.password = null;
                    }
                }, function errorCallback(response) {
                    $rootScope.clearUser();
                });
        };

        $rootScope.tryToLogout = function () {
            $rootScope.clearUser();
            $location.path('/');
        };

        $rootScope.loadCart = function (page) {
            $http({
                url: contextPath + '/api/v1/cart',
                method: 'GET',
                params: {
                    cartName: $localStorage.aprilCartId
                }
            }).then(function (response) {
                $rootScope.cartDto = response.data;
                $rootScope.updateCountProductToTop(response.data.countProductInCart);
            });
        };

        $rootScope.mergeCarts = function () {
            $http({
                url: contextPath + '/api/v1/cart/merge',
                method: 'GET',
                params: {
                    'cartId': $localStorage.aprilCartId
                }
            }).then(function (response) {
                location.reload();
            });
        }

        $rootScope.addToCart = function (productId) {
            $http({
                url: contextPath + '/api/v1/cart/add/',
                method: 'GET',
                params: {
                    prodId: productId,
                    cartName: $localStorage.aprilCartId
                }
            }).then(function (response) {
                $rootScope.updateCountProductToTop(response.data);
            });
        }

        $rootScope.updateCountProductToTop = function (countProductInCart) {
            $("#count_products").html(countProductInCart);
        }

        $rootScope.loadCart();
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
                        $localStorage.aprilMarketCurrentUser = {
                            username: $scope.user.username,
                            token: response.data.token
                        };

                        $scope.mergeCarts();

                        $scope.user.username = null;
                        $scope.user.password = null;
                    }
                }, function errorCallback(response) {
                    $scope.clearUser();
                });
        };
    }
);
