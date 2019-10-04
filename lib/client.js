"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _options = require("./options");

var _codec = require("./codec");

var _handlers = require("./handlers");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var bodySplitter = '||';

function encodeGetParams(params) {
  return Object.entries(params).map(function (kv) {
    return kv.map(encodeURIComponent).join("=");
  }).join("&");
}

function encodeEvent(codec, type, payload) {
  var data = "";

  if (payload) {
    data = codec.marshal(payload);
  }

  return type + bodySplitter + data;
}

function decodeEvent(codec, data) {
  var parts = data.split(bodySplitter, 2);

  if (parts.length < 2) {
    throw "invalid message received. Splitter || expected";
  }

  var payload = undefined;

  if (parts[1]) {
    payload = codec.unmarshal(parts[1]);
  }

  return {
    type: parts[0],
    payload: payload
  };
}

var EtpClient =
/*#__PURE__*/
function () {
  function EtpClient(url, options) {
    _classCallCheck(this, EtpClient);

    _defineProperty(this, "conn", void 0);

    _defineProperty(this, "handlers", new _handlers.HandlersImpl());

    _defineProperty(this, "url", void 0);

    _defineProperty(this, "options", void 0);

    _defineProperty(this, "onConn", function () {});

    _defineProperty(this, "onDis", function (evt) {});

    _defineProperty(this, "onErr", function (err) {});

    var opts = (0, _options.defaultOptions)();

    if (options) {
      opts = _objectSpread({}, opts, {}, options);
    }

    this.url = url;
    this.options = opts;
  }

  _createClass(EtpClient, [{
    key: "onConnect",
    value: function onConnect(f) {
      this.onConn = f;
      return this;
    }
  }, {
    key: "onDisconnect",
    value: function onDisconnect(f) {
      this.onDis = f;
      return this;
    }
  }, {
    key: "onError",
    value: function onError(f) {
      this.onErr = f;
      return this;
    }
  }, {
    key: "on",
    value: function on(type, f) {
      this.handlers.on(type, f);
      return this;
    }
  }, {
    key: "off",
    value: function off(type) {
      this.handlers.off(type);
      return this;
    }
  }, {
    key: "emit",
    value: function emit(type, payload, ackTimeoutMs) {
      if (!this.conn || this.conn.readyState !== this.conn.OPEN) {
        return Promise.reject("connection not initialized");
      }

      var data = encodeEvent(this.options.codec || new _codec.JsonCodec(), type, payload);
      this.conn.send(data);
      return Promise.resolve();
    }
  }, {
    key: "connect",
    value: function connect() {
      var _this = this;

      var url = this.url;

      if (this.options.params && Object.keys(this.options.params).length > 0) {
        url = "?" + encodeGetParams(this.options.params);
      }

      var ws = new WebSocket(url);

      ws.onopen = function () {
        _this.onConn();
      };

      ws.onclose = function (evt) {
        _this.onDis(evt);
      };

      ws.onerror = function (err) {
        _this.onErr(err);
      };

      ws.onmessage = function (message) {
        try {
          var _event = decodeEvent(_this.options.codec || new _codec.JsonCodec(), message.data);

          var handler = _this.handlers.get(_event.type);

          if (handler) {
            handler(_event.payload);
          }
        } catch (e) {
          _this.onErr(e);
        }
      };

      this.conn = ws;
      return this;
    }
  }, {
    key: "close",
    value: function close(code, reason) {
      if (this.conn) {
        this.conn.close(code, reason);
        this.conn = undefined;
      }

      return this;
    }
  }]);

  return EtpClient;
}();

