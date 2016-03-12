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

    this.init = function () {
        Hotkeys.enter.on('EDIT', function () {
            var focused = $(document.activeElement);

            if (focused.hasClass('editable')) {
                focused.editable('show');
            }
        });

        Hotkeys.up.on('MOVE-UP', function () {
            var ed = $('.editable');
            var el = ed.eq(--currentFocus);

            if (el.length) {
                el.focus();
            }
            else {
                currentFocus = el.length - 1;
            }
        });

        Hotkeys.down.on('MOVE-DOWN', function () {
            var ed = $('.editable');
            var el = ed.eq(++currentFocus);

            if (el.length) {
                el.focus();
            }
            else {
                currentFocus = 0;
            }
        });

        Hotkeys.delete.on('DELETE-NODE', function () {
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
        });
    };
}();
