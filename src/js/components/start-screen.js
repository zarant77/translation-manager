var StartScreen = React.createClass({
    render: function () {
        return (
            <div className="jumbotron start-screen">
                <div className="container">
                    <p>Select JSON files that contains translations for your project</p>
                    <p>
                        <a className="btn btn-primary btn-lg" href="#" role="button" onClick={mainMenu.openFileBrowser}>
                            Load file
                        </a>
                    </p>
                </div>
            </div>
        );
    }
});
