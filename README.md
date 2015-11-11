# FilePreviews.io
[![Build Status](https://travis-ci.org/GetBlimp/filepreviews.js.svg)](https://travis-ci.org/GetBlimp/filepreviews.js)

JavaScript client library for the [FilePreviews.io](http://filepreviews.io) service.

## How to use
#### Install using bower
```
bower install filepreviews
```

#### Use from our CDN distribution
```html
<script src="https://dufozrddxzwdn.cloudfront.net/2.0.3/filepreviews.min.js"></script>
<script src="https://dufozrddxzwdn.cloudfront.net/2.0.3/filepreviews.js"></script>
```

#### Download
You can also download the latest version from the [releases page](https://github.com/GetBlimp/filepreviews.js/releases/).

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
  apiKey: 'CLIENT_API_KEY_HERE'
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
  console.log(result.previewURL);
  console.log(result.metadata);
});
```

## Build
```
$ git clone https://github.com/GetBlimp/filepreviews.js.git
$ cd filepreviews.js
$ npm run build
```

## Publish
```
$ npm run publish
```
