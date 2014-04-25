(function(window) {
  'use strict';

  window.FilePreviews = {
      _cache: {},
      apiBaseURL: 'https://blimp-previews.herokuapp.com/?size=1&url=',
      resultsBaseURL: 'http://demo.filepreviews.io.s3-website-us-east-1.amazonaws.com/',

      hash: function(string) {
        return CryptoJS.SHA256(string).toString();
      },

      generate: function(url, callback) {
        var self = this,
            urlHash = this.hash(url),
            result;

        if (this._cache[urlHash]) {
          console.log('Cache hit');
          result = this._cache[urlHash];
          result.isCached = true;
          callback(null, result);

        } else {
          // Request preview
          console.log('Cache miss');

          this._submitJobToAPI(url, function(err, result) {
            if (err) {
              console.error('Something went wrong');
            } else {
              self._cache[urlHash] = result;
            }

            console.log('Processing done...');
            callback(err, result);
          });
        }
      },

      _submitJobToAPI: function(url, callback) {
        var self = this,
            _url = this.getAPIRequestURL(url);

        $.get(_url)
        .always(function(data, textStatus, jqXHR) {
          console.log('API Request: ' + jqXHR.status);

          if (jqXHR.status === 429) {
            callback('Throttling Error, try later');
          } else {
            self._pollForMetadata(url, function(err, metadata) {
              callback(null, {metadata: metadata, previewURL: self.getPreviewURL(url)});
            });
          }
        });

      },

      _pollForMetadata: function(url, callback) {
        var _url = this.getMetadataURL(url),
            _getter;

        _getter = function() {
          console.log('Polling for metadata...');

          $.getJSON(_url, function(data) {
            callback(null, data);
          })
          .fail(function() {
            setTimeout(_getter, 1000);
          });
        };

        _getter();

      },

      getAPIRequestURL: function(url) {
        return this.apiBaseURL + url;
      },

      getMetadataURL: function(url) {
        return this.resultsBaseURL + this.hash(url) + '/metadata.json';
      },

      getPreviewURL: function(url) {
        var result = this.resultsBaseURL;
        result = result + this.hash(url) + '/';
        result = result + this.getPreviewFilename(this.getFilename(url)) + '_original_1.png';

        return result;
      },

      getFilename: function(url) {
        return url.split('/').pop();
      },

      getPreviewFilename: function(filename) {
        return filename.substr(0, filename.lastIndexOf('.')) || filename;
      }
    };

})(window);
