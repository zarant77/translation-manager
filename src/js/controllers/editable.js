var Editable = new function () {
    var count = 0;
    var currentFocus = 0;

    this.make = function (domEl) {
        domEl.editable();

        domEl.focus(function (event) {
            var ed = $('.editable');

            for (var i = 0; i < ed.length; i++) {
                if (ed[i] == event.currentTarget) {
                    currentFocus = i;
                    break;
                }
            }
        });

        domEl.on('hidden', function () {
            $(this).focus();
        });

        domEl.on('save', function (e, params) {
            var el = $(e.currentTarget);
            var id = el.parents('li.block').first().attr('data-id') || el.parents('li.translate').first().attr('data-id');
            var lang = el.parents('li.translate').first().attr('data-lang');
            var node = Tree.find(id);

            if (node !== null) {
                if ($(e.target).hasClass('title')) {
                    node.rename(params.newValue);
                }
                else if (!node.isGroup) {
                    node.update(lang, params.newValue);
                }
            }
        });

        count++;
    };

    $(document).keydown(function (e) {
        var el, ed = $('.editable');

        switch (e.which) {
            case 38: // arrow up
                e.preventDefault();
                el = ed.eq(--currentFocus);

                if (el.length) {
                    el.focus();
                }
                else {
                    currentFocus = el.length - 1;
                }
                break;

            case 40: // arrow down
                e.preventDefault();
                el = ed.eq(++currentFocus);

                if (el.length) {
                    el.focus();
                }
                else {
                    currentFocus = 0;
                }
                break;

            case 13: // enter
                var focused = $(document.activeElement);

                if (focused.hasClass('editable')) {
                    e.preventDefault();
                    focused.editable('show');
                }
                break;

            case 27: // esc
                break;

            case 46: // delete
                var domLi = $(document.activeElement).parents('li.block').first();
                var title = domLi.find('.title').first().text();
                var node = Tree.find(domLi.attr('data-id'));

                if (node) {
                    Message.confirm('Are you sure you want to delete this node?', function () {
                        Message.info('"' + title + '" was removed');
                        node.destroy();
                        domLi.remove();
                    });
                }
                break;
        }
    });
}();
