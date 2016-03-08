var FileLoader = new function () {
    var fs = require('fs');
    var path = require('path');
    var listOfFiles = {};

    this.removeFile = function (lang) {
        if (listOfFiles[lang] !== undefined) {
            delete listOfFiles[lang];
        }
    };

    this.loadFile = function (lang, filename) {
        if (listOfFiles[lang] !== undefined || _.find(listOfFiles, function (o) {
                return o === filename;
            })) {
            Message.warning('File: "' + path.basename(listOfFiles[lang]) + '" already loaded');
            return null;
        }

        if (!filename) {
            return null;
        }

        var langData = null;
        var content = fs.readFileSync(filename, 'utf8');

        try {
            langData = JSON.parse(content);
        }
        catch (err) {
            console.error(err);
            Message.error('Error parse file. Invalid JSON data.');
        }

        if (langData !== null) {
            listOfFiles[lang] = filename;
        }

        return langData;
    };

    this.saveFile = function (lang, data) {
        fs.writeFile(
            listOfFiles[lang],
            JSON.stringify(data, null, 2),
            'utf8',
            function (err) {
                if (err) {
                    Message.error('Can\'t save file: "' + path.basename(listOfFiles[lang]) + '"');
                }
                else {
                    Message.success('File "' + path.basename(listOfFiles[lang]) + '" successfully saved');
                }
            }
        );
    };

    this.getListOfFiles = function () {
        return listOfFiles;
    };

    this.getLanguages = function () {
        return Object.keys(listOfFiles);
    };
}();
