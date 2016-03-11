var LangPicker = React.createClass({
    domEl: null,
    getInitialState: function () {
        return {
            languages: Settings.langList,
            detectedLangCache: {},
            selectedLanguage: null
        };
    },
    detectLanguage: function (code) {
        var self = this;

        if (self.state.detectedLangCache[code] === undefined) {
            self.state.detectedLangCache[code] = code;

            _.each(Settings.langList, function (lang, key) {
                if (lang.detect.indexOf(code) !== -1) {
                    self.state.detectedLangCache[code] = key;
                }
            });
        }

        return self.state.detectedLangCache[code];
    },
    componentDidMount: function () {
        this.domEl = $(ReactDOM.findDOMNode(this));

        this.domEl.find('select').selectpicker({
            style: 'btn-info',
            size: 10
        });

        this.domEl.hide();
    },
    show: function (lang) {
        this.state.selectedLanguage = this.detectLanguage(lang);

        this.domEl.show();

        this.domEl.find('select').selectpicker('val', this.state.selectedLanguage);
    },
    onOk: function () {
        var lang = this.domEl.find('select').selectpicker('val');

        if (!lang) {
            Message.warning('Please select language for this file');
            return;
        }

        this.state.selectedLanguage = lang;

        if (typeof this.props.onOk === 'function') {
            this.props.onOk(this.state.selectedLanguage);
        }

        this.domEl.hide();
    },
    onCancel: function () {
        if (typeof this.props.onCancel === 'function') {
            this.props.onCancel();
        }

        this.domEl.hide();
    },
    render: function () {
        var self = this;

        return (
            <div id="lang-picker" className="panel panel-default">
                <div className="panel-heading">
                    Select language of this file
                </div>
                <div className="panel-body">
                    <div>
                        <select data-live-search="true">
                            {
                                _.map(this.state.languages, function (lang, key) {
                                    return <option key={key} value={key}
                                                   data-icon={'flag-icon flag-icon-' + key}>{lang.title}</option>
                                })
                            }
                        </select>
                    </div>
                </div>
                <div className="panel-footer">
                    <button className="btn btn-primary" type="button" onClick={self.onOk}>
                        OK
                    </button>
                    &nbsp;
                    <button className="btn btn-primary" type="button" onClick={self.onCancel}>
                        Cancel
                    </button>
                </div>
            </div>
        );
    }
});
