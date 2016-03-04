var Editor = React.createClass({
    domEl: null,
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
    componentDidMount: function () {
        this.domEl = $(ReactDOM.findDOMNode(this));
        this.renderTree();
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
            <FsBrowser onOk={this.onFileSelect} onCancel={this.onFileCancel} />,
            document.getElementById('container')
        );
    },
    saveFiles: function () {
        _.each(FileLoader.getListOfFiles(), function (filename, lang) {
            FileLoader.saveFile(lang, Tree.getJSON(lang));
        });
    },
    closeAllNodes: function () {
        this.domEl.find('.toggler.opened').trigger('click');
    },
    openAllNodes: function () {
        this.domEl.find('.toggler.closed').trigger('click');
    },
    createGroup: function () {
    },
    createConstant: function () {
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
                <div className="menu row">
                    <div className="col-md-6">
                        <div className="row">
                            <div className="btn-group" role="group">
                                <button className="btn btn-primary btn-open-file" onClick={self.openFileBrowser}>
                                    <i className="glyphicon glyphicon-floppy-open"></i>
                                    <span>Load file</span>
                                </button>

                                <button className="btn btn-primary btn-save-file" onClick={self.saveFiles}>
                                    <i className="glyphicon glyphicon-floppy-save"></i>
                                    <span>Save file</span>
                                </button>
                            </div>
                        </div>

                        <div className="row">
                            <div className="btn-group" role="group">
                                <button className="btn btn-primary btn-close-all" onClick={self.closeAllNodes}>
                                    <i className="glyphicon glyphicon-minus-sign"></i>
                                    <span>Close all</span>
                                </button>

                                <button className="btn btn-primary btn-open-all" onClick={self.openAllNodes}>
                                    <i className="glyphicon glyphicon-plus-sign"></i>
                                    <span>Open all</span>
                                </button>
                            </div>

                            <div className="btn-group" role="group">
                                <button className="btn btn-primary btn-create-root-group" onClick={self.createGroup}>
                                    <i className="glyphicon glyphicon-folder-open"></i>
                                    <span>Create group</span>
                                </button>

                                <button className="btn btn-primary btn-create-root-constant" onClick={self.createConstant}>
                                    <i className="glyphicon glyphicon-tag"></i>
                                    <span>Create constant</span>
                                </button>
                            </div>
                        </div>

                        <div className="row">
                            <div className="input-group search-form">
                                <label className="input-group-addon" htmlFor="input-search">
                                    <i className="glyphicon glyphicon-search"></i>
                                </label>

                                <input id="input-search" className="form-control" type="text"
                                       placeholder="Type to search..." onChange={this.search}/>
                                <span id="search-reset" className="glyphicon glyphicon-remove-circle" onClick={self.searchReset}></span>
                            </div>
                        </div>
                    </div>

                    <div className="col-md-6">
                        <div id="file-list">
                            <ul>
                                {
                                    _.map(FileLoader.getListOfFiles(), function (filename, lang) {
                                        return <li key={lang} className={lang} data-lang={lang}>
                                            <span className={'flag-icon flag-icon-' + lang}></span>
                                            <span className="title">{filename.split('/').pop()}</span>
                                            <span className="btn btn-danger btn-xs btn-delete" onClick={self.removeLang}>
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
