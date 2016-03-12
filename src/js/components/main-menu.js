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
        if (Object.keys(FileLoader.getListOfFiles()).length === 0) {
            // Reset tree
            Tree.init();

            ReactDOM.render(
                <StartScreen />,
                $('#container').get(0)
            );
        }
        else {
            ReactDOM.render(
                <TreeNode node={Tree.getTree()}/>,
                this.domTree.get(0)
            );

            this.domTree.find('.info').first().remove();
        }
    },
    removeLangFile: function (evt) {
        var self = this;
        var lang = $(evt.target).parents('li').attr('data-lang');

        Message.confirm('Are you sure you want to delete this language?', function () {
            FileLoader.removeFile(lang);

            self.setState({
                files: FileLoader.getListOfFiles()
            });

            Message.success('File "' + filename.split('/').pop() + '" was removed');

            self.renderEditor();
        });
    },
    addLangFile: function (filename, lang) {
        var fileData = FileLoader.loadFile(lang, filename);

        if (fileData) {
            if (Tree.load(lang, fileData)) {
                Message.success('File "' + filename.split('/').pop() + '" was loaded successfully');
            }
            else {
                Message.warning('Can\'t load file "' + filename.split('/').pop() + '"');
                FileLoader.removeFile(lang);
            }

            this.setState({
                files: FileLoader.getListOfFiles()
            });

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
        $('.tree-group:gt(0)').addClass('collapsed');
    },
    openAllNodes: function () {
        $('.tree-group:gt(0)').removeClass('collapsed');
    },
    addNode: function (parentId, isGroup) {
        var node = Tree.createNode(parentId, isGroup);
        this.renderEditor();

        setTimeout(function () {
            document.location = '#tree-node-' + node.id;
            $('#tree-node-' + node.id).find('.title').focus();
        }, 100);
    },
    createGroup: function () {
        this.addNode(null, true);
    },
    createConstant: function () {
        this.addNode(null, false);
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
        var isFileListEmpty = (Object.keys(this.state.files).length === 0);

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
                            <li className={isFileListEmpty ? 'disabled' : ''}>
                                <a href="#" onClick={self.saveFiles}>
                                    <i className="glyphicon glyphicon-floppy-save"></i>
                                    <span>Save all files</span>
                                </a>
                            </li>
                        </ul>
                    </div>

                    <div className="btn-group menu-item">
                        <button className="btn btn-default" onClick={self.closeAllNodes} title="Collapse all nodes"
                                disabled={isFileListEmpty}>
                            <i className="glyphicon glyphicon-minus-sign"></i>
                        </button>

                        <button className="btn btn-default" onClick={self.openAllNodes} title="Expand all nodes"
                                disabled={isFileListEmpty}>
                            <i className="glyphicon glyphicon-plus-sign"></i>
                        </button>

                        <button className="btn btn-default" onClick={self.createGroup} title="Create root group"
                                disabled={isFileListEmpty}>
                            <i className="glyphicon glyphicon-folder-open"></i>
                        </button>

                        <button className="btn btn-default" onClick={self.createConstant} title="Create root constant"
                                disabled={isFileListEmpty}>
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
                               placeholder="Type to search..." onChange={this.search}
                               disabled={isFileListEmpty}/>

                            <span id="search-reset" className="glyphicon glyphicon-remove-circle"
                                  onClick={self.searchReset}></span>
                    </div>
                </div>
            </div>
        );
    }
});
