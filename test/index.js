/* globals describe it before chai FilePreviews */
var assert = chai.assert;

describe('Suite', function() {
  describe('initialization', function() {
    it('should require apiKey', function() {
      assert.throws(function() {
        var fp = new FilePreviews();
      });
    });

    it('should not throw if given apiKey and apiSecret', function() {
      assert.doesNotThrow(function() {
        var fp = new FilePreviews({ apiKey: 'key' });
      });
    });

    it('should set apiKey and apiSecret', function() {
      var fp = new FilePreviews({ apiKey: 'key' });
      assert.equal(fp.apiKey, 'key');
    });
  });

  describe('#getAPIRequestData()', function() {
    var fp;
    before(function() {
      fp = new FilePreviews({ apiKey: 'key' });
    });

    it('should work without options', function() {
      var url = 'http://example.com';
      var result = fp.getAPIRequestData(url);
      assert.equal(result.url, url);
    });

    it('should work with options', function() {
      var url = 'http://example.com';
      var options = {
        format: 'jpg'
      };

      var result = fp.getAPIRequestData(url, options);
      assert.equal(result.url, url);
      assert.equal(result.format, options.format);
    });

    it('should concantenate height and width', function() {
      var url = 'http://example.com';
      var options = {
        size: {
          width: 1,
          height: 2
        }
      };

      var result = fp.getAPIRequestData(url, options);
      assert.equal(result.sizes[0], '1x2');
    });

    it('should handle width only', function() {
      var url = 'http://example.com';
      var options = {
        size: {
          width: 1
        }
      };

      var result = fp.getAPIRequestData(url, options);
      assert.equal(result.sizes[0], '1');
    });

    it('should handle height only', function() {
      var url = 'http://example.com';
      var options = {
        size: {
          height: 2
        }
      };

      var result = fp.getAPIRequestData(url, options);
      assert.equal(result.sizes[0], 'x2');
    });
  });

  describe('#getAPIRequestHeaders()', function() {
    it('should generate Basic auth header', function() {
      var fp = new FilePreviews({ apiKey: 'key' });
      var headers = fp.getAPIRequestHeaders();

      assert.equal(headers['Content-Type'], 'application/json');
      assert.equal(headers.Authorization, 'Basic a2V5:');
    });
  });

  describe('#request()', function() {
    var fp;
    before(function() {
      fp = new FilePreviews({ apiKey: 'key', apiSecret: 'secret' });
    });

    it('should send auth information', function() {
      fp._ajax = function(url, options) {
        assert.isDefined(options.headers.Authorization);
      };

      fp.request('http://example.com/', { method: 'GET' });
    });

    it('should set GET as default method', function() {
      fp._ajax = function(url, options) {
        assert.equal(options.method, 'GET');
      };

      fp.request('http://example.com/');
    });

    it('should accept method type in options', function() {
      fp._ajax = function(url, options) {
        assert.equal(options.method, 'POST');
      };

      fp.request('http://example.com/', { method: 'POST' });
    });

    it('should accept data String in options', function() {
      fp._ajax = function(url, options) {
        assert.equal(options.data, 'my-data');
      };

      fp.request('http://example.com/', { data: 'my-data' });
    });

    it('should accept data Object in options', function() {
      fp._ajax = function(url, options) {
        assert.equal(options.data.foo, 'bar');
      };

      fp.request('http://example.com/', { data: { foo: 'bar' } });
    });

    it('should format request correctly', function() {
      var _url = 'http://example.com/one/two/three';

      fp._ajax = function(url, options) {
        assert.equal(options.headers.Authorization, 'Basic a2V5:');

        assert.equal(options.method, 'POST');

        assert.equal(_url, url);
        assert.equal(options.data.foo, 'bar');
      };
      fp.request(_url, {
        method: 'POST',
        data: { foo: 'bar'}
      });
    });

    it('should handle success', function() {
      fp._ajax = function(url, options) {
        options.success('{"foo":"bar"}', { status: 200 });
      };

      fp.request('http://example.com/', {}, function(err, response) {
        assert.equal(err, null);
        assert.equal(response.foo, 'bar');
      });
    });

    it('should handle error', function() {
      fp._ajax = function(url, options) {
        options.error(500, 'Server Error', { status: 500, responseText: 'Server Error' });
      };

      fp.request('http://example.com/', {}, function(err, response) {
        assert.equal(err, 'Server Error');
        assert.equal(response, null);
      });
    });
  });
});
