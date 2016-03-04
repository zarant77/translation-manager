if (process.env.DEBUG) {
    require('nw.gui').Window.get().showDevTools();
}

(function () {
    jQuery.expr[':'].containsCI = function (elem, index, match) {
        return (elem.textContent || elem.innerText || jQuery(elem).text() || '').toLowerCase().indexOf((match[3] || '').toLowerCase()) >= 0;
    }
}(jQuery));

Tree.init();

ReactDOM.render(
    <StartScreen />,
    $('#container').get(0)
);
