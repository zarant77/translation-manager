var StartScreen = React.createClass({
    openBrowser: function () {
        MainController.onOpenBrowser();
    },
    render: function () {
        return (
            <div id="start-screen">
                <button className="btn btn-default" onClick={this.openBrowser}>Load file</button>
            </div>
        );
    }
});
