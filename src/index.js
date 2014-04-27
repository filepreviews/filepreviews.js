(function() {
  'use strict';

  var API_URL = 'https://blimp-previews.herokuapp.com/?size=1&url=',
      RESULTS_URL = 'https://demo.filepreviews.io.s3-website-us-east-1.amazonaws.com/',
      FilePreviews;

  FilePreviews = function(options) {
    options = options || {};

    this._cache = {};
    this.debug = options.debug || false;
    this.resultsUrl = options.resultsUrl || RESULTS_URL;
  };

  FilePreviews.prototype._log = function(msg) {
    if (this.debug) console.log(msg);
    return this;
  };

  FilePreviews.prototype.hash = function(string) {
    if (!CryptoJS) throw new Error('CryptoJS library not found.');
    return CryptoJS.SHA256(string).toString();
  };

  FilePreviews.prototype.generate = function(url, callback) {
    var urlHash = this.hash(url),
        result;

    if (this._cache[urlHash]) {
      this._log('Cache hit');
      result = this._cache[urlHash];
      result.isCached = true;
      callback(null, result);
    } else { // Request preview
      this._log('Cache miss');

      this._submitJobToAPI(url, function(err, result) {
        if (err) {
          console.error('Something went wrong', err);
        } else {
          this._cache[urlHash] = result;
        }

        this._log('Processing done...');
        callback(err, result);
      }.bind(this));
    }
  };

  FilePreviews.prototype._submitJobToAPI = function(url, callback) {
    return $.get(this.getAPIRequestURL(url)).always(function(data, textStatus, jqXHR) {
      this._log('API Request: ' + jqXHR.status);

      if (jqXHR.status === 429) {
        callback('Throttling Error, try later');
      } else {
        this._pollForMetadata(url, function(err, metadata) {
          callback(null, {
            metadata: metadata,
            previewURL: this.getPreviewURL(url)
          });
        }.bind(this));
      }
    }.bind(this));
  };

  FilePreviews.prototype._pollForMetadata = function(url, callback) {
    var _getter = function() {
      this._log('Polling for metadata...');

      return $.getJSON(this.getMetadataURL(url), function(data) {
        callback(null, data);
      }).fail(function() {
        setTimeout(_getter, 1000);
      });
    }.bind(this);

    return _getter();
  };

  FilePreviews.prototype.getAPIRequestURL = function(url) {
    return API_URL + url;
  };

  FilePreviews.prototype.getMetadataURL = function(url) {
    return this.resultsUrl + this.hash(url) + '/metadata.json';
  };

  FilePreviews.prototype.getPreviewURL = function(url) {
    return this.resultsUrl + this.hash(url) + '/' +
    this.getPreviewFilename(this.getFilename(url)) + '_original_1.png';
  };

  FilePreviews.prototype.getFilename = function(url) {
    return url.split('/').pop();
  };

  FilePreviews.prototype.getPreviewFilename = function(filename) {
    return filename.substr(0, filename.lastIndexOf('.')) || filename;
  };

  if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    module.exports = FilePreviews;
  } else {
    window.FilePreviews = FilePreviews;
  }

  return FilePreviews;
})();
