/* global ajax */

class FilePreviews {
  constructor(options) {
    var opts = options || {};

    this.API_URL = 'https://api.filepreviews.io/v2';
    this.debug = opts.debug || false;
    this.apiKey = opts.apiKey;
    this._ajax = ajax;

    if (!opts.apiKey) {
      throw new Error('Missing required apiKey.');
    }

  }

  log(msg) {
    if (this.debug) {
      console.log(msg);
    }
  }

  generate(url, options, callback) {
    if (arguments.length === 2) {
      if (Object.prototype.toString.call(options) === '[object Function]') {
        callback = options;
      }
    } else if (arguments.length === 1) {
      options = {};
    }

    this.request(`${this.API_URL}/previews/`, {
      method: 'POST',
      data: JSON.stringify(this.getAPIRequestData(url, options))
    },
    function(err, result) {
      if (callback) {
        callback(err, result);
      }
    });
  }

  retrieve(previewId, callback) {
    this.request(`${this.API_URL}/previews/${previewId}/`, {
      method: 'GET'
    },
    function(err, result) {
      if (callback) {
        callback(err, result);
      }
    });
  }

  request(url, options, callback) {
    var data;
    var _options = options || {};

    var onSuccess = (response, xhr) => {
      this.log(`API request success: ${xhr.status} ${xhr.statusText}`);

      data = JSON.parse(response);
      this.log(`API request response: ${data}`);

      callback(null, data);
    };

    var onError = (status, message, xhr) => {
      try {
        data = JSON.parse(xhr.responseText);
      } catch (e) {
        data = xhr.responseText;
      }

      if (status === 201) {
        onSuccess(xhr.responseText, xhr);
      } else {
        this.log(`API request error: ${status}`);
        callback(data);
      }
    };

    var requestOptions = {
      headers: this.getAPIRequestHeaders(),
      method: _options.method || 'GET',
      success: onSuccess,
      error: onError
    };

    if (_options.data) {
      requestOptions.data = _options.data;
    }

    this.log(`API request to: ${url}`);

    this._ajax(url, requestOptions);
  }

  getAPIRequestHeaders() {
    return {
      'Content-Type': 'application/json',
      Authorization: `Basic ${btoa(this.apiKey)}:`
    };
  }

  getAPIRequestData(url, options) {
    var size;

    if (arguments.length === 2) {
      if (Object.prototype.toString.call(options) === '[object Function]') {
        options = {};
      }
    } else if (arguments.length === 1) {
      options = {};
    }

    if (options) {
      options.url = url;

      if (options.size) {
        size = '';

        if (options.size.width) {
          size = options.size.width;
        }

        if (options.size.height) {
          size = `${size}x${options.size.height}`;
        }

        options.sizes = [size];
      }
    }

    return options;
  }
}
