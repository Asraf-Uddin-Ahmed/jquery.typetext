
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

            // TYPE
            baseText: "",
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
            toggleDelayForBackspace: 1000,
            toggleLoop: false,
            toggleCount: 0,
            toggleMessageArray: ["You have forgotten to add 'toggleMessageArray'", "{ toggleMessageArray: ['pass', 'object', 'like', 'this'] }"]
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
                showText(targetObj, options);
            }, options.typeSpeed);

            return targetObj;
        }

        // BACKSPACE
        var prepareOptionForBackspace = function () {
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
                backspaceText(targetObj, options);
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

        var write = function () {
            options.beforeTextType();
            setNewLineAttribute();
            setBaseTextOnMessage();
            showText();
            return targetObj;
        }

        var backspace = function () {
            options.beforeTextBackspace();
            prepareOptionForBackspace();
            backspaceText();
            return targetObj;
        }

        var toggle = function () {
            appendNewFunctionWithPreviousByProperty("beforeTextType", options.beforeTextType, function () {
                var currentToggleMessageIndex = options.toggleCount % options.toggleMessageArray.length;
                options.message = options.toggleMessageArray[currentToggleMessageIndex];
            });
            appendNewFunctionWithPreviousByProperty("afterTextType", options.afterTextType, function () {
                setTimeout(backspace, options.toggleDelayForType);
            });

            if (options.toggleLoop === true) {
                // execute previously defined function 'afterTextBackspace' with toggle for TYPE
                appendNewFunctionWithPreviousByProperty("afterTextBackspace", options.afterTextBackspace, function () {
                    options.toggleCount++;
                    setTimeout(write, options.toggleDelayForBackspace);
                });
            }

            write();
            return targetObj;
        }

        /*
        PUBLIC
        */
        objToReturn.write = write;
        objToReturn.backspace = backspace;
        objToReturn.toggle = toggle;
        return objToReturn;
    }





    $.fn.typeText = function (command, userOptions) {
        return $.each(this, function () {
            var typeIt = new TypeText(this, userOptions);
            typeIt[command]();
        });
    }


})(jQuery);
