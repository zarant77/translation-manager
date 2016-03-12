var Message = new function () {
    this.confirm = function (text, callback) {
        var n = noty({
            text: text,
            layout: 'center',
            modal: true,
            killer: true,
            animation: {
                open: {height: 'toggle'},
                close: {height: 'toggle'},
                easing: 'swing',
                speed: 100
            },
            buttons: [{
                addClass: 'btn btn-primary', text: 'Ok', onClick: function ($noty) {
                    $noty.close();
                    callback()
                }
            }, {
                addClass: 'btn btn-danger', text: 'Cancel', onClick: function ($noty) {
                    $noty.close();
                }
            }]
        });

        Hotkeys.enter.on('CONFIRM', function () {
            Hotkeys.enter.off('CONFIRM');
            Hotkeys.esc.off('CONFIRM');
            n.close();
            callback();
        });

        Hotkeys.esc.on('CONFIRM', function () {
            Hotkeys.enter.off('CONFIRM');
            Hotkeys.esc.off('CONFIRM');
            n.close();
        });
    };

    this.error = function (text) {
        noty({type: 'error', text: text});
    };

    this.warning = function (text) {
        noty({type: 'warning', text: text});
    };

    this.info = function (text) {
        noty({type: 'information', text: text});
    };

    this.alert = function (text) {
        noty({type: 'alert', text: text});
    };

    this.success = function (text) {
        noty({type: 'success', text: text});
    };
}();
