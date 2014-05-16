# FilePreviews.io
This is a client library for the **Demo API** of [FilePreviews.io](http://filepreviews.io) service. A lot more to come very soon.

[Sign up to beta](http://eepurl.com/To0U1)

## Installation
```
bower install filepreviews
```

## Demo
We have a working [demo on jsBin](http://jsbin.com/losaf/39/edit?js,output).

## Usage

##### Latest version
```html
<script src="//dufozrddxzwdn.cloudfront.net/latest/filepreviews.min.js"></script>
```
```html
<script src="//dufozrddxzwdn.cloudfront.net/latest/filepreviews.js"></script>
```

##### You can also link to a specific version
```html
<script src="//dufozrddxzwdn.cloudfront.net/ <VERSION_NUMBER> /filepreviews.min.js"></script>
```
```html
<script src="//dufozrddxzwdn.cloudfront.net/ <VERSION_NUMBER> /filepreviews.js"></script>
```

### Example code
```js
var previews = new FilePreviews({debug: true});
previews.generate(url, function(err, result) {
  console.log(result.previewURL);
  console.log(result.metadata);
});
```

#### Options
You can optinally send an options object.
```js
var previews = new FilePreviews({debug: true});
var options = {
  size: {
    width: 100,
    height: 999,
  },
  // supported:
  // 'exif', 'ocr', 'psd', 'checksum', 'multimedia',
  // and 'all' which means everything
  metadata: ['exif', 'ocr', 'psd']
}

previews.generate(url, options, function(err, result) {
  console.log(result.previewURL);
  console.log(result.metadata);
});
```

## Build
```
git clone https://github.com/GetBlimp/filepreviews.js.git
cd filepreviews.js
npm install && grunt
```
