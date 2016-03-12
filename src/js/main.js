if (process.env.DEBUG) {
    require('nw.gui').Window.get().showDevTools();
}

var mainMenu = ReactDOM.render(
    <MainMenu />,
    $('#menu').get(0)
);

ReactDOM.render(
    <StartScreen />,
    $('#container').get(0)
);

$(function () {
    // Case insensitive search
    jQuery.expr[':'].containsCI = function (elem, index, match) {
        return (elem.textContent || elem.innerText || jQuery(elem).text() || '').toLowerCase().indexOf((match[3] || '').toLowerCase()) >= 0;
    };

    Tree.init();
});
