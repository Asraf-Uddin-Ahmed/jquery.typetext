
(function ($) {

    "use strict";



    var OptionManager = function () {

        var objToReturn = {};

        var defaultOptions = {
            message: "{ message: 'pass object like this' }",
            typeSpeed: 100,
            index: 0,
            append: false,
            newLine: false,
            beforeTextType: function () { },
            afterTextType: function () { },
            onLetterType: function () { },
        };

        var getOptions = function (customOptions) {
            var options = $.extend({}, defaultOptions);
            $.extend(options, customOptions);
            return options;
        }

        objToReturn.getOptions = getOptions;

        return objToReturn;
    }();



    

    var TypeText = function (target, options) {



    };


    
    var showText = function (targetObj, options) {
        if (options.index >= options.message.length) {
            options.afterTextType();
            return targetObj;
        }

        options.onLetterType();

        options.index++;
        targetObj.text(options.message.substring(0, options.index));

        setTimeout(function () {
            showText(targetObj, options);
        }, options.typeSpeed);
        return targetObj;
    }

    var setNewLineAttribute = function (targetObj, options) {
        if (options.newLine === true) {
            targetObj.css("white-space", "pre");
        } else {
            targetObj.css("white-space", "inherit");
        }
        return targetObj;
    }
    
    var setBaseTextOnMessage = function (targetObj, options) {
        if (options.append === true) {
            options.message = targetObj.text() + options.message;
            options.index = targetObj.text().length;
        }
        return targetObj;
    }



    $.fn.typeText = function (customOptions) {
        var options = OptionManager.getOptions(customOptions);

        options.beforeTextType();
        setNewLineAttribute($(this), options);
        setBaseTextOnMessage($(this), options);

        return showText($(this), options);
    }

})(jQuery);
