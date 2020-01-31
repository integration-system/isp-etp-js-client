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

  return "".concat(type).concat(bodySplitter, "0").concat(bodySplitter).concat(data);
}

function decodeEvent(codec, data) {
  var parts = data.split(bodySplitter, 3);

  if (parts.length < 3) {
    throw "invalid message received. Splitter || expected";
  }

  var payload = undefined;

  if (parts[2]) {
    payload = codec.unmarshal(parts[2]);
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
        url = url + "?" + encodeGetParams(this.options.params);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9jbGllbnQudHMiXSwibmFtZXMiOlsiYm9keVNwbGl0dGVyIiwiZW5jb2RlR2V0UGFyYW1zIiwicGFyYW1zIiwiT2JqZWN0IiwiZW50cmllcyIsIm1hcCIsImt2IiwiZW5jb2RlVVJJQ29tcG9uZW50Iiwiam9pbiIsImVuY29kZUV2ZW50IiwiY29kZWMiLCJ0eXBlIiwicGF5bG9hZCIsImRhdGEiLCJtYXJzaGFsIiwiZGVjb2RlRXZlbnQiLCJwYXJ0cyIsInNwbGl0IiwibGVuZ3RoIiwidW5kZWZpbmVkIiwidW5tYXJzaGFsIiwiRXRwQ2xpZW50IiwidXJsIiwib3B0aW9ucyIsIkhhbmRsZXJzSW1wbCIsImV2dCIsImVyciIsIm9wdHMiLCJmIiwib25Db25uIiwib25EaXMiLCJvbkVyciIsImhhbmRsZXJzIiwib24iLCJvZmYiLCJhY2tUaW1lb3V0TXMiLCJjb25uIiwicmVhZHlTdGF0ZSIsIk9QRU4iLCJQcm9taXNlIiwicmVqZWN0IiwiSnNvbkNvZGVjIiwic2VuZCIsInJlc29sdmUiLCJrZXlzIiwid3MiLCJXZWJTb2NrZXQiLCJvbm9wZW4iLCJvbmNsb3NlIiwib25lcnJvciIsIm9ubWVzc2FnZSIsIm1lc3NhZ2UiLCJldmVudCIsImhhbmRsZXIiLCJnZXQiLCJlIiwiY29kZSIsInJlYXNvbiIsImNsb3NlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBQUE7O0FBQ0E7O0FBQ0E7Ozs7Ozs7Ozs7Ozs7O0FBRUEsSUFBTUEsWUFBWSxHQUFHLElBQXJCOztBQUVBLFNBQVNDLGVBQVQsQ0FBeUJDLE1BQXpCLEVBQWlEO0FBQzdDLFNBQU9DLE1BQU0sQ0FBQ0MsT0FBUCxDQUFlRixNQUFmLEVBQXVCRyxHQUF2QixDQUEyQixVQUFBQyxFQUFFO0FBQUEsV0FBSUEsRUFBRSxDQUFDRCxHQUFILENBQU9FLGtCQUFQLEVBQTJCQyxJQUEzQixDQUFnQyxHQUFoQyxDQUFKO0FBQUEsR0FBN0IsRUFBdUVBLElBQXZFLENBQTRFLEdBQTVFLENBQVA7QUFDSDs7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Q0FNRSxPQUFPMkMsQ0FBUCxFQUFVO0FBQ1IsVUFBQSxLQUFJLENBQUN4QixLQUFMLENBQVd3QixDQUFYO0FBQ0g7QUFDSixPQVZEOztBQVdBLFdBQUtuQixJQUFMLEdBQVlTLEVBQVo7QUFDQSxhQUFPLElBQVA7QUFDSDs7OzBCQUVLVyxJLEVBQWVDLE0sRUFBNEI7QUFDN0MsVUFBSSxLQUFLckIsSUFBVCxFQUFlO0FBQ1gsYUFBS0EsSUFBTCxDQUFVc0IsS0FBVixDQUFnQkYsSUFBaEIsRUFBc0JDLE1BQXRCO0FBQ0EsYUFBS3JCLElBQUwsR0FBWWpCLFNBQVo7QUFDSDs7QUFDRCxhQUFPLElBQVA7QUFDSDs7Ozs7O2VBSVVFLFMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge2RlZmF1bHRPcHRpb25zLCBPcHRpb25zfSBmcm9tIFwiLi9vcHRpb25zXCI7XG5pbXBvcnQge0NvZGVjLCBKc29uQ29kZWN9IGZyb20gXCIuL2NvZGVjXCI7XG5pbXBvcnQge0hhbmRsZXJzSW1wbCwgSGFuZGxlcnN9IGZyb20gXCIuL2hhbmRsZXJzXCI7XG5cbmNvbnN0IGJvZHlTcGxpdHRlciA9ICd8fCc7XG5cbmZ1bmN0aW9uIGVuY29kZUdldFBhcmFtcyhwYXJhbXM6IG9iamVjdCk6IHN0cmluZyB7XG4gICAgcmV0dXJuIE9iamVjdC5lbnRyaWVzKHBhcmFtcykubWFwKGt2ID0+IGt2Lm1hcChlbmNvZGVVUklDb21wb25lbnQpLmpvaW4oXCI9XCIpKS5qb2luKFwiJlwiKTtcbn1cblxuZnVuY3Rpb24gZW5jb2RlRXZlbnQoY29kZWM6IENvZGVjLCB0eXBlOiBzdHJpbmcsIHBheWxvYWQ6IGFueSk6IHN0cmluZyB7XG4gICAgbGV0IGRhdGEgPSBcIlwiO1xuICAgIGlmIChwYXlsb2FkKSB7XG4gICAgICAgIGRhdGEgPSBjb2RlYy5tYXJzaGFsKHBheWxvYWQpO1xuICAgIH1cbiAgICByZXR1cm4gYCR7dHlwZX0ke2JvZHlTcGxpdHRlcn0wJHtib2R5U3BsaXR0ZXJ9JHtkYXRhfWA7XG59XG5cbmZ1bmN0aW9uIGRlY29kZUV2ZW50KGNvZGVjOiBDb2RlYywgZGF0YTogc3RyaW5nKTogeyB0eXBlOiBzdHJpbmcsIHBheWxvYWQ/OiBhbnkgfSB7XG4gICAgbGV0IHBhcnRzID0gZGF0YS5zcGxpdChib2R5U3BsaXR0ZXIsIDMpO1xuICAgIGlmIChwYXJ0cy5sZW5ndGggPCAzKSB7XG4gICAgICAgIHRocm93IFwiaW52YWxpZCBtZXNzYWdlIHJlY2VpdmVkLiBTcGxpdHRlciB8fCBleHBlY3RlZFwiO1xuICAgIH1cbiAgICBsZXQgcGF5bG9hZCA9IHVuZGVmaW5lZDtcbiAgICBpZiAocGFydHNbMl0pIHtcbiAgICAgICAgcGF5bG9hZCA9IGNvZGVjLnVubWFyc2hhbChwYXJ0c1syXSk7XG4gICAgfVxuICAgIHJldHVybiB7XG4gICAgICAgIHR5cGU6IHBhcnRzWzBdLCBwYXlsb2FkOiBwYXlsb2FkLFxuICAgIH1cbn1cblxuY2xhc3MgRXRwQ2xpZW50IHtcbiAgICBwcml2YXRlIGNvbm4/OiBXZWJTb2NrZXQ7XG4gICAgcHJpdmF0ZSByZWFkb25seSBoYW5kbGVyczogSGFuZGxlcnMgPSBuZXcgSGFuZGxlcnNJbXBsKCk7XG4gICAgcHJpdmF0ZSByZWFkb25seSB1cmw6IHN0cmluZztcbiAgICBwcml2YXRlIHJlYWRvbmx5IG9wdGlvbnM6IE9wdGlvbnM7XG4gICAgcHJpdmF0ZSBvbkNvbm46ICgpID0+IHZvaWQgPSAoKSA9PiB7XG4gICAgfTtcbiAgICBwcml2YXRlIG9uRGlzOiAoZXZ0OiBDbG9zZUV2ZW50KSA9PiB2b2lkID0gZXZ0ID0+IHtcbiAgICB9O1xuICAgIHByaXZhdGUgb25FcnI6IChlcnI6IGFueSkgPT4gdm9pZCA9IGVyciA9PiB7XG4gICAgfTtcblxuICAgIGNvbnN0cnVjdG9yKHVybDogc3RyaW5nLCBvcHRpb25zPzogT3B0aW9ucykge1xuICAgICAgICBsZXQgb3B0cyA9IGRlZmF1bHRPcHRpb25zKCk7XG4gICAgICAgIGlmIChvcHRpb25zKSB7XG4gICAgICAgICAgICBvcHRzID0gey4uLm9wdHMsIC4uLm9wdGlvbnN9O1xuICAgICAgICB9XG4gICAgICAgIHRoaXMudXJsID0gdXJsO1xuICAgICAgICB0aGlzLm9wdGlvbnMgPSBvcHRzO1xuICAgIH1cblxuICAgIG9uQ29ubmVjdChmOiAoKSA9PiB2b2lkKTogRXRwQ2xpZW50IHtcbiAgICAgICAgdGhpcy5vbkNvbm4gPSBmO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICBvbkRpc2Nvbm5lY3QoZjogKGV2ZW50OiBDbG9zZUV2ZW50KSA9PiB2b2lkKTogRXRwQ2xpZW50IHtcbiAgICAgICAgdGhpcy5vbkRpcyA9IGY7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIG9uRXJyb3IoZjogKGU6IGFueSkgPT4gdm9pZCk6IEV0cENsaWVudCB7XG4gICAgICAgIHRoaXMub25FcnIgPSBmO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICBvbjxUPih0eXBlOiBzdHJpbmcsIGY6IChkYXRhOiBUKSA9PiB2b2lkKTogRXRwQ2xpZW50IHtcbiAgICAgICAgdGhpcy5oYW5kbGVycy5vbih0eXBlLCBmKTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgb2ZmKHR5cGU6IHN0cmluZyk6IEV0cENsaWVudCB7XG4gICAgICAgIHRoaXMuaGFuZGxlcnMub2ZmKHR5cGUpO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICBlbWl0KHR5cGU6IHN0cmluZywgcGF5bG9hZDogYW55LCBhY2tUaW1lb3V0TXM/OiBudW1iZXIpOiBQcm9taXNlPGFueT4ge1xuICAgICAgICBpZiAoIXRoaXMuY29ubiB8fCB0aGlzLmNvbm4ucmVhZHlTdGF0ZSAhPT0gdGhpcy5jb25uLk9QRU4pIHtcbiAgICAgICAgICAgIHJldHVybiBQcm9taXNlLnJlamVjdChcImNvbm5lY3Rpb24gbm90IGluaXRpYWxpemVkXCIpXG4gICAgICAgIH1cbiAgICAgICAgbGV0IGRhdGEgPSBlbmNvZGVFdmVudCh0aGlzLm9wdGlvbnMuY29kZWMgfHwgbmV3IEpzb25Db2RlYygpLCB0eXBlLCBwYXlsb2FkKTtcbiAgICAgICAgdGhpcy5jb25uLnNlbmQoZGF0YSk7XG4gICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoKVxuICAgIH1cblxuICAgIGNvbm5lY3QoKTogRXRwQ2xpZW50IHtcbiAgICAgICAgbGV0IHVybCA9IHRoaXMudXJsO1xuICAgICAgICBpZiAodGhpcy5vcHRpb25zLnBhcmFtcyAmJiBPYmplY3Qua2V5cyh0aGlzLm9wdGlvbnMucGFyYW1zKS5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICB1cmwgPSB1cmwgKyBcIj9cIiArIGVuY29kZUdldFBhcmFtcyh0aGlzLm9wdGlvbnMucGFyYW1zKTtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCB3cyA9IG5ldyBXZWJTb2NrZXQodXJsKTtcbiAgICAgICAgd3Mub25vcGVuID0gKCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5vbkNvbm4oKTtcbiAgICAgICAgfTtcbiAgICAgICAgd3Mub25jbG9zZSA9IChldnQ6IENsb3NlRXZlbnQpID0+IHtcbiAgICAgICAgICAgIHRoaXMub25EaXMoZXZ0KTtcbiAgICAgICAgfTtcbiAgICAgICAgd3Mub25lcnJvciA9IGVyciA9PiB7XG4gICAgICAgICAgICB0aGlzLm9uRXJyKGVycik7XG4gICAgICAgIH07XG4gICAgICAgIHdzLm9ubWVzc2FnZSA9IG1lc3NhZ2UgPT4ge1xuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICBjb25zdCBldmVudCA9IGRlY29kZUV2ZW50KHRoaXMub3B0aW9ucy5jb2RlYyB8fCBuZXcgSnNvbkNvZGVjKCksIG1lc3NhZ2UuZGF0YSk7XG4gICAgICAgICAgICAgICAgY29uc3QgaGFuZGxlciA9IHRoaXMuaGFuZGxlcnMuZ2V0KGV2ZW50LnR5cGUpO1xuICAgICAgICAgICAgICAgIGlmIChoYW5kbGVyKSB7XG4gICAgICAgICAgICAgICAgICAgIGhhbmRsZXIoZXZlbnQucGF5bG9hZCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgICAgICAgIHRoaXMub25FcnIoZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgICAgIHRoaXMuY29ubiA9IHdzO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICBjbG9zZShjb2RlPzogbnVtYmVyLCByZWFzb24/OiBzdHJpbmcpOiBFdHBDbGllbnQge1xuICAgICAgICBpZiAodGhpcy5jb25uKSB7XG4gICAgICAgICAgICB0aGlzLmNvbm4uY2xvc2UoY29kZSwgcmVhc29uKTtcbiAgICAgICAgICAgIHRoaXMuY29ubiA9IHVuZGVmaW5lZDtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbn1cblxuZXhwb3J0IGRlZmF1bHQgRXRwQ2xpZW50O1xuIl19