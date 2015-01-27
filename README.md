jquery.typetext
===============

jQuery Plugin for typing effect on text.

## typeText
It is a simple jQuery plugin that displays, removes or highlights a sequences of characters letter by letter similar to a typewriter.
## How to Use It
Include jQuery library on the web page
```javascript
<script type='text/javascript' src="js/jquery-2.1.1.min.js"></script>
<script type='text/javascript' src="js/jquery.typetext.js"></script>
```
Add this js
```javascript
<script type="text/javascript">
     $(function () {
         // selector may be an ID, class, tag name or etc
         $("selector").typeText("toggle", options);
     });
</script>
```
## Options
You can change the effect by modifying **options**.
```javascript
var options = {
                // COMMON
                message: "Hello World!",
                messageIndex: 0,
                newLine: true,``
                cursorChar: "|",
                cursorShow: true,

                // TYPE
                append: false,
                cursorShowAfterTextType: false,
                typeSpeed: 50,
                beforeTextType: function () { },
                afterTextType: function () { },
                onLetterType: function () { },

                // BACKSPACE
                cursorShowAfterTextBackspace: false,
                backspaceSpeed: 50,
                beforeTextBackspace: function () { },
                afterTextBackspace: function () { },
                onLetterBackspace: function () { },

                // TOGGLE
                toggleDelayForType: 1000,
                toggleDelayForBack: 2000,
                toggleLoop: true,
                toggleArrayIndex: 0,
                toggleMessageArray: ["This is a jQuery TypeText plugin.", "It has 4 commands - type, backspace, highlight and toggle.", "You can customize it's functionality by changing options."],
                beforeToggle: function () { console.log("beforeToggle"); },
                afterToggle: function () { console.log("afterToggle"); },
                toggleHighlight: false,

                // HIGHLIGHT
                cursorShowAfterTextHighlight: false,
                highlightSpeed: 100,
                beforeTextHighlight: function () { },
                afterTextHighlight: function () { },
                onLetterHighlight: function () { },
                highlightColor: "activeborder"
            };
```
## End
Thanks for checking this out. If you have any questions, please contact with this email: 13ratul@gmail.com
