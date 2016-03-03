var MainController = new function () {
    var state = {};

    this.init = function () {
        Tree.init();

        startScreen = ReactDOM.render(
            <StartScreen />,
            document.getElementById('container')
        );
    };

    this.onFileSelected = function (filename) {
        state.selectedFile = filename;

        ReactDOM.render(
            <LangPicker />,
            document.getElementById('container')
        ).show(
            state.selectedFile.split('/').pop().split('.')[0]
        );
    };

    this.onLanguageSelected = function (lang) {
        state.selectedLanguage = lang;

        Tree.load(
            state.selectedLanguage,
            FileLoader.loadFile(
                state.selectedLanguage,
                state.selectedFile
            )
        );

        ReactDOM.render(
            <TreeNode node={Tree.getTree()} />,
            document.getElementById('container')
        );
    };

    this.onOpenBrowser = function () {
        ReactDOM.render(
            <FsBrowser />,
            document.getElementById('container')
        );
    };

    this.onCloseBrowser = function () {
        ReactDOM.render(
            <StartScreen />,
            document.getElementById('container')
        );
    };
};
