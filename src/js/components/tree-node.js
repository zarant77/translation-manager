var TreeNode = React.createClass({
    getInitialState: function () {
        return {};
    },
    toggle: function (evt) {
        $(evt.currentTarget).parents('.tree-node').first().toggleClass('collapsed');
    },
    deleteNode: function (evt) {
        var domLi = $(evt.currentTarget).parents('li.block').first();
        var title = domLi.find('.title').first().text();

        Message.confirm('Are you sure you want to delete this node?', function () {
            var node = Tree.find(domLi.attr('data-id'));

            if (node) {
                Message.info('"' + title + '" was removed');
                node.destroy();
                domLi.remove();
            }
        });
    },
    addNode: function (evt) {
        var domBtn = $(evt.currentTarget);

        mainMenu.addNode(
            domBtn.parents('li').first().attr('data-id'),
            (domBtn.attr('data-type') === 'group')
        );
    },
    componentDidMount: function () {
        var domEl = $(ReactDOM.findDOMNode(this));

        Editable.make(domEl.find('.title'));
        Editable.make(domEl.find('.text'));
    },
    render: function () {
        var currentNode = this.props.node;

        var buttons = {
            deleteNode: (
                <button className="btn btn-default btn-xs btn-delete" onClick={this.deleteNode}>
                    <i className="glyphicon glyphicon-trash"></i>
                </button>
            )
        };

        if (currentNode.isGroup) {
            buttons.addGroup = (
                <button className="btn btn-default btn-xs btn-add-group" data-type="group" onClick={this.addNode}>
                    <i className="glyphicon glyphicon-folder-open"></i>
                </button>
            );

            buttons.addConstant = (
                <button className="btn btn-default btn-xs btn-add-constant" data-type="constant" onClick={this.addNode}>
                    <i className="glyphicon glyphicon-tag"></i>
                </button>
            );

            var children = _.map(currentNode.children, function (node, index) {
                return (
                    <li className="block" key={node.id} data-id={node.id}>
                        <TreeNode node={node}/>
                    </li>
                );
            });

            return (
                <div className="tree-node tree-group" id={'tree-node-' + currentNode.id}>
                    <div className="info">
                        <div className="toggler" onClick={this.toggle}>
                            <i className="glyphicon glyphicon-plus collapse-node"></i>
                            <i className="glyphicon glyphicon-minus expand-node"></i>
                        </div>
                        <div className="title" tabIndex={currentNode.id}>{currentNode.name}</div>
                        <div className="buttons">
                            {buttons.addGroup}
                            {buttons.addConstant}
                            {buttons.deleteNode}
                        </div>
                    </div>
                    <ul className="content">
                        {children}
                    </ul>
                </div>
            );
        }
        else {
            var translations = _.map(FileLoader.getLanguages(), function (lang) {
                return <li className="translate" key={currentNode.id+lang} data-id={currentNode.id} data-lang={lang}>
                    <i className={'lang flag-icon flag-icon-' + lang}></i>
                    <div className="text" tabIndex={currentNode.id}>{currentNode.translations[lang] || ''}</div>
                </li>
            });

            return (
                <div className="tree-node tree-constant" id={'tree-node-' + currentNode.id}>
                    <div className="info">
                        <div className="title" tabIndex={currentNode.id}>{currentNode.name}</div>
                        <div className="buttons">
                            {buttons.deleteNode}
                        </div>
                    </div>
                    <ul className="content">
                        {translations}
                    </ul>
                </div>
            );
        }
    }
});
