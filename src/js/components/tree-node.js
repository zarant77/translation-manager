var TreeNode = React.createClass({
    getInitialState: function () {
        return {};
    },
    toggle: function (evt) {
        $(evt.target).parents('.tree-node').first().toggleClass('collapsed');
    },
    makeEditable: function (domEl) {
        domEl.editable();

        domEl.on('save', function (e, params) {
            var el = $(e.currentTarget);
            var id = el.parents('li.block').first().attr('data-id') || el.parents('li.translate').first().attr('data-id');
            var lang = el.parents('li.translate').first().attr('data-lang');
            var node = Tree.find(id);

            console.log($(e.currentTarget), id, lang);

            if (node !== null) {
                if ($(e.target).hasClass('title')) {
                    node.rename(params.newValue);
                }
                else if (!node.isGroup) {
                    node.update(lang, params.newValue);
                }
            }
        });
    },
    componentDidMount: function () {
        var domEl = $(ReactDOM.findDOMNode(this));

        this.makeEditable(domEl.find('.title'));
        this.makeEditable(domEl.find('.text'));
    },
    render: function () {
        var self = this;
        var currentNode = this.props.node;
        var children = _.map(currentNode.children, function (node, index) {
            if (node.isGroup) {
                return <li className="block" key={node.id} data-id={node.id}>
                    <TreeNode node={node}/>
                </li>
            }
            else {
                return _.map(node.translations, function (text, lang) {
                    return <li className="translate" key={node.id+lang} data-id={node.id} data-lang={lang}>
                        <i className={'lang flag-icon flag-icon-' + lang}></i>
                        <div className="text">{text}</div>
                    </li>
                });
            }
        });

        return (
            <div className="tree-node">
                <div className="toggler" onClick={self.toggle}>
                    <i className="glyphicon glyphicon-plus collapse-node"></i>
                    <i className="glyphicon glyphicon-minus expand-node"></i>
                </div>
                <div className="title">{currentNode.name}</div>
                <ul className="content">
                    {children}
                </ul>
            </div>
        );
    }
});
