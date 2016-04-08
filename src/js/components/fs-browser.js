var fs = require('fs');
var path = require('path');
var mime = require('mime');

var FsBrowser = React.createClass({
    domEl: null,
    langPicker: null,
    allowedMimeTypes: ['application/json'],
    getInitialState: function () {
        return {
            dir: $.localStorage.get('BROWSER_DIR') || path.resolve('./'),
            files: [],
            selectedFile: null,
            selectedLanguage: null
        };
    },
    componentDidMount: function () {
        this.domEl = $(ReactDOM.findDOMNode(this)).find('#fs-browser');

        this.langPicker = ReactDOM.render(
            <LangPicker onOk={this.onLangSelect} onCancel={this.show}/>,
            document.getElementById('lang-picker-placeholder')
        );
    },
    show: function () {
        this.domEl.show();
    },
    onLangSelect: function (language) {
        this.state.selectedLanguage = language;

        if (typeof this.props.onOk === 'function') {
            this.props.onOk(this.state.selectedFile, this.state.selectedLanguage);
        }

        this.domEl.hide();
    },
    onCancel: function () {
        if (typeof this.props.onCancel === 'function') {
            this.props.onCancel();
        }

        this.domEl.hide();
    },
    openDir: function (event) {
        var filename = path.join(this.state.dir, $(event.target).text());
        var isDir = fs.statSync(filename).isDirectory();

        if (isDir) {
            $.localStorage.set('BROWSER_DIR', filename);
            this.setState({dir: filename});
        }
        else {
            if (this.allowedMimeTypes.indexOf(mime.lookup(filename)) === -1) {
                return Message.error('Please, select valid JSON file.');
            }

            this.state.selectedFile = filename;

            this.domEl.hide();
            this.langPicker.show(path.basename(filename, path.extname(filename)));
        }
    },
    readDir: function () {
        var stats = null;

        try {
            stats = fs.lstatSync(this.state.dir);
        }
        catch (err) {
            this.state.dir = path.resolve('./');
            stats = fs.lstatSync(this.state.dir);
        }

        if (!stats.isDirectory()) {
            this.state.dir = path.resolve('./');
        }

        this.state.files = fs.readdirSync(this.state.dir);
    },
    render: function () {
        var self = this;

        this.readDir();

        return (
            <div>
                <div id="fs-browser">
                    <div className="panel panel-default">
                        <div className="panel-heading">
                            Select JSON file which contains translations
                        </div>
                        <div className="panel-body">
                            <div className="alert alert-info" role="alert">
                                <div className="path">{this.state.dir}</div>
                            </div>
                            <div className="browser">
                                <ul>
                                    <li onClick={this.openDir} className="folder glyphicon glyphicon-folder-open">
                                        <span>..</span>
                                    </li>
                                    {
                                        this.state.files.map(function (file) {
                                            var className = (fs.statSync(path.join(self.state.dir, file)).isDirectory())
                                                ? 'folder glyphicon glyphicon-folder-open'
                                                : 'file glyphicon glyphicon-file';

                                            return <li key={file} onClick={self.openDir} className={className}>
                                                <span>{file}</span>
                                            </li>
                                        })
                                    }
                                </ul>
                            </div>
                        </div>
                        <div className="panel-footer">
                            <button className="btn btn-default" onClick={self.onCancel}>
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>

                <div id="lang-picker-placeholder"></div>
            </div>
        );
    }
});
