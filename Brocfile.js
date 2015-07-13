var pkg = require('./package');
var funnel = require('broccoli-funnel');
var babel = require('broccoli-babel-transpiler');
var concat = require('broccoli-concat');
var merge = require('broccoli-merge-trees');
var uglify = require('broccoli-uglify-js');
var rename = require('broccoli-rename-files');

var src = funnel('src', {
  destDir: 'src'
});

var es6 = babel(src);
var bower = funnel('bower_components');

var js = merge([es6, bower]);

var lib = concat(js, {
  inputFiles: [
    'base64/base64.js',
    'xhr/XMLHttpRequest.js',
    'xhr-ajax/xhr-ajax.js',
    'src/index.js'
  ],
  outputFile: '/filepreviews.js',
  header: '/** ' + pkg.name + ' ' + pkg.version + ' **/'
});

var forMinification = rename(lib, { append: '.min' });
var libCompressed = uglify(forMinification, { compress: true });

module.exports = merge([lib, libCompressed]);
