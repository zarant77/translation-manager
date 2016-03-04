var Editor = React.createClass({
    domEl: null,
    domMenu: null,
    domTree: null,
    getInitialState: function () {
        return {
            highlightClass: 'alert-danger'
        };
    },
    renderTree: function () {
        ReactDOM.render(
            <TreeNode node={Tree.getTree()}/>,
            document.getElementById('tree-placeholder')
        );
    },
    handleResize: function () {
        this.domTree.height(window.innerHeight - this.domMenu.height());
    },
    componentDidMount: function () {
        this.domEl = $(ReactDOM.findDOMNode(this));
        this.domMenu = this.domEl.find('.menu');
        this.domTree = this.domEl.find('.tree');

        window.addEventListener('resize', this.handleResize);

        this.renderTree();
        this.handleResize();

        this.domTree.find('.toggler').first().remove();
        this.domTree.find('.title').first().remove();
    },
    componentWillUnmount: function () {
        window.removeEventListener('resize', this.handleResize);
    },
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
            <Editor />,
            $('#container').get(0)
        );
    },
    openFileBrowser: function () {
        ReactDOM.render(
            <FsBrowser onOk={this.onFileSelect} onCancel={this.onFileCancel}/>,
            document.getElementById('container')
        );
    },
    saveFiles: function () {
        _.each(FileLoader.getListOfFiles(), function (filename, lang) {
            FileLoader.saveFile(lang, Tree.getJSON(lang));
        });
    },
    closeAllNodes: function () {
        this.domTree.find('.opened').trigger('click');
    },
    openAllNodes: function () {
        this.domTree.find('.closed').trigger('click');
    },
    createGroup: function () {
        Tree.createNode(null, true);
        this.renderTree();
    },
    createConstant: function () {
        Tree.createNode(null, false);
        this.renderTree();
    },
    removeLang: function (evt) {
        var self = this;
        var el = $(evt.target).parents('li').first();

        Message.confirm('Do you want to remove this file?', function () {
            FileLoader.removeFile(el.attr('data-lang'));
            el.remove();
            self.renderTree();
        });
    },
    search: function () {
        var text = this.domEl.find('#input-search').val();

        this.domEl.find('.editable').removeClass(this.state.highlightClass);

        if (text) {
            this.domEl.find('.editable:containsCI(' + text + ')').addClass(this.state.highlightClass);
        }
    },
    searchReset: function () {
        this.domEl.find('#input-search').val('');
        this.domEl.find('.editable').removeClass(this.state.highlightClass);
    },
    render: function () {
        var self = this;

        return (
            <div id="editor">
                <div className="row menu">
                    <div className="col-md-6">
                        <div className="row">
                            <div className="btn-group">
                                <button type="button"
                                        className="btn btn-default dropdown-toggle"
                                        data-toggle="dropdown"
                                        aria-haspopup="true"
                                        aria-expanded="false">
                                    File <span className="caret"></span>
                                </button>
                                <ul className="dropdown-menu">
                                    <li>
                                        <a href="#" onClick={self.openFileBrowser}>
                                            <i className="glyphicon glyphicon-floppy-open"></i>
                                            <span>Load file</span>
                                        </a>
                                    </li>
                                    <li>
                                        <a href="#" onClick={self.saveFiles}>
                                            <i className="glyphicon glyphicon-floppy-save"></i>
                                            <span>Save file</span>
                                        </a>
                                    </li>
                                </ul>
                            </div>

                            <div className="btn-group">
                                <button type="button"
                                        className="btn btn-default dropdown-toggle"
                                        data-toggle="dropdown"
                                        aria-haspopup="true"
                                        aria-expanded="false">
                                    Tree <span className="caret"></span>
                                </button>
                                <ul className="dropdown-menu">
                                    <li>
                                        <a href="#" onClick={self.closeAllNodes}>
                                            <i className="glyphicon glyphicon-minus-sign"></i>
                                            <span>Collapse all nodes</span>
                                        </a>
                                    </li>
                                    <li>
                                        <a href="#" onClick={self.openAllNodes}>
                                            <i className="glyphicon glyphicon-plus-sign"></i>
                                            <span>Expand all nodes</span>
                                        </a>
                                    </li>
                                    <li role="separator" className="divider"></li>
                                    <li>
                                        <a href="#" onClick={self.createGroup}>
                                            <i className="glyphicon glyphicon-folder-open"></i>
                                            <span>Create root group</span>
                                        </a>
                                    </li>
                                    <li>
                                        <a href="#" onClick={self.createConstant}>
                                            <i className="glyphicon glyphicon-tag"></i>
                                            <span>Create root constant</span>
                                        </a>
                                    </li>
                                </ul>
                            </div>
                        </div>

                        <div className="row">
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

                    <div className="col-md-6">
                        <div id="file-list">
                            <ul className="form-control">
                                {
                                    _.map(FileLoader.getListOfFiles(), function (filename, lang) {
                                        return <li key={lang} className={lang} data-lang={lang}>
                                            <span className={'flag-icon flag-icon-' + lang}></span>
                                            <span className="title">{filename.split('/').pop()}</span>
                                            <span className="btn btn-danger btn-xs btn-delete"
                                                  onClick={self.removeLang}>
                                                <i className="glyphicon glyphicon-trash"></i>
                                            </span>
                                        </li>
                                    })
                                }
                            </ul>
                        </div>
                    </div>
                </div>

                <div className="row tree">
                    <div id="tree-placeholder" className="col-md-12">
                    </div>
                </div>
            </div>
        );
    }
});
