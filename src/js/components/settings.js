var Settings = new function () {
    $.fn.editable.defaults.mode = 'popup';
    $.fn.editable.defaults.type = 'textarea';

    $.noty.defaults.layout = 'topRight';
    $.noty.defaults.theme = 'relax';
    $.noty.defaults.timeout = 10000;

    this.langList = {
        'cn': {title: 'Chinese, Mandarin', detect: ['cn', 'chinese']},
        'gb': {title: 'English', detect: ['en', 'eng', 'english', 'gb', 'us']},
        'es': {title: 'Spanish', detect: ['es', 'spanish']},
        'sa': {title: 'Arabic', detect: ['sa', 'arabic']},
        'bd': {title: 'Bengali', detect: ['bd', 'bengali']},
        'in': {title: 'Hindi', detect: ['in', 'hindi']},
        'ru': {title: 'Russian', detect: ['ru', 'rus', 'russian']},
        'pt': {title: 'Portuguese', detect: ['pt', 'portuguese']},
        'jp': {title: 'Japanese', detect: ['jp', 'japanese']},
        'de': {title: 'German', detect: ['de', 'german', 'deutsch']},
        'fr': {title: 'French', detect: ['fr', 'french']},
        'tr': {title: 'Turkish', detect: ['tr', 'turkish']},
        'vn': {title: 'Vietnamese', detect: ['vn', 'vietnamese']},
        'it': {title: 'Italian', detect: ['it', 'italian']},
        'pl': {title: 'Polish', detect: ['pl', 'polish']},
        'ua': {title: 'Ukrainian', detect: ['ua', 'ukr', 'ukrainian']},
        'nl': {title: 'Dutch', detect: ['nl', 'dutch']}
    };
}();
