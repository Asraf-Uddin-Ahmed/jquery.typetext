
(function ($) {

    "use strict";



    var OptionManager = function () {

        var objToReturn = {};

        var defaultOptions = {
            // COMMON
            message: "{ message: 'pass object like this' }",
            messageIndex: 0,
            newLine: false,
            cursorChar: "|",
            cursorShow: false,
            cursorObject: {},                       // This will be overridden

            // TYPE
            baseText: "",                           // This will be overridden
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

            // TOGGLE
            toggleDelayForType: 1000,
            toggleDelayForBack: 1000,
            toggleLoop: false,                      
            toggleArrayIndex: 0,
            toggleMessageArray: ["You have forgotten to add 'toggleMessageArray'", "{ toggleMessageArray: ['pass', 'object', 'like', 'this'] }"],
            beforeToggle: function () { },
            afterToggle: function () { },
            toggleHighlight: false,                      
            
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
            // user modified value is overridden
            options.cursorObject = getCursorObject(options);
            options.toggleArrayIndex %= options.toggleMessageArray.length;  // adjust index for exceeded length
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

        // COMMON
        var loadOptionWithSelectorText = function () {
            options.cursorObject.remove();
            // in 'toggle' mode, this 'message' is used for 'write'
            options.message = targetObj.text().trim();
            options.messageIndex = options.message.length;
            return options;
        }

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
            if (options.messageIndex >= options.message.length) {
                options.afterTextType();
                if (options.cursorShowAfterTextType === false) {
                    options.cursorObject.remove();
                }
                return targetObj;
            }

            options.onLetterType();

            options.messageIndex++;
            targetObj.text(options.baseText + options.message.substring(0, options.messageIndex)).append(options.cursorObject);

            setTimeout(function () {
                showText();
            }, options.typeSpeed);

            return targetObj;
        }

        // BACKSPACE
        var backspaceText = function () {
            if (options.messageIndex <= 0) {
                options.afterTextBackspace();
                if (options.cursorShowAfterTextBackspace === false) {
                    options.cursorObject.remove();
                }
                return targetObj;
            }

            options.onLetterBackspace();

            options.messageIndex--;
            targetObj.text(options.message.substring(0, options.messageIndex)).append(options.cursorObject);

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
            if (options.messageIndex <= 0) {
                options.afterTextHighlight();
                if (options.cursorShowAfterTextHighlight === false) {
                    options.cursorObject.remove();
                }
                return targetObj;
            }

            options.onLetterHighlight();

            options.messageIndex--;
            targetObj.text(options.message.substring(0, options.messageIndex)).append(options.cursorObject).append(highlightSpanObj);
            highlightSpanObj.text(options.message.substring(options.messageIndex));

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
            options.beforeToggle();

            // before text type, set message
            appendNewFunctionWithPreviousByProperty("beforeTextType", options.beforeTextType, function () {
                options.message = options.toggleMessageArray[options.toggleArrayIndex];
            });

            // after text type, set backspace or highlight
            appendNewFunctionWithPreviousByProperty("afterTextType", options.afterTextType, function () {
                if (options.toggleHighlight === true) {
                    setTimeout(highlight, options.toggleDelayForType);
                } else {
                    setTimeout(backspace, options.toggleDelayForBack);
                }
            });

            // after text backspace or highlight, set write
            var fnSetWrite = function () {
                options.toggleArrayIndex++;
                // after showing whole array, check loop for showing from first.
                if (options.toggleArrayIndex === options.toggleMessageArray.length) {
                    if (options.toggleLoop === false) {
                        options.afterToggle();
                        return;
                    }
                    options.toggleArrayIndex = 0;
                }
                setTimeout(write, options.toggleDelayForType);
            }
            if (options.toggleHighlight === true) {
                appendNewFunctionWithPreviousByProperty("afterTextHighlight", options.afterTextHighlight, function () {
                    targetObj.text("");
                    fnSetWrite();
                });
            } else {
                appendNewFunctionWithPreviousByProperty("afterTextBackspace", options.afterTextBackspace, fnSetWrite);
            }

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
