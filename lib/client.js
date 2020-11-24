"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _options = require("./options");

var _codec = require("./codec");

var _handlers = require("./handlers");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

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

function split(value, bodySplitter, limit) {
  var res = [];
  var prevIndex = 0;

  for (var i = 1; i < limit + 1; i++) {
    var currIndex = value.indexOf(bodySplitter, prevIndex);
    res.push(value.substring(prevIndex, i != limit ? currIndex : value.length));
    prevIndex = currIndex + 2;
  }

  return res;
}

function decodeEvent(codec, data) {
  var parts = split(data, bodySplitter, 3);

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

var EtpClient = /*#__PURE__*/function () {
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
      opts = _objectSpread(_objectSpread({}, opts), options);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9jbGllbnQudHMiXSwibmFtZXMiOlsiYm9keVNwbGl0dGVyIiwiZW5jb2RlR2V0UGFyYW1zIiwicGFyYW1zIiwiT2JqZWN0IiwiZW50cmllcyIsIm1hcCIsImt2IiwiZW5jb2RlVVJJQ29tcG9uZW50Iiwiam9pbiIsImVuY29kZUV2ZW50IiwiY29kZWMiLCJ0eXBlIiwicGF5bG9hZCIsImRhdGEiLCJtYXJzaGFsIiwic3BsaXQiLCJ2YWx1ZSIsImxpbWl0IiwicmVzIiwicHJldkluZGV4IiwiaSIsImN1cnJJbmRleCIsImluZGV4T2YiLCJwdXNoIiwic3Vic3RyaW5nIiwibGVuZ3RoIiwiZGVjb2RlRXZlbnQiLCJwYXJ0cyIsInVuZGVmaW5lZCIsInVubWFyc2hhbCIsIkV0cENsaWVudCIsInVybCIsIm9wdGlvbnMiLCJIYW5kbGVyc0ltcGwiLCJldnQiLCJlcnIiLCJvcHRzIiwiZiIsIm9uQ29ubiIsIm9uRGlzIiwib25FcnIiLCJoYW5kbGVycyIsIm9uIiwib2ZmIiwiYWNrVGltZW91dE1zIiwiY29ubiIsInJlYWR5U3RhdGUiLCJPUEVOIiwiUHJvbWlzZSIsInJlamVjdCIsIkpzb25Db2RlYyIsInNlbmQiLCJyZXNvbHZlIiwia2V5cyIsIndzIiwiV2ViU29ja2V0Iiwib25vcGVuIiwib25jbG9zZSIsIm9uZXJyb3IiLCJvbm1lc3NhZ2UiLCJtZXNzYWdlIiwiZXZlbnQiLCJoYW5kbGVyIiwiZ2V0IiwiZSIsImNvZGUiLCJyZWFzb24iLCJjbG9zZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUFBOztBQUNBOztBQUNBOzs7Ozs7Ozs7Ozs7OztBQUVBLElBQU1BLFlBQVksR0FBRyxJQUFyQjs7QUFFQSxTQUFTQyxlQUFULENBQXlCQyxNQUF6QixFQUFpRDtBQUM3QyxTQUFPQyxNQUFNLENBQUNDLE9BQVAsQ0FBZUYsTUFBZixFQUF1QkcsR0FBdkIsQ0FBMkIsVUFBQUMsRUFBRTtBQUFBLFdBQUlBLEVBQUUsQ0FBQ0QsR0FBSCxDQUFPRSxrQkFB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cHRpb25zfSBmcm9tIFwiLi9vcHRpb25zXCI7XG5pbXBvcnQge0NvZGVjLCBKc29uQ29kZWN9IGZyb20gXCIuL2NvZGVjXCI7XG5pbXBvcnQge0hhbmRsZXJzSW1wbCwgSGFuZGxlcnN9IGZyb20gXCIuL2hhbmRsZXJzXCI7XG5cbmNvbnN0IGJvZHlTcGxpdHRlciA9ICd8fCc7XG5cbmZ1bmN0aW9uIGVuY29kZUdldFBhcmFtcyhwYXJhbXM6IG9iamVjdCk6IHN0cmluZyB7XG4gICAgcmV0dXJuIE9iamVjdC5lbnRyaWVzKHBhcmFtcykubWFwKGt2ID0+IGt2Lm1hcChlbmNvZGVVUklDb21wb25lbnQpLmpvaW4oXCI9XCIpKS5qb2luKFwiJlwiKTtcbn1cblxuZnVuY3Rpb24gZW5jb2RlRXZlbnQoY29kZWM6IENvZGVjLCB0eXBlOiBzdHJpbmcsIHBheWxvYWQ6IGFueSk6IHN0cmluZyB7XG4gICAgbGV0IGRhdGEgPSBcIlwiO1xuICAgIGlmIChwYXlsb2FkKSB7XG4gICAgICAgIGRhdGEgPSBjb2RlYy5tYXJzaGFsKHBheWxvYWQpO1xuICAgIH1cbiAgICByZXR1cm4gYCR7dHlwZX0ke2JvZHlTcGxpdHRlcn0wJHtib2R5U3BsaXR0ZXJ9JHtkYXRhfWA7XG59XG5cbmZ1bmN0aW9uIHNwbGl0KHZhbHVlOiBzdHJpbmcsIGJvZHlTcGxpdHRlcjogc3RyaW5nLCBsaW1pdDogbnVtYmVyKSA6IHN0cmluZ1tdIHtcbiAgICBsZXQgcmVzID0gW11cbiAgICBsZXQgcHJldkluZGV4ID0gMFxuICAgIGZvciAobGV0IGkgPSAxOyBpIDwgbGltaXQrMTsgaSsrKSB7XG4gICAgICAgIGxldCBjdXJySW5kZXggPSB2YWx1ZS5pbmRleE9mKGJvZHlTcGxpdHRlciwgcHJldkluZGV4KVxuICAgICAgICByZXMucHVzaCh2YWx1ZS5zdWJzdHJpbmcocHJldkluZGV4LCBpICE9IGxpbWl0ID8gY3VyckluZGV4IDogdmFsdWUubGVuZ3RoKSlcbiAgICAgICAgcHJldkluZGV4ID0gY3VyckluZGV4KzJcbiAgICB9XG5cbiAgICByZXR1cm4gcmVzXG59XG5cbmZ1bmN0aW9uIGRlY29kZUV2ZW50KGNvZGVjOiBDb2RlYywgZGF0YTogc3RyaW5nKTogeyB0eXBlOiBzdHJpbmcsIHBheWxvYWQ/OiBhbnkgfSB7XG4gICAgbGV0IHBhcnRzID0gc3BsaXQoZGF0YSwgYm9keVNwbGl0dGVyLCAzKTtcbiAgICBpZiAocGFydHMubGVuZ3RoIDwgMykge1xuICAgICAgICB0aHJvdyBcImludmFsaWQgbWVzc2FnZSByZWNlaXZlZC4gU3BsaXR0ZXIgfHwgZXhwZWN0ZWRcIjtcbiAgICB9XG4gICAgbGV0IHBheWxvYWQgPSB1bmRlZmluZWQ7XG4gICAgaWYgKHBhcnRzWzJdKSB7XG4gICAgICAgIHBheWxvYWQgPSBjb2RlYy51bm1hcnNoYWwocGFydHNbMl0pO1xuICAgIH1cbiAgICByZXR1cm4ge1xuICAgICAgICB0eXBlOiBwYXJ0c1swXSwgcGF5bG9hZDogcGF5bG9hZCxcbiAgICB9XG59XG5cbmNsYXNzIEV0cENsaWVudCB7XG4gICAgcHJpdmF0ZSBjb25uPzogV2ViU29ja2V0O1xuICAgIHByaXZhdGUgcmVhZG9ubHkgaGFuZGxlcnM6IEhhbmRsZXJzID0gbmV3IEhhbmRsZXJzSW1wbCgpO1xuICAgIHByaXZhdGUgcmVhZG9ubHkgdXJsOiBzdHJpbmc7XG4gICAgcHJpdmF0ZSByZWFkb25seSBvcHRpb25zOiBPcHRpb25zO1xuICAgIHByaXZhdGUgb25Db25uOiAoKSA9PiB2b2lkID0gKCkgPT4ge1xuICAgIH07XG4gICAgcHJpdmF0ZSBvbkRpczogKGV2dDogQ2xvc2VFdmVudCkgPT4gdm9pZCA9IGV2dCA9PiB7XG4gICAgfTtcbiAgICBwcml2YXRlIG9uRXJyOiAoZXJyOiBhbnkpID0+IHZvaWQgPSBlcnIgPT4ge1xuICAgIH07XG5cbiAgICBjb25zdHJ1Y3Rvcih1cmw6IHN0cmluZywgb3B0aW9ucz86IE9wdGlvbnMpIHtcbiAgICAgICAgbGV0IG9wdHMgPSBkZWZhdWx0T3B0aW9ucygpO1xuICAgICAgICBpZiAob3B0aW9ucykge1xuICAgICAgICAgICAgb3B0cyA9IHsuLi5vcHRzLCAuLi5vcHRpb25zfTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnVybCA9IHVybDtcbiAgICAgICAgdGhpcy5vcHRpb25zID0gb3B0cztcbiAgICB9XG5cbiAgICBvbkNvbm5lY3QoZjogKCkgPT4gdm9pZCk6IEV0cENsaWVudCB7XG4gICAgICAgIHRoaXMub25Db25uID0gZjtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgb25EaXNjb25uZWN0KGY6IChldmVudDogQ2xvc2VFdmVudCkgPT4gdm9pZCk6IEV0cENsaWVudCB7XG4gICAgICAgIHRoaXMub25EaXMgPSBmO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICBvbkVycm9yKGY6IChlOiBhbnkpID0+IHZvaWQpOiBFdHBDbGllbnQge1xuICAgICAgICB0aGlzLm9uRXJyID0gZjtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgb248VD4odHlwZTogc3RyaW5nLCBmOiAoZGF0YTogVCkgPT4gdm9pZCk6IEV0cENsaWVudCB7XG4gICAgICAgIHRoaXMuaGFuZGxlcnMub24odHlwZSwgZik7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIG9mZih0eXBlOiBzdHJpbmcpOiBFdHBDbGllbnQge1xuICAgICAgICB0aGlzLmhhbmRsZXJzLm9mZih0eXBlKTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgZW1pdCh0eXBlOiBzdHJpbmcsIHBheWxvYWQ6IGFueSwgYWNrVGltZW91dE1zPzogbnVtYmVyKTogUHJvbWlzZTxhbnk+IHtcbiAgICAgICAgaWYgKCF0aGlzLmNvbm4gfHwgdGhpcy5jb25uLnJlYWR5U3RhdGUgIT09IHRoaXMuY29ubi5PUEVOKSB7XG4gICAgICAgICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QoXCJjb25uZWN0aW9uIG5vdCBpbml0aWFsaXplZFwiKVxuICAgICAgICB9XG4gICAgICAgIGxldCBkYXRhID0gZW5jb2RlRXZlbnQodGhpcy5vcHRpb25zLmNvZGVjIHx8IG5ldyBKc29uQ29kZWMoKSwgdHlwZSwgcGF5bG9hZCk7XG4gICAgICAgIHRoaXMuY29ubi5zZW5kKGRhdGEpO1xuICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKClcbiAgICB9XG5cbiAgICBjb25uZWN0KCk6IEV0cENsaWVudCB7XG4gICAgICAgIGxldCB1cmwgPSB0aGlzLnVybDtcbiAgICAgICAgaWYgKHRoaXMub3B0aW9ucy5wYXJhbXMgJiYgT2JqZWN0LmtleXModGhpcy5vcHRpb25zLnBhcmFtcykubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgdXJsID0gdXJsICsgXCI/XCIgKyBlbmNvZGVHZXRQYXJhbXModGhpcy5vcHRpb25zLnBhcmFtcyk7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3Qgd3MgPSBuZXcgV2ViU29ja2V0KHVybCk7XG4gICAgICAgIHdzLm9ub3BlbiA9ICgpID0+IHtcbiAgICAgICAgICAgIHRoaXMub25Db25uKCk7XG4gICAgICAgIH07XG4gICAgICAgIHdzLm9uY2xvc2UgPSAoZXZ0OiBDbG9zZUV2ZW50KSA9PiB7XG4gICAgICAgICAgICB0aGlzLm9uRGlzKGV2dCk7XG4gICAgICAgIH07XG4gICAgICAgIHdzLm9uZXJyb3IgPSBlcnIgPT4ge1xuICAgICAgICAgICAgdGhpcy5vbkVycihlcnIpO1xuICAgICAgICB9O1xuICAgICAgICB3cy5vbm1lc3NhZ2UgPSBtZXNzYWdlID0+IHtcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgY29uc3QgZXZlbnQgPSBkZWNvZGVFdmVudCh0aGlzLm9wdGlvbnMuY29kZWMgfHwgbmV3IEpzb25Db2RlYygpLCBtZXNzYWdlLmRhdGEpO1xuICAgICAgICAgICAgICAgIGNvbnN0IGhhbmRsZXIgPSB0aGlzLmhhbmRsZXJzLmdldChldmVudC50eXBlKTtcbiAgICAgICAgICAgICAgICBpZiAoaGFuZGxlcikge1xuICAgICAgICAgICAgICAgICAgICBoYW5kbGVyKGV2ZW50LnBheWxvYWQpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgICAgICB0aGlzLm9uRXJyKGUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgICAgICB0aGlzLmNvbm4gPSB3cztcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgY2xvc2UoY29kZT86IG51bWJlciwgcmVhc29uPzogc3RyaW5nKTogRXRwQ2xpZW50IHtcbiAgICAgICAgaWYgKHRoaXMuY29ubikge1xuICAgICAgICAgICAgdGhpcy5jb25uLmNsb3NlKGNvZGUsIHJlYXNvbik7XG4gICAgICAgICAgICB0aGlzLmNvbm4gPSB1bmRlZmluZWQ7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG59XG5cbmV4cG9ydCBkZWZhdWx0IEV0cENsaWVudDtcbiJdfQ==