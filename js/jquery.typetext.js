
(function ($) {

    "use strict";



    var OptionManager = function () {

        var objToReturn = {};

        var defaultOptions = {
            // COMMON
            message: "{ message: 'pass object like this' }",
            index: 0,
            newLine: false,
            cursorChar: "|",
            cursorShow: false,
            cursorObject: {},                       // This will be overriden

            // TYPE
            baseText: "",                           // This will be overriden
            append: false,
            cursorShowAfterTextType: false,
            typeSpeed: 100,
            beforeTextType: function () { },
            afterTextType: function () { },
            onLetterType: function () { },

            // BACKSPACE
            cursorShowAfterTextBackspace: false,
            backspaceSpeed: 100,
            beforeTextBackspace: function () { },
            afterTextBackspace: function () { },
            onLetterBackspace: function () { },
            //highlightShowBeforeBackspace: false,

            // TOGGLE
            toggleDelayForType: 1000,
            toggleDelayForBackspace: 1000,
            toggleLoop: false,                      
            toggleCount: 0,                         // This will be overriden
            toggleMessageArray: ["You have forgotten to add 'toggleMessageArray'", "{ toggleMessageArray: ['pass', 'object', 'like', 'this'] }"],

            // HIGHLIGHT
            cursorShowAfterTextHighlight: false,
            highlightSpeed: 100,
            beforeTextHighlight: function () { },
            afterTextHighlight: function () { },
            onLetterHighlight: function () { },
            highlightColor: "activeborder"
        };

        var getCursorObject = function (options) {
            // add CSS class named 'typeTextCursor' for customize the cursor
            var cursorObject = $("<span class='typeTextCursor'>" + (options.cursorShow == true ? options.cursorChar : "") + "</span>");
            return cursorObject;
        }

        var getOptions = function (customOptions) {
            var options = $.extend({}, defaultOptions);
            if (typeof customOptions === 'object') {
                $.extend(options, customOptions);
            }
            // user modified value is overriden
            options.cursorObject = getCursorObject(options);
            options.toggleCount = 0;
            return options;
        }

        objToReturn.getOptions = getOptions;

        return objToReturn;
    }();





    var TypeText = function (target, userOptions) {
        var objToReturn = {};

        /*
        PRIVATE
        */
        var targetObj = $(target);
        var options = OptionManager.getOptions(userOptions);

        // WRITE
        var setNewLineAttribute = function () {
            if (options.newLine === true) {
                targetObj.css("white-space", "pre");
            } else {
                targetObj.css("white-space", "inherit");
            }
            return targetObj;
        }

        var setBaseTextOnMessage = function () {
            if (options.append === true) {
                options.cursorObject.remove();
                options.baseText = targetObj.text().trim();
            }
            return options;
        }

        var showText = function () {
            if (options.index >= options.message.length) {
                options.afterTextType();
                if (options.cursorShowAfterTextType === false) {
                    options.cursorObject.remove();
                }
                return targetObj;
            }

            options.onLetterType();

            options.index++;
            targetObj.text(options.baseText + options.message.substring(0, options.index)).append(options.cursorObject);

            setTimeout(function () {
                showText();
            }, options.typeSpeed);

            return targetObj;
        }

        // BACKSPACE
        var loadOptionWithSelectorText = function () {
            options.cursorObject.remove();
            // in 'toggle' mode, this 'message' is used for 'write'
            options.message = targetObj.text().trim();
            options.index = options.message.length;
            return options;
        }

        var backspaceText = function () {
            if (options.index <= 0) {
                options.afterTextBackspace();
                if (options.cursorShowAfterTextBackspace === false) {
                    options.cursorObject.remove();
                }
                return targetObj;
            }

            options.onLetterBackspace();

            options.index--;
            targetObj.text(options.message.substring(0, options.index)).append(options.cursorObject);

            setTimeout(function () {
                backspaceText();
            }, options.backspaceSpeed);

            return targetObj;
        }

        // TOGGLE
        var appendNewFunctionWithPreviousByProperty = function (propertyName, oldFunction, newFunction) {
            options[propertyName] = function () {
                oldFunction();
                newFunction();
            }
            return options;
        }

        // HIGHLIGHT
        var highlightText = function (highlightSpanObj) {
            if (options.index <= 0) {
                options.afterTextHighlight();
                if (options.cursorShowAfterTextHighlight === false) {
                    options.cursorObject.remove();
                }
                return targetObj;
            }

            options.onLetterHighlight();

            options.index--;
            targetObj.text(options.message.substring(0, options.index)).append(options.cursorObject).append(highlightSpanObj);
            highlightSpanObj.text(options.message.substring(options.index));

            setTimeout(function () {
                highlightText(highlightSpanObj);
            }, options.highlightSpeed);

            return targetObj;
        }

        var write = function () {
            options.beforeTextType();
            setNewLineAttribute();
            setBaseTextOnMessage();
            showText();
            return targetObj;
        }

        var backspace = function () {
            options.beforeTextBackspace();
            loadOptionWithSelectorText();
            backspaceText();
            return targetObj;
        }

        var toggle = function () {
            appendNewFunctionWithPreviousByProperty("beforeTextType", options.beforeTextType, function () {
                options.message = options.toggleMessageArray[options.toggleCount];
            });
            appendNewFunctionWithPreviousByProperty("afterTextType", options.afterTextType, function () {
                setTimeout(backspace, options.toggleDelayForType);
            });

            appendNewFunctionWithPreviousByProperty("afterTextBackspace", options.afterTextBackspace, function () {
                options.toggleCount++;
                // after showing whole array, check loop for showing from first.
                if (options.toggleCount === options.toggleMessageArray.length) {
                    if (options.toggleLoop === false) {
                        return;
                    }
                    options.toggleCount = 0;
                }
                setTimeout(write, options.toggleDelayForBackspace);
            });

            write();
            return targetObj;
        }

        var highlight = function () {
            options.beforeTextBackspace();
            loadOptionWithSelectorText();

            var highlightSpanObj = $("<span>").css("background-color", options.highlightColor);
            highlightText(highlightSpanObj);
            return targetObj;
        }

        /*
        PUBLIC
        */
        objToReturn.write = write;
        objToReturn.backspace = backspace;
        objToReturn.toggle = toggle;
        objToReturn.highlight = highlight;
        return objToReturn;
    }





    $.fn.typeText = function (command, userOptions) {
        return $.each(this, function () {
            var typeIt = new TypeText(this, userOptions);
            typeIt[command]();
        });
    }


})(jQuery);
