(function () {
    'use strict';
    /* global angular */

    angular.module('thaana.angular', [])

    .constant('keyboardLayout', {
         113: 1968, 119: 1927, 101: 1964, 114: 1923, 116: 1932, 121: 1940, 117: 1962, 105: 1960, 111: 1966, 112: 1941, 97: 1958, 115: 1936, 100: 1931, 102: 1930, 103: 1934, 104: 1920, 106: 1942, 107: 1926, 108: 1933, 122: 1938, 120: 215, 99: 1943, 118: 1928, 98: 1924, 110: 1922, 109: 1929, 81: 1956, 87: 1954, 69: 1965, 82: 1948, 84: 1939, 89: 1952, 85: 1963, 73: 1961, 79: 1967, 80: 247, 65: 1959, 83: 1921, 68: 1937, 70: 65010, 71: 1955, 72: 1945, 74: 1947, 75: 1946, 76: 1925, 90: 1953, 88: 1944, 67: 1949, 86: 1957, 66: 1950, 78: 1935, 77: 1951
    })

    /**
     * ngThaanaProvider Service with configuration options
     * @return {service} 
     */
    .provider('ngThaana', function() {

        var thaanaConfig = {
            activated: true,
            keyboardLayout : {}
        };

        this.config = function(setKey, setValue) {
            thaanaConfig[setKey] = setValue;
        };

        

        var ngThaanaService = ['$rootScope', 'keyboardLayout', function($rootScope, keyboardLayout) {

            var translateKeyToCharacter = function (keyCode) {
                return String.fromCharCode(keyCode);
            };

            var translateToThaanaCharacter = function (keyCode) {
                
                if(thaanaConfig.keyboardLayout[keyCode] !== undefined) {
                    var char = translateKeyToCharacter(thaanaConfig.keyboardLayout[keyCode]);
                    return char;
                }  else {
                    return translateKeyToCharacter(keyCode);
                }
                
            };


            /**
             * Islolated Scope
             * @type {ngScope}
             */
            var $scope = $rootScope.$new(true);
            thaanaConfig.keyboardLayout = keyboardLayout;

            $scope.originalContent = '';
            $scope.translatedThaanaContent = '';

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

                setOriginalContent : function (content) {
                    $scope.originalContent = content;
                },

                getContent : function () {
                    return $scope.translatedContent;
                },

                setTranslatedContent : function (content) {
                    $scope.translatedContent = content;
                },

                onKeypress : function (charCode) {
             
                    var originHistory = angular.copy(this.originalContent());
                    var origin;

                    if(originHistory !== undefined) {
                        origin = originHistory + translateKeyToCharacter(charCode);
                    } else {
                        origin = translateKeyToCharacter(charCode);
                    }
                    
                    this.setOriginalContent(origin);

                        

                    //translate
                    var transContentHistory = angular.copy(this.getContent());
                    var transContent;

                    if(transContentHistory !== undefined) {
                        transContent = transContentHistory + translateToThaanaCharacter(charCode);
                    } else {
                        transContent = translateToThaanaCharacter(charCode);
                    }
                    
                    this.setTranslatedContent(transContent);
                   
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
                     element.attr('dir', 'rtl');
                } else {
                     element.removeClass('thaana');
                      element.removeAttr('dir');
                }
            });


            element.bind('keypress', function(evt) {
                evt.preventDefault();
                ngThaana.onKeypress(evt.which);
                var content = ngThaana.getContent();
                //update ngModel
                

                scope.$apply(function() {
                    if(ngModel !== undefined) {
                        ngModel.$setViewValue(content);
                    }
                });
            });

           
        };

        return {
            restrict: 'A',
            require: '?ngModel',
            link: LinkFn
        };
    }]);



})();