var Tree = new function () {
    /**
     * This context
     * @type {Tree}
     */
    var self = this;

    /**
     * Last generated id
     * @type {number}
     */
    var lastId = 0;

    /**
     * Contains parsed tree object
     * @type {Object}
     */
    var tree = {};

    /**
     * Key-value list
     * Key is a path. Example ELEMENTS.BUTTONS.OK
     * Value - reference to node in the tree
     * @type {Object}
     */
    var listByPath = {};

    /**
     * Key-value list
     * Key is unique ID.
     * Value - reference to node in the tree
     * @type {Object}
     */
    var listById = {};

    var generateId = function () {
        return lastId++;
    };

    var Node = function (id, name, path, parent) {
        var collectIds = function (nodes) {
            return _.map(nodes, function (node) {
                if (node.isGroup) {
                    return collectIds(node.children);
                }
                else {
                    return node.id;
                }
            });
        };

        this.id = id;
        this.isGroup = false;
        this.name = name;
        this.path = path;
        this.translations = {};
        this.children = {};
        this.parent = parent;
        this.domElement = null;

        /**
         * Destroy current node and all children nodes
         */
        this.destroy = function () {
            // Delete children nodes from list
            _.each(collectIds(this.children), function (id) {
                if (listById[id]) {
                    var path = listById[id].path.join('.');

                    if (listByPath[path]) {
                        delete listByPath[path];
                    }

                    delete listById[id];
                }
            });

            // Delete current node from list
            delete listById[this.id];

            // Remove dom element
            if (this.domElement) {
                this.domElement.remove();
            }

            var ids = [this.id];
            var parent = this.parent;

            while (parent) {
                ids.push(parent.id);
                parent = parent.parent;
            }

            _.unset(tree, '[' + ids.reverse().join('].children[') + ']');
        };

        /**
         * Rename node
         * @param {String} newName New name
         */
        this.rename = function (newName) {
            this.name = newName;
        };

        /**
         * Update translation text
         * @param {String} lang Language code
         * @param {String} text Translation text
         */
        this.update = function (lang, text) {
            this.translations[lang] = text;
        };
    };

    /**
     * Recursive walk data and grab info to the Tree
     * @param {String} lang Language code
     * @param {Object} data JSON data
     * @param {Object} node Node of tree. Data will be written to this object
     * @param {Array} path Path to current node. Example: ['ELEMENTS', 'BUTTONS', 'OK']
     * @param {Object} parent Reference to parent node
     */
    var walk = function (lang, data, node, path, parent) {
        _.each(data, function (item, key) {
            var nodeRef = null;
            var strPath = _.union(path, [key]).join('.');

            if (listByPath[strPath] !== undefined) {
                nodeRef = listByPath[strPath];
            }
            else {
                var id = generateId();

                node[id] = new Node(id, key, _.union(path, [key]), parent);

                // Store references
                listByPath[node[id].path.join('.')] = node[id];
                listById[id] = node[id];

                nodeRef = node[id];
            }

            // Update node
            if (typeof item === 'string') {
                // This is a constant
                nodeRef.translations[lang] = item;
            }
            else {
                // This is a group
                nodeRef.isGroup = true;

                walk(lang, item, nodeRef.children, nodeRef.path, nodeRef);
            }
        });
    };

    /**
     * Initialize Tree
     * Just reset all data
     */
    this.init = function () {
        var id = generateId();

        tree = new Node(id, '', '', null);
        tree.isGroup = true;

        listById = {};
        listByPath = {};

        // Store references
        listByPath[''] = tree;
        listById[id] = tree;
    };

    /**
     * Load raw JSON data and convert it to Tree object
     * @param {String} lang Language code
     * @param {JSON} data Translation data
     */
    this.load = function (lang, data) {
        if (!lang || !data) {
            return;
        }

        walk(lang, data, tree.children, [], null);
    };

    /**
     * Returns tree
     * @returns {Object}
     */
    this.getTree = function () {
        return tree;
    };

    /**
     * Find node by id
     * @param id
     * @returns {Node|null}
     */
    this.find = function (id) {
        return listById[id] || null;
    };

    /**
     * Adds empty node to the Tree
     */
    this.createNode = function (parentId, isGroup) {
        var parentNode = (listById[parentId] !== undefined) ? listById[parentId].children : tree.children;
        var id = generateId();
        var key = 'NEW_NODE_' + id;

        parentNode[id] = new Node(id, key, _.union(parentNode.path || [], [key]), parentNode);
        parentNode[id].isGroup = !!isGroup;

        // Store references
        listByPath[parentNode[id].path.join('.')] = parentNode[id];
        listById[id] = parentNode[id];

        return parentNode[id];
    };

    /**
     * Returns JSON data for selected language
     * @param {String} lang Language code
     * @returns {JSON}
     */
    this.getJSON = function (lang) {
        var recursive = function (nodes) {
            var result = {};

            _.each(nodes, function (node) {
                result[node.name] = (node.isGroup) ? recursive(node.children) : node.translations[lang];
            });

            return result;
        };

        return recursive(tree.children);
    };
}();
