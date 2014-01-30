describe('thaana.angular', function() {

    var element,
        $scope,
        thaanaElement,
        thaanaService,
        triggerKeyPress,
        pressKeysOnElement;

    thaanaElement = '<input type="text" ng-thaana ng-model="inputcontent" />';
    
    beforeEach(module('thaana.angular'));

    beforeEach(inject(function ($compile, $rootScope, ngThaana) {
        $scope = $rootScope;
        element = angular.element(thaanaElement);
        $compile(element)($rootScope);
        thaanaService = ngThaana;
    }));


    triggerKeyPress = function (elm, keyCode) {
        var inputEl = elm;
        var e = jQuery.Event('keypress');
        e.which = keyCode;
        inputEl.trigger(e);
    };

    pressKeysOnElement = function (elem, keysToPress) {
        for (var indx in keysToPress) {
            triggerKeyPress(elem, keysToPress[indx]);
        }
    };


    var getCharCode = function(char) {
        return char.charCodeAt(0);
    };


    var strToCharCode = function (str) {
        var collection = [],
            code;

        for (var indx in str) {
            code = getCharCode(str[indx]);
            collection.push(code);
        }

        return collection;
    };


    describe('ngThaana', function() {
        
        it("should add class thaana to the element", function () {
            thaanaService.config('activated', true);
            $scope.$digest();
            expect(element.hasClass("thaana")).toBe(true);
        });


        it("should deactivate thaanaService config activated ", function () {
            thaanaService.config('activated', false);
            $scope.$digest();
            expect(thaanaService.config('activated')).toBe(false);
        });

        it("should not have class thaana added to element when deactivated", function () {
            thaanaService.config('activated', false);
            $scope.$digest();
            expect(element.hasClass("thaana")).toBe(false);
        });


        it("should capture key and translate to thaana and update ngModel", function () {

            
            keysToPress = strToCharCode("divehi");
            pressKeysOnElement(element, keysToPress);
            $scope.$digest();
            
            var thaanaContent = thaanaService.getContent();
            
            expect(thaanaContent).toBe("ދިވެހި");

            var inputModelContent = $scope.inputcontent;
            expect(inputModelContent).toBe("ދިވެހި");

        });


    });
});