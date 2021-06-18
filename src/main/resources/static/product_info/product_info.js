angular.module('app').controller('productInfoController', function ($scope, $http, $localStorage, $routeParams) {
    const contextPath = 'http://localhost:8189/market';

    $scope.loadProduct = function () {
        $http({
            url: contextPath + '/api/v1/products/' + $routeParams.productIdParam,
            method: 'GET'
        }).then(function (response) {
            $scope.prod = response.data;
        });
    };

    $scope.loadProduct();
});