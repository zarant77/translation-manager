var MainMenu = React.createClass({
    domMenu: null,
    domTree: null,
    getInitialState: function () {
        return {
            files: {}
        };
    },
    handleResize: function () {
        this.domTree.height(window.innerHeight - this.domMenu.height());
    },
    componentDidMount: function () {
        this.domMenu = $('#menu');
        this.domTree = $('#container');

        window.addEventListener('resize', this.handleResize);

        this.handleResize();
    },
    componentWillUnmount: function () {
        window.removeEventListener('resize', this.handleResize);
    },
    renderEditor: function () {
        ReactDOM.render(
            <TreeNode node={Tree.getTree()}/>,
            this.domTree.get(0)
        );

        this.domTree.find('.toggler').first().remove();
        this.domTree.find('.title').first().remove();
    },
    removeLangFile: function (evt) {
        var self = this;
        var lang = $(evt.target).parents('li').attr('data-lang');

        Message.confirm('Are you sure you want to delete this language?', function () {
            FileLoader.removeFile(lang);

            self.setState({
                files: FileLoader.getListOfFiles()
            });

            self.renderEditor();
        });
    },
    addLangFile: function (filename, lang) {
        var fileData = FileLoader.loadFile(lang, filename);

        if (fileData) {
            Tree.load(lang, fileData);

            this.setState({
                files: FileLoader.getListOfFiles()
            });

            Message.success('File "' + filename.split('/').pop() + '" was loaded successfully');

            this.renderEditor();
        }
    },
    openFileBrowser: function () {
        var browser = ReactDOM.render(
            <FsBrowser onOk={this.addLangFile} onCancel={this.renderEditor}/>,
            document.getElementById('container')
        );

        browser.show();
    },
    saveFiles: function () {
        _.each(FileLoader.getListOfFiles(), function (filename, lang) {
            FileLoader.saveFile(lang, Tree.getJSON(lang));
        });
    },
    closeAllNodes: function () {
        $('.opened').trigger('click');
    },
    openAllNodes: function () {
        $('.closed').trigger('click');
    },
    createGroup: function () {
        Tree.createNode(null, true);
        this.renderEditor();
    },
    createConstant: function () {
        Tree.createNode(null, false);
        this.renderEditor();
    },
    search: function () {
        var text = $('#input-search').val();

        $('.editable').removeClass('alert-danger');

        if (text) {
            $('.editable:containsCI(' + text + ')').addClass('alert-danger');
        }
    },
    searchReset: function () {
        $('#input-search').val('');
        $('.editable').removeClass('alert-danger');
    },
    render: function () {
        var self = this;

        var list = _.map(this.state.files, function (filename, lang) {
            return (
                <li className="dropdown-header" data-lang={lang} key={lang}>
                    <i className={'flag-icon flag-icon-' + lang}></i>
                    <span className="title">{filename.split('/').pop()}</span>
                    <span className="btn btn-danger btn-xs btn-delete" onClick={self.removeLangFile}>
                        <i className="glyphicon glyphicon-remove"></i>
                    </span>
                </li>
            );
        });

        return (
            <div className="row">
                <div className="col-md-6">
                    <div className="dropdown menu-item">
                        <button type="button"
                                className="btn btn-default dropdown-toggle"
                                data-toggle="dropdown"
                                aria-haspopup="true"
                                aria-expanded="false">
                            File <span className="caret"></span>
                        </button>
                        <ul className="dropdown-menu">
                            {list}
                            <li>
                                <a href="#" onClick={self.openFileBrowser}>
                                    <i className="glyphicon glyphicon-floppy-open"></i>
                                    <span>Load new file</span>
                                </a>
                            </li>
                            <li>
                                <a href="#" onClick={self.saveFiles}>
                                    <i className="glyphicon glyphicon-floppy-save"></i>
                                    <span>Save all files</span>
                                </a>
                            </li>
                        </ul>
                    </div>

                    <div className="btn-group menu-item">
                        <button className="btn btn-primary" onClick={self.closeAllNodes} title="Collapse all nodes">
                            <i className="glyphicon glyphicon-minus-sign"></i>
                        </button>

                        <button className="btn btn-primary" onClick={self.openAllNodes} title="Expand all nodes">
                            <i className="glyphicon glyphicon-plus-sign"></i>
                        </button>

                        <button className="btn btn-primary" onClick={self.createGroup} title="Create root group">
                            <i className="glyphicon glyphicon-folder-open"></i>
                        </button>

                        <button className="btn btn-primary" onClick={self.createConstant} title="Create root constant">
                            <i className="glyphicon glyphicon-tag"></i>
                        </button>
                    </div>
                </div>

                <div className="col-md-6">
                    <div className="input-group search-form">
                        <label className="input-group-addon" htmlFor="input-search">
                            <i className="glyphicon glyphicon-search"></i>
                        </label>

                        <input id="input-search" className="form-control" type="text"
                               placeholder="Type to search..." onChange={this.search}/>
                            <span id="search-reset" className="glyphicon glyphicon-remove-circle"
                                  onClick={self.searchReset}></span>
                    </div>
                </div>
            </div>
        );
    }
});
