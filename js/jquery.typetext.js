
(function ($) {

    "use strict";



    var OptionManager = function () {

        var objToReturn = {};

        var defaultOptions = {
            // COMMON
            message: "{ message: 'pass object like this' }",
            baseText: "",
            index: 0,
            append: false,
            newLine: false,
            cursorChar: "|",
            cursorShow: false,

            // TYPE
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
        };

        var getOptions = function (customOptions) {
            var options = $.extend({}, defaultOptions);
            if (typeof customOptions === 'object') {
                $.extend(options, customOptions);
            }
            // user modification of this cursorHTML, will be overriden
            options.cursorObject = getCursorObject(options);
            return options;
        }

        var getCursorObject = function (options) {
            // add CSS class named 'typeTextCursor' for customize the cursor
            var cursorObject = $("<span class='typeTextCursor'>" + (options.cursorShow == true ? options.cursorChar : "") + "</span>");
            return cursorObject;
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
                options.baseText = targetObj.text();
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
            options.message = targetObj.text();
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
            targetObj.text(options.baseText + options.message.substring(0, options.index)).append(options.cursorObject);

            setTimeout(function () {
                backspaceText(targetObj, options);
            }, options.backspaceSpeed);

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
            prepareOptionForBackspace();
            backspaceText();
            return targetObj;
        }


        objToReturn.write = write;
        objToReturn.backspace = backspace;
        return objToReturn;
    }

    
    


    $.fn.typeText = function (command, userOptions) {
        var typeIt = new TypeText(this, userOptions);
        return typeIt[command]();
    }


})(jQuery);
