## Transfer Webpack Plugin

Transfer files to the build directory

### Getting started

Install the plugin:

```
npm install --save-dev transfer-webpack-plugin
```


### API
```javascript
new TransferWebpackPlugin(patterns: array, [basePath: string])
```

* `patterns` – array of patterns `{ from: 'path', to: 'path' }`, `from` – relative to `basePath` or to `context` of your config (if `basePath` is not exists), 
`to` – relative to the build directory
* `basePath` (optional) – directory to be resolved to `from` parameter

### Usage

```javascript
var TransferWebpackPlugin = require('transfer-webpack-plugin');

module.exports = {
    context: path.join(__dirname, 'app'),
    plugins: [
        new TransferWebpackPlugin([
            { from: 'i18n', to: 'i18n' },
            { from: 'root' }
        ])
    ]
};

module.exports = {
    plugins: [
        new TransferWebpackPlugin([
            { from: 'i18n', to: 'i18n' },
            { from: 'root' }
        ], path.join(__dirname, 'app'))
    ]
};
```