var _default = EtpClient;
exports["default"] = _default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9jbGllbnQudHMiXSwibmFtZXMiOlsiYm9keVNwbGl0dGVyIiwiZW5jb2RlR2V0UGFyYW1zIiwicGFyYW1zIiwiT2JqZWN0IiwiZW50cmllcyIsIm1hcCIsImt2IiwiZW5jb2RlVVJJQ29tcG9uZW50Iiwiam9pbiIsImVuY29kZUV2ZW50IiwiY29kZWMiLCJ0eXBlIiwicGF5bG9hZCIsImRhdGEiLCJtYXJzaGFsIiwiZGVjb2RlRXZlbnQiLCJwYXJ0cyIsInNwbGl0IiwibGVuZ3RoIiwidW5kZWZpbmVkIiwidW5tYXJzaGFsIiwiRXRwQ2xpZW50IiwidXJsIiwib3B0aW9ucyIsIkhhbmRsZXJzSW1wbCIsImV2dCIsImVyciIsIm9wdHMiLCJmIiwib25Db25uIiwib25EaXMiLCJvbkVyciIsImhhbmRsZXJzIiwib24iLCJvZmYiLCJhY2tUaW1lb3V0TXMiLCJjb25uIiwicmVhZHlTdGF0ZSIsIk9QRU4iLCJQcm9taXNlIiwicmVqZWN0IiwiSnNvbkNvZGVjIiwic2VuZCIsInJlc29sdmUiLCJrZXlzIiwid3MiLCJXZWJTb2NrZXQiLCJvbm9wZW4iLCJvbmNsb3NlIiwib25lcnJvciIsIm9ubWVzc2FnZSIsIm1lc3NhZ2UiLCJldmVudCIsImhhbmRsZXIiLCJnZXQiLCJlIiwiY29kZSIsInJlYXNvbiIsImNsb3NlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBQUE7O0FBQ0E7O0FBQ0E7Ozs7Ozs7Ozs7Ozs7O0FBRUEsSUFBTUEsWUFBWSxHQUFHLElBQXJCOztBQUVBLFNBQVNDLGVBQVQsQ0FBeUJDLE1BQXpCLEVBQWlEO0FBQzdDLFNBQU9DLE1BQU0sQ0FBQ0MsT0FBUCxDQUFlRixNQUFmLEVBQXVCRyxHQUF2QixDQUEyQixVQUFBQyxFQUFFO0FBQUEsV0FBSUEsRUFBRSxDQUFDRCxHQUFILENBQU9FLGtCQUFQLEVBQTJCQyxJQUEzQixDQUFnQyxHQUFoQyxDQUFKO0FBQUEsR0FBN0IsRUFBdUVBLElBQXZFLENBQTRFLEdBQTVFLENBQVA7QUFDSDs7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S0FBSSxDQUFDeEIsS0FBTCxDQUFXd0IsQ0FBWDtBQUNIO0FBQ0osT0FWRDs7QUFXQSxXQUFLbkIsSUFBTCxHQUFZUyxFQUFaO0FBQ0EsYUFBTyxJQUFQO0FBQ0g7OzswQkFFS1csSSxFQUFlQyxNLEVBQTRCO0FBQzdDLFVBQUksS0FBS3JCLElBQVQsRUFBZTtBQUNYLGFBQUtBLElBQUwsQ0FBVXNCLEtBQVYsQ0FBZ0JGLElBQWhCLEVBQXNCQyxNQUF0QjtBQUNBLGFBQUtyQixJQUFMLEdBQVlqQixTQUFaO0FBQ0g7O0FBQ0QsYUFBTyxJQUFQO0FBQ0g7Ozs7OztlQUlVRSxTIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtkZWZhdWx0T3B0aW9ucywgT3B0aW9uc30gZnJvbSBcIi4vb3B0aW9uc1wiO1xuaW1wb3J0IHtDb2RlYywgSnNvbkNvZGVjfSBmcm9tIFwiLi9jb2RlY1wiO1xuaW1wb3J0IHtIYW5kbGVyc0ltcGwsIEhhbmRsZXJzfSBmcm9tIFwiLi9oYW5kbGVyc1wiO1xuXG5jb25zdCBib2R5U3BsaXR0ZXIgPSAnfHwnO1xuXG5mdW5jdGlvbiBlbmNvZGVHZXRQYXJhbXMocGFyYW1zOiBvYmplY3QpOiBzdHJpbmcge1xuICAgIHJldHVybiBPYmplY3QuZW50cmllcyhwYXJhbXMpLm1hcChrdiA9PiBrdi5tYXAoZW5jb2RlVVJJQ29tcG9uZW50KS5qb2luKFwiPVwiKSkuam9pbihcIiZcIik7XG59XG5cbmZ1bmN0aW9uIGVuY29kZUV2ZW50KGNvZGVjOiBDb2RlYywgdHlwZTogc3RyaW5nLCBwYXlsb2FkOiBhbnkpOiBzdHJpbmcge1xuICAgIGxldCBkYXRhID0gXCJcIjtcbiAgICBpZiAocGF5bG9hZCkge1xuICAgICAgICBkYXRhID0gY29kZWMubWFyc2hhbChwYXlsb2FkKTtcbiAgICB9XG4gICAgcmV0dXJuIHR5cGUgKyBib2R5U3BsaXR0ZXIgKyBkYXRhO1xufVxuXG5mdW5jdGlvbiBkZWNvZGVFdmVudChjb2RlYzogQ29kZWMsIGRhdGE6IHN0cmluZyk6IHsgdHlwZTogc3RyaW5nLCBwYXlsb2FkPzogYW55IH0ge1xuICAgIGxldCBwYXJ0cyA9IGRhdGEuc3BsaXQoYm9keVNwbGl0dGVyLCAyKTtcbiAgICBpZiAocGFydHMubGVuZ3RoIDwgMikge1xuICAgICAgICB0aHJvdyBcImludmFsaWQgbWVzc2FnZSByZWNlaXZlZC4gU3BsaXR0ZXIgfHwgZXhwZWN0ZWRcIjtcbiAgICB9XG4gICAgbGV0IHBheWxvYWQgPSB1bmRlZmluZWQ7XG4gICAgaWYgKHBhcnRzWzFdKSB7XG4gICAgICAgIHBheWxvYWQgPSBjb2RlYy51bm1hcnNoYWwocGFydHNbMV0pO1xuICAgIH1cbiAgICByZXR1cm4ge1xuICAgICAgICB0eXBlOiBwYXJ0c1swXSwgcGF5bG9hZDogcGF5bG9hZCxcbiAgICB9XG59XG5cbmNsYXNzIEV0cENsaWVudCB7XG4gICAgcHJpdmF0ZSBjb25uPzogV2ViU29ja2V0O1xuICAgIHByaXZhdGUgcmVhZG9ubHkgaGFuZGxlcnM6IEhhbmRsZXJzID0gbmV3IEhhbmRsZXJzSW1wbCgpO1xuICAgIHByaXZhdGUgcmVhZG9ubHkgdXJsOiBzdHJpbmc7XG4gICAgcHJpdmF0ZSByZWFkb25seSBvcHRpb25zOiBPcHRpb25zO1xuICAgIHByaXZhdGUgb25Db25uOiAoKSA9PiB2b2lkID0gKCkgPT4ge1xuICAgIH07XG4gICAgcHJpdmF0ZSBvbkRpczogKGV2dDogQ2xvc2VFdmVudCkgPT4gdm9pZCA9IGV2dCA9PiB7XG4gICAgfTtcbiAgICBwcml2YXRlIG9uRXJyOiAoZXJyOiBhbnkpID0+IHZvaWQgPSBlcnIgPT4ge1xuICAgIH07XG5cbiAgICBjb25zdHJ1Y3Rvcih1cmw6IHN0cmluZywgb3B0aW9ucz86IE9wdGlvbnMpIHtcbiAgICAgICAgbGV0IG9wdHMgPSBkZWZhdWx0T3B0aW9ucygpO1xuICAgICAgICBpZiAob3B0aW9ucykge1xuICAgICAgICAgICAgb3B0cyA9IHsuLi5vcHRzLCAuLi5vcHRpb25zfTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnVybCA9IHVybDtcbiAgICAgICAgdGhpcy5vcHRpb25zID0gb3B0cztcbiAgICB9XG5cbiAgICBvbkNvbm5lY3QoZjogKCkgPT4gdm9pZCk6IEV0cENsaWVudCB7XG4gICAgICAgIHRoaXMub25Db25uID0gZjtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgb25EaXNjb25uZWN0KGY6IChldmVudDogQ2xvc2VFdmVudCkgPT4gdm9pZCk6IEV0cENsaWVudCB7XG4gICAgICAgIHRoaXMub25EaXMgPSBmO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICBvbkVycm9yKGY6IChlOiBhbnkpID0+IHZvaWQpOiBFdHBDbGllbnQge1xuICAgICAgICB0aGlzLm9uRXJyID0gZjtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgb248VD4odHlwZTogc3RyaW5nLCBmOiAoZGF0YTogVCkgPT4gdm9pZCk6IEV0cENsaWVudCB7XG4gICAgICAgIHRoaXMuaGFuZGxlcnMub24odHlwZSwgZik7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIG9mZih0eXBlOiBzdHJpbmcpOiBFdHBDbGllbnQge1xuICAgICAgICB0aGlzLmhhbmRsZXJzLm9mZih0eXBlKTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgZW1pdCh0eXBlOiBzdHJpbmcsIHBheWxvYWQ6IGFueSwgYWNrVGltZW91dE1zPzogbnVtYmVyKTogUHJvbWlzZTxhbnk+IHtcbiAgICAgICAgaWYgKCF0aGlzLmNvbm4gfHwgdGhpcy5jb25uLnJlYWR5U3RhdGUgIT09IHRoaXMuY29ubi5PUEVOKSB7XG4gICAgICAgICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QoXCJjb25uZWN0aW9uIG5vdCBpbml0aWFsaXplZFwiKVxuICAgICAgICB9XG4gICAgICAgIGxldCBkYXRhID0gZW5jb2RlRXZlbnQodGhpcy5vcHRpb25zLmNvZGVjIHx8IG5ldyBKc29uQ29kZWMoKSwgdHlwZSwgcGF5bG9hZCk7XG4gICAgICAgIHRoaXMuY29ubi5zZW5kKGRhdGEpO1xuICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKClcbiAgICB9XG5cbiAgICBjb25uZWN0KCk6IEV0cENsaWVudCB7XG4gICAgICAgIGxldCB1cmwgPSB0aGlzLnVybDtcbiAgICAgICAgaWYgKHRoaXMub3B0aW9ucy5wYXJhbXMgJiYgT2JqZWN0LmtleXModGhpcy5vcHRpb25zLnBhcmFtcykubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgdXJsID0gXCI/XCIgKyBlbmNvZGVHZXRQYXJhbXModGhpcy5vcHRpb25zLnBhcmFtcyk7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3Qgd3MgPSBuZXcgV2ViU29ja2V0KHVybCk7XG4gICAgICAgIHdzLm9ub3BlbiA9ICgpID0+IHtcbiAgICAgICAgICAgIHRoaXMub25Db25uKCk7XG4gICAgICAgIH07XG4gICAgICAgIHdzLm9uY2xvc2UgPSAoZXZ0OiBDbG9zZUV2ZW50KSA9PiB7XG4gICAgICAgICAgICB0aGlzLm9uRGlzKGV2dCk7XG4gICAgICAgIH07XG4gICAgICAgIHdzLm9uZXJyb3IgPSBlcnIgPT4ge1xuICAgICAgICAgICAgdGhpcy5vbkVycihlcnIpO1xuICAgICAgICB9O1xuICAgICAgICB3cy5vbm1lc3NhZ2UgPSBtZXNzYWdlID0+IHtcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgY29uc3QgZXZlbnQgPSBkZWNvZGVFdmVudCh0aGlzLm9wdGlvbnMuY29kZWMgfHwgbmV3IEpzb25Db2RlYygpLCBtZXNzYWdlLmRhdGEpO1xuICAgICAgICAgICAgICAgIGNvbnN0IGhhbmRsZXIgPSB0aGlzLmhhbmRsZXJzLmdldChldmVudC50eXBlKTtcbiAgICAgICAgICAgICAgICBpZiAoaGFuZGxlcikge1xuICAgICAgICAgICAgICAgICAgICBoYW5kbGVyKGV2ZW50LnBheWxvYWQpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgICAgICB0aGlzLm9uRXJyKGUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgICAgICB0aGlzLmNvbm4gPSB3cztcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgY2xvc2UoY29kZT86IG51bWJlciwgcmVhc29uPzogc3RyaW5nKTogRXRwQ2xpZW50IHtcbiAgICAgICAgaWYgKHRoaXMuY29ubikge1xuICAgICAgICAgICAgdGhpcy5jb25uLmNsb3NlKGNvZGUsIHJlYXNvbik7XG4gICAgICAgICAgICB0aGlzLmNvbm4gPSB1bmRlZmluZWQ7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG59XG5cbmV4cG9ydCBkZWZhdWx0IEV0cENsaWVudDtcbiJdfQ==