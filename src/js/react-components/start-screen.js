var StartScreen = React.createClass({
    onFileSelect: function (filename, language) {
        Tree.load(
            language,
            FileLoader.loadFile(language, filename)
        );

        ReactDOM.render(
            <Editor />,
            $('#container').get(0)
        );
    },
    onFileCancel: function () {
        ReactDOM.render(
            <StartScreen />,
            $('#container').get(0)
        );
    },
    openFileBrowser: function () {
        ReactDOM.render(
            <FsBrowser onOk={this.onFileSelect} onCancel={this.onFileCancel} />,
            document.getElementById('container')
        );
    },
    render: function () {
        return (
            <div id="start-screen">
                <button className="btn btn-default" onClick={this.openFileBrowser}>Load file</button>
            </div>
        );
    }
});
