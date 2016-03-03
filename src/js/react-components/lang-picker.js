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

        this.domEl.hide();

        this.domEl.find('select').selectpicker({
            style: 'btn-info',
            size: 10
        });
    },
    doOk: function () {
        this.state.selectedLanguage = this.domEl.find('select').selectpicker('val');
        MainController.onLanguageSelected(this.state.selectedLanguage);
        this.domEl.hide();
    },
    doCancel: function () {
        MainController.onOpenBrowser();
        this.domEl.hide();
    },
    show: function (lang) {
        this.state.selectedLanguage = this.detectLanguage(lang);

        this.domEl.show();

        this.domEl.find('select').selectpicker('val', this.state.selectedLanguage);
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
                    <button className="btn btn-primary" type="button" onClick={self.doOk}>
                        OK
                    </button>
                    &nbsp;
                    <button className="btn btn-primary" type="button" onClick={self.doCancel}>
                        Cancel
                    </button>
                </div>
            </div>
        );
    }
});
