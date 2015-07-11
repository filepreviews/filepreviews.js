# FilePreviews.io
JavaScript client library for the [FilePreviews.io](http://filepreviews.io) service. A lot more to come very soon.

## Installation
```
bower install filepreviews
```

## Demo
We have a working [demo on jsBin](http://jsbin.com/losaf/39/edit?js,output).

## Usage
### Latest version
```html
<script src="//dufozrddxzwdn.cloudfront.net/latest/filepreviews.min.js"></script>
<script src="//dufozrddxzwdn.cloudfront.net/latest/filepreviews.js"></script>
```

### You can also link to a specific version
```html
<script src="//dufozrddxzwdn.cloudfront.net/<VERSION_NUMBER>/filepreviews.min.js"></script>
<script src="//dufozrddxzwdn.cloudfront.net/<VERSION_NUMBER>/filepreviews.js"></script>
```

## Example code
```js
var previews = new FilePreviews({
  debug: true,
  apiKey: 'API_KEY_HERE'
});

previews.generate(url, function(err, result) {
  console.log(result.id);
  console.log(result.status);

  previews.retrieve(result.id, function(err, result) {
    console.log(result);
  });
});
```

### Options
You can optinally send an options object.
```js
var previews = new FilePreviews({
  debug: true,
  apiKey: 'API_KEY_HERE'
});

var options = {
  size: {
    width: 250,
    height: 250,
  },
  metadata: ['exif', 'ocr', 'psd'],
  format: 'jpg'
}

previews.generate(url, options, function(err, result) {
  console.log(result.id);
  console.log(result.status);
});
```

## Build
```
$ git clone https://github.com/GetBlimp/filepreviews.js.git
$ cd filepreviews.js
$ npm run build
```
