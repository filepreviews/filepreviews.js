(function() {
  'use strict';

  var API_URL = 'https://api.filepreviews.io/v1/',
      FilePreviews;

  FilePreviews = function(options) {
    options = options || {};

    this.debug = options.debug || false;
    this.apiKey = options.apiKey;
  };

  FilePreviews.prototype._log = function(msg) {
    if (this.debug) console.log(msg);
    return this;
  };

  FilePreviews.prototype.generate = function(url, options, callback) {
    if (arguments.length === 2) {
      if (Object.prototype.toString.call(options) === '[object Function]') {
        callback = options;
      }
    } else if(arguments.length === 1) {
      options = {};
    }

    this._submitJobToAPI(url, options, function(err, result) {
      if (err) {
        this._log('Error: ' + err);
      }

      this._log('Processing done :)');
      if (callback) {
        callback(err, result);
      }
    }.bind(this));
  };

  FilePreviews.prototype._submitJobToAPI = function(url, options, callback) {
    if (arguments.length === 2) {
      if (Object.prototype.toString.call(options) === '[object Function]') {
        callback = options;
      }
    } else if(arguments.length === 1) {
      options = {};
    }

    this._log('API request to: ' + API_URL);

    var data = this.getAPIRequestData(url, options),
      ajaxHeaders = {
        'Content-Type': 'application/json'
      };

    if (this.apiKey) {
      ajaxHeaders['X-API-KEY'] = this.apiKey;
    }

    ajax(API_URL, {
      headers: ajaxHeaders,
      method: 'POST',
      data: JSON.stringify(data),

      success: function(response, xhr) {
        this._log('API request success: ' + xhr.status + ' ' + xhr.statusText);

        var data = JSON.parse(response);
        this._log('API request response:', data);

        this._pollForMetadata(data.metadata_url, options, function(err, metadata) {
          if (err) {
            callback(err);
          } else {
            callback(null, {
              metadata: metadata,
              previewURL: data.preview_url
            });
          }
        }.bind(this));
      }.bind(this),

      error: function(status, message, xhr) {
        var error = 'API request error: ';
        if (status === 429) {
          error = error + 'Throttling error, try later';
        } else {
          error = error + status;
        }
        this._log(error);
        callback(error);

      }.bind(this)

    });
  };

  FilePreviews.prototype._pollForMetadata = function(url, options, callback) {
    this._log('Metadata poll url: ' + url);
    if (arguments.length === 2) {
      if (Object.prototype.toString.call(options) === '[object Function]') {
        callback = options;
      }
    }  else if(arguments.length === 1) {
      options = {};
    }

    var tries = 1,
        pause = 1000;

    var _getter = function() {
      this._log('Polling for metadata, tries: ' + tries);

      ajax(url, {
        success: function(response, xhr) {
          this._log('Metadata found');
          var data = JSON.parse(response);

          if (data.error) {
            callback(data.error);
          } else {
            callback(null, data);
          }
        }.bind(this),

        error: function(status, message, xhr) {
          pause = pause + (tries * 1000);
          tries++;

          this._log('Metadata not found next try in: ' + pause / 1000 + 's');
          setTimeout(_getter, pause);
        }.bind(this)
      });
    }.bind(this);

    return _getter();
  };

  FilePreviews.prototype.getAPIRequestData = function(url, options) {
    if (arguments.length === 2) {
      if (Object.prototype.toString.call(options) === '[object Function]') {
        options = {};
        console.log('entro!');
      }
    } else if(arguments.length === 1) {
      options = {};
    }

    if (options) {

      options.url = url;

      if (options.size) {
        var size = '';

        if (options.size.width) {
          size = options.size.width;
        }

        if (options.size.height) {
          size = size + 'x' + options.size.height;
        }

        options.sizes = [size];
      }
    }

    return options;
  };

  if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    module.exports = FilePreviews;
  } else {
    window.FilePreviews = FilePreviews;
  }

  return FilePreviews;
})();
