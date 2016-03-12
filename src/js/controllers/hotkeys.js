var Hotkeys = new function () {
    var stack = {};

    var register = function (keyName, keyCode) {
        stack[keyName] = {
            key: keyCode,
            events: {}
        };

        return {
            on: function (eventName, callback) {
                stack[keyName].events[eventName] = callback;
            },
            off: function (eventName) {
                delete stack[keyName].events[eventName];
            }
        }
    };

    $(document).keydown(function (e) {
        var hotkey = _.find(stack, ['key', e.which]);

        if (hotkey !== undefined) {
            var keys = Object.keys(hotkey.events);
            var key = keys[keys.length - 1];

            if (typeof hotkey.events[key] === 'function') {
                e.preventDefault();
                hotkey.events[key]();
            }
        }

    });

    return {
        enter: register('enter', 13),
        esc: register('esc', 27),
        up: register('up', 38),
        down: register('down', 40),
        delete: register('delete', 46)
    };
}();
