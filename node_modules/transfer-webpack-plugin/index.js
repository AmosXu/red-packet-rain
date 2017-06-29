var path = require('path');
var dir = require('node-dir');
var vow = require('vow');
var fs = require('fs');

function TransferWebpackPlugin(patterns, basePath) {
    this.patterns = patterns || [];
    this.basePath = basePath;
}

TransferWebpackPlugin.prototype.apply = function(compiler) {
    var _this = this;
    var basePath = this.basePath || compiler.options.context || null;

    compiler.plugin('emit', function(compilation, cb) {
        if (!basePath) {
            compilation.errors.push(new Error('TransferWebpackPlugin: no basePath provided'));
            cb();
        }

        var promises = [];

        _this.patterns.forEach(function(pattern) {
            promises.push(_this.processDir(path.resolve(basePath, pattern.from), pattern.to, compilation));
        });

        vow.all(promises).then(function() {
            cb();
        }).fail(function(text) {
            compilation.errors.push(new Error(text));
            cb();
        });
    });
};

TransferWebpackPlugin.prototype.processDir = function(from, to, compilation) {
    var defer = vow.defer();

    dir.files(from, function(err, files) {
        if (err) {
            defer.reject('TransferWebpackPlugin: ' + err);
            return;
        }

        var allFiles = files.map(function(fullPath) {
            var fileName = fullPath.replace(from, '');
            var distName = to ? path.join(to, fileName) : fileName;

            compilation.assets[distName] = {
                size: function() {
                    return fs.statSync(fullPath).size;
                },
                source: function() {
                    return fs.readFileSync(fullPath);
                },
            };
        });

        defer.resolve(vow.all(allFiles));
    });

    return defer.promise();
};

module.exports = TransferWebpackPlugin;
