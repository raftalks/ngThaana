(function () {
    'use strict';
    /* global angular */

    angular.module('thaana.angular', [])

    /**
     * ngThaanaProvider Service with configuration options
     * @return {service} 
     */
    .provider('ngThaana', function() {

        var thaanaConfig = {
            activated: true
        };

        this.config = function(setKey, setValue) {
            thaanaConfig[setKey] = setValue;
        };

        var translateKeyToCharacter = function (keyCode) {
            return String.fromCharCode(keyCode);
        };

        var ngThaanaService = ['$rootScope', function($rootScope) {

            /**
             * Islolated Scope
             * @type {ngScope}
             */
            var $scope = $rootScope.$new(true);
            $scope.originalContent = '';

            return {
                config: function (key, setValue) {
                    if(setValue === undefined) {
                       return  thaanaConfig[key];
                    } else {
                       thaanaConfig[key] = setValue;
                    }
                },



                originalContent : function () {
                    return $scope.originalContent;
                },

                setContent : function (content) {
                    $scope.originalContent = content;
                },

                onKeypress : function (charCode) {
                    var origin = angular.copy(this.originalContent());
                        origin = origin + translateKeyToCharacter(charCode);

                        this.setContent(origin);
                }
            };


        }];

        return {
            $get: ngThaanaService
        };
    })



    .directive('ngThaana', ['$log', 'ngThaana', function ($log, ngThaana) {
        
        var LinkFn = function(scope, element, attr, ngModel) {

            scope.$watch(function() {
                return ngThaana.config('activated');
            }, function (state) {
                if(state) {
                     element.addClass('thaana');
                } else {
                     element.removeClass('thaana');
                }
            });


            element.bind('keypress', function(evt) {
                ngThaana.onKeypress(evt.which);
            });

           
        };

        return {
            restrict: 'A',
            require: '?ngModel',
            link: LinkFn
        };
    }]);



})();