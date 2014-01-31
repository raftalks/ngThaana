(function () {
    'use strict';
    /* global angular */
    

    angular.module('thaana.angular', [])

    .constant('keyboardLayout', {
         32:160, 190:65106, 59:1563, 188: 1548, 113: 1968, 119: 1927, 101: 1964, 114: 1923, 116: 1932, 121: 1940, 117: 1962, 105: 1960, 111: 1966, 112: 1941, 97: 1958, 115: 1936, 100: 1931, 102: 1930, 103: 1934, 104: 1920, 106: 1942, 107: 1926, 108: 1933, 122: 1938, 120: 215, 99: 1943, 118: 1928, 98: 1924, 110: 1922, 109: 1929, 81: 1956, 87: 1954, 69: 1965, 82: 1948, 84: 1939, 89: 1952, 85: 1963, 73: 1961, 79: 1967, 80: 247, 65: 1959, 83: 1921, 68: 1937, 70: 65010, 71: 1955, 72: 1945, 74: 1947, 75: 1946, 76: 1925, 90: 1953, 88: 1944, 67: 1949, 86: 1957, 66: 1950, 78: 1935, 77: 1951
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

        var isMac = navigator.platform.toUpperCase().indexOf('MAC')!==-1;
        var isWindows = navigator.platform.toUpperCase().indexOf('WIN')!==-1;
        var isLinux = navigator.platform.toUpperCase().indexOf('LINUX')!==-1;
        

        var ngThaanaService = ['$rootScope', 'keyboardLayout', function($rootScope, keyboardLayout) {

            var translateKeyToCharacter = function (keyCode) {
                return String.fromCharCode(keyCode);
            };

            var translateToThaanaCharacter = function (keyCode) {
                
                

                if(thaanaConfig.keyboardLayout[keyCode] !== undefined) {
                    var charecter = translateKeyToCharacter(thaanaConfig.keyboardLayout[keyCode]);
                    return charecter;
                }  else {
                    return translateKeyToCharacter(keyCode);
                }
            };

            //set language
            thaanaConfig.keyboardLayout = keyboardLayout;

            return {
                config: function (key, setValue) {
                    if(setValue === undefined) {
                       return  thaanaConfig[key];
                    } else {
                       thaanaConfig[key] = setValue;
                    }
                },

                translate: function(keyCode, isShift) {
                    if(isShift) {
                        //check if the code range is a number key and if number key, we skip translation
                        return translateToThaanaCharacter(keyCode);
                    } else {
                        //normalize key 
                       var latin = translateKeyToCharacter(keyCode);
                       var normalChar = latin;
                       
                       if(keyCode > 64) {
                            normalChar = latin.toLowerCase();
                       } else {
                            console.log('below alphabet '+keyCode);
                       }
                      
                       keyCode = normalChar.charCodeAt(0);

                       console.log('converting latin '+latin+ ' to '+normalChar+' with code '+keyCode);
                       
                       return translateToThaanaCharacter(keyCode);
                    }

                    
                }
            };


        }];

        return {
            $get: ngThaanaService
        };
    })

    .directive('ngThaana', ['$log', 'ngThaana', function ($log, ngThaana) {
        
        var getKeyCode = function(keyEvent) {
            var e = keyEvent || window.event;
            if(keyEvent)
            {
                if(typeof e.which == "number") {
                     var charCode = e.which;
                     return charCode;
                }
            }
            
           
            return (window.event ? keyEvent.keyCode : keyEvent.which);
        };

        var LinkFn = function(scope, element, attr) {

            scope.thaanakeyboardActive = false;

            scope.$watch(function() {
                return ngThaana.config('activated');
            }, function (state) {
                if(state) {
                    element.addClass('thaana');
                    element.attr('dir', 'rtl');
                    scope.thaanakeyboardActive = true;
                } else {
                    element.removeClass('thaana');
                    element.removeAttr('dir');
                    scope.thaanakeyboardActive = false;
                }
            });


            scope.$watch('thaanakeyboardActive', function(activated) {

                if(activated) {
                    console.log('activated');
                    scope.keypressThaana = false;
                    scope.shiftKeyDown = false;

                    element.bind('keyup', function(evt) {
                        var currentkeyCode = getKeyCode(evt);
                        //Deactivate ShiftKey Press
                        if(currentkeyCode === 16) {
                            scope.shiftKeyDown = false;
                        }
                    });

                    element.bind('keydown', function(evt) {
                
                        var currentkeyCode = getKeyCode(evt);

                        //activate shiftKey Press
                        if(currentkeyCode === 16) {
                            scope.shiftKeyDown = true;
                        }

                        //escape controlKey, Alt Key, CommandKey(Meta) Key on MAC
                        //we want to escape translating any keys when any of the special keys are down
                        if(evt.ctrlKey === true || evt.altKey === true || evt.metaKey === true || (currentkeyCode < 32 && currentkeyCode !== 8))
                        {
                            console.log('special key');
                            return true;
                        } else {
                            // handle backspace
                            if(currentkeyCode == 8) {
                                $(this).sendkeys('{backspace}');
                            } else {

                                // when shift is down and pressed on number keys, we skip translation
                                if(scope.shiftKeyDown === true && currentkeyCode < 65) {
                                    return true;
                                } else {

                                    evt.preventDefault();
                                    var Character = ngThaana.translate(currentkeyCode, scope.shiftKeyDown); //String.fromCharCode(currentkeyCode);
                                   
                                    $(this).sendkeys(Character);
                                }

                                
                            }
                        }   

                        
                    });
                } else {
                    scope.keypressThaana = false;
                    scope.shiftKeyDown = false;

                    element.unbind();
                }
            });

        };
        return {
            restrict: 'A',
            link: LinkFn
        };
    }]);
})();