var Message = new function () {
    this.confirm = function (text, callback) {
        noty({
            text: text,
            layout: 'center',
            modal: true,
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
    };

    this.error = function (text) {
        noty({type: 'error', text: text});
    };

    this.warning = function (text) {
        noty({type: 'warning', text: text});
    };

    this.info = function (text) {
        noty({type: 'info', text: text});
    };

    this.success = function (text) {
        noty({type: 'success', text: text});
    };
}();