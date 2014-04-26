# FilePreviews.io
This is a client library for the **Demo API** of [FilePeviews.io](http://FilePeviews.io) service. A lot more to come very soon.

## Installation
```
bower install filepreviews
```

## Demo
We have a working [demo on jsBin](http://jsbin.com/losaf/39/edit?js,output).

## Client side usage

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

#### Example code
```js
FilePreviews.generate(url, function(err, result) {
  if (err) {
    console.error(err);
  } else {
    console.log(result.previewURL);
    console.log(result.metadata);
  }
});
```

## Build
```
git clone https://github.com/GetBlimp/filepreviews.js.git
cd filepreviews.js
npm install && grunt
```
