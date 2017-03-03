describe('Unit: NavController tests', function(){
    var controller; // NavController
    var $controller;
    var $rootScope;

    // Init Angular App
    beforeEach(module('leansite'));

    // Init test variables
    beforeEach(inject(function(_$controller_, _$rootScope_){
        $controller = _$controller_;
        $rootScope = _$rootScope_;
    }));

    // Init NavController
    beforeEach(function(){
        var $scope = {};
        $scope.$on = jasmine.createSpy('$on')
        controller = $controller('NavController', {$scope: $scope});
        // $rootScope.$digest();
    });

    describe('NavController Method tests', function(){

    });
});