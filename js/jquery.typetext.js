
(function ($) {

    "use strict";



    var OptionManager = function () {

        var objToReturn = {};

        var defaultOptions = {
            message: "{ message: 'pass object like this' }",
            index: 0,
            append: false,
            newLine: false,
            cursorChar: "|",
            cursorShow: true,
            typeSpeed: 100,
            beforeTextType: function () { },
            afterTextType: function () { },
            onLetterType: function () { },
        };

        var getOptions = function (customOptions) {
            var options = $.extend({}, defaultOptions);
            if (typeof customOptions === 'object') {
                $.extend(options, customOptions);
            }
            return options;
        }

        objToReturn.getOptions = getOptions;

        return objToReturn;
    }();



    

    var TypeText = function (target, userOptions) {
        var objToReturn = {};

        var targetObj = $(target);
        var options = OptionManager.getOptions(userOptions);


        var showText = function () {
            if (options.index >= options.message.length) {
                options.afterTextType();
                return targetObj;
            }

            options.onLetterType();

            options.index++;
            var cursor = (options.cursorShow == true ? options.cursorChar : "");
            targetObj.text(options.message.substring(0, options.index) + cursor);

            setTimeout(function () {
                showText(targetObj, options);
            }, options.typeSpeed);

            return targetObj;
        }

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
                options.message = targetObj.text() + options.message;
                options.index = targetObj.text().length;
            }
            return targetObj;
        }


        var typeForward = function () {
            options.beforeTextType();
            setNewLineAttribute();
            setBaseTextOnMessage();
            showText();
            return targetObj;
        }

        objToReturn.typeForward = typeForward;
        return objToReturn;
    }

    
    


    $.fn.typeText = function (userOptions) {
        var typeIt = new TypeText(this, userOptions);
        return typeIt.typeForward();
    }


})(jQuery);
