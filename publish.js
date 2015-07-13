var s3 = require('s3');
var pkg = require('./package');

// load dot env
require('dotenv').load();

var client = s3.createClient({
  s3Options: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  }
});

var uploader = client.uploadDir({
  localDir: 'dist',

  s3Params: {
    Bucket: process.env.AWS_S3_BUCKET,
    Prefix: pkg.version
  }
});


uploader.on('error', function(err) {
  console.error('Unable to sync:', err.stack);
});

uploader.on('progress', function() {
  console.log("progress", uploader.progressAmount, uploader.progressTotal);
});

uploader.on('end', function() {
  console.log("done uploading");
});
