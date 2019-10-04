"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _options = require("./options");

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

      var data = encodeEvent(this.options.codec, type, payload);
      this.conn.send(data);
      return Promise.resolve();
    }
  }, {
    key: "connect",
    value: function connect() {
      var _this = this;

      var url = this.url;

      if (Object.keys(this.options.params).length > 0) {
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
          var _event = decodeEvent(_this.options.codec, message.data);

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
    value: function close() {
      if (this.conn) {
        this.conn.close();
        this.conn = undefined;
      }

      return this;
    }
  }]);

  return EtpClient;
}();

var _default = EtpClient;
exports["default"] = _default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9jbGllbnQudHMiXSwibmFtZXMiOlsiYm9keVNwbGl0dGVyIiwiZW5jb2RlR2V0UGFyYW1zIiwicGFyYW1zIiwiT2JqZWN0IiwiZW50cmllcyIsIm1hcCIsImt2IiwiZW5jb2RlVVJJQ29tcG9uZW50Iiwiam9pbiIsImVuY29kZUV2ZW50IiwiY29kZWMiLCJ0eXBlIiwicGF5bG9hZCIsImRhdGEiLCJtYXJzaGFsIiwiZGVjb2RlRXZlbnQiLCJwYXJ0cyIsInNwbGl0IiwibGVuZ3RoIiwidW5kZWZpbmVkIiwidW5tYXJzaGFsIiwiRXRwQ2xpZW50IiwidXJsIiwib3B0aW9ucyIsIkhhbmRsZXJzSW1wbCIsImV2dCIsImVyciIsIm9wdHMiLCJmIiwib25Db25uIiwib25EaXMiLCJvbkVyciIsImhhbmRsZXJzIiwib24iLCJvZmYiLCJhY2tUaW1lb3V0TXMiLCJjb25uIiwicmVhZHlTdGF0ZSIsIk9QRU4iLCJQcm9taXNlIiwicmVqZWN0Iiwic2VuZCIsInJlc29sdmUiLCJrZXlzIiwid3MiLCJXZWJTb2NrZXQiLCJvbm9wZW4iLCJvbmNsb3NlIiwib25lcnJvciIsIm9ubWVzc2FnZSIsIm1lc3NhZ2UiLCJldmVudCIsImhhbmRsZXIiLCJnZXQiLCJlIiwiY2xvc2UiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7QUFBQTs7QUFFQTs7Ozs7Ozs7Ozs7Ozs7QUFFQSxJQUFNQSxZQUFZLEdBQUcsSUFBckI7O0FBRUEsU0FBU0MsZUFBVCxDQUF5QkMsTUFBekIsRUFBaUQ7QUFDN0MsU0FBT0MsTUFBTSxDQUFDQyxPQUFQLENBQWVGLE1BQWYsRUFBdUJHLEdBQXZCLENBQTJCLFVBQUFDLEVBQUU7QUFBQSxXQUFJQSxFQUFFLENBQUNELEdBQUgsQ0FBT0Usa0JBQVAsRUFBMkJDLElBQTNCLENBQWdDLEdBQWhDLENBQUo7QUFBQSxHQUE3QixFQUF1RUEsSUFBdkUsQ0FBNEUsR0FBNUUsQ0FBUDtBQUNIOztBQUVELFNBQVNDLFdBQVQsQ0FBcUJDLEtBQXJCLEVBQW1D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QUFLUixJQUFULEVBQWU7QUFDWCxhQUFLQSxJQUFMLENBQVVtQixLQUFWO0FBQ0EsYUFBS25CLElBQUwsR0FBWWpCLFNBQVo7QUFDSDs7QUFDRCxhQUFPLElBQVA7QUFDSDs7Ozs7O2VBSVVFLFMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge2RlZmF1bHRPcHRpb25zLCBPcHRpb25zfSBmcm9tIFwiLi9vcHRpb25zXCI7XG5pbXBvcnQge0NvZGVjfSBmcm9tIFwiLi9jb2RlY1wiO1xuaW1wb3J0IHtIYW5kbGVyc0ltcGwsIEhhbmRsZXJzfSBmcm9tIFwiLi9oYW5kbGVyc1wiO1xuXG5jb25zdCBib2R5U3BsaXR0ZXIgPSAnfHwnO1xuXG5mdW5jdGlvbiBlbmNvZGVHZXRQYXJhbXMocGFyYW1zOiBvYmplY3QpOiBzdHJpbmcge1xuICAgIHJldHVybiBPYmplY3QuZW50cmllcyhwYXJhbXMpLm1hcChrdiA9PiBrdi5tYXAoZW5jb2RlVVJJQ29tcG9uZW50KS5qb2luKFwiPVwiKSkuam9pbihcIiZcIik7XG59XG5cbmZ1bmN0aW9uIGVuY29kZUV2ZW50KGNvZGVjOiBDb2RlYywgdHlwZTogc3RyaW5nLCBwYXlsb2FkOiBhbnkpOiBzdHJpbmcge1xuICAgIGxldCBkYXRhID0gXCJcIjtcbiAgICBpZiAocGF5bG9hZCkge1xuICAgICAgICBkYXRhID0gY29kZWMubWFyc2hhbChwYXlsb2FkKTtcbiAgICB9XG4gICAgcmV0dXJuIHR5cGUgKyBib2R5U3BsaXR0ZXIgKyBkYXRhO1xufVxuXG5mdW5jdGlvbiBkZWNvZGVFdmVudChjb2RlYzogQ29kZWMsIGRhdGE6IHN0cmluZyk6IHsgdHlwZTogc3RyaW5nLCBwYXlsb2FkPzogYW55IH0ge1xuICAgIGxldCBwYXJ0cyA9IGRhdGEuc3BsaXQoYm9keVNwbGl0dGVyLCAyKTtcbiAgICBpZiAocGFydHMubGVuZ3RoIDwgMikge1xuICAgICAgICB0aHJvdyBcImludmFsaWQgbWVzc2FnZSByZWNlaXZlZC4gU3BsaXR0ZXIgfHwgZXhwZWN0ZWRcIjtcbiAgICB9XG4gICAgbGV0IHBheWxvYWQgPSB1bmRlZmluZWQ7XG4gICAgaWYgKHBhcnRzWzFdKSB7XG4gICAgICAgIHBheWxvYWQgPSBjb2RlYy51bm1hcnNoYWwocGFydHNbMV0pO1xuICAgIH1cbiAgICByZXR1cm4ge1xuICAgICAgICB0eXBlOiBwYXJ0c1swXSwgcGF5bG9hZDogcGF5bG9hZCxcbiAgICB9XG59XG5cbmNsYXNzIEV0cENsaWVudCB7XG4gICAgcHJpdmF0ZSBjb25uPzogV2ViU29ja2V0O1xuICAgIHByaXZhdGUgcmVhZG9ubHkgaGFuZGxlcnM6IEhhbmRsZXJzID0gbmV3IEhhbmRsZXJzSW1wbCgpO1xuICAgIHByaXZhdGUgcmVhZG9ubHkgdXJsOiBzdHJpbmc7XG4gICAgcHJpdmF0ZSByZWFkb25seSBvcHRpb25zOiBPcHRpb25zO1xuICAgIHByaXZhdGUgb25Db25uOiAoKSA9PiB2b2lkID0gKCkgPT4ge1xuICAgIH07XG4gICAgcHJpdmF0ZSBvbkRpczogKGV2dDogQ2xvc2VFdmVudCkgPT4gdm9pZCA9IGV2dCA9PiB7XG4gICAgfTtcbiAgICBwcml2YXRlIG9uRXJyOiAoZXJyOiBhbnkpID0+IHZvaWQgPSBlcnIgPT4ge1xuICAgIH07XG5cbiAgICBjb25zdHJ1Y3Rvcih1cmw6IHN0cmluZywgb3B0aW9ucz86IE9wdGlvbnMpIHtcbiAgICAgICAgbGV0IG9wdHMgPSBkZWZhdWx0T3B0aW9ucygpO1xuICAgICAgICBpZiAob3B0aW9ucykge1xuICAgICAgICAgICAgb3B0cyA9IHsuLi5vcHRzLCAuLi5vcHRpb25zfTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnVybCA9IHVybDtcbiAgICAgICAgdGhpcy5vcHRpb25zID0gb3B0cztcbiAgICB9XG5cbiAgICBvbkNvbm5lY3QoZjogKCkgPT4gdm9pZCk6IEV0cENsaWVudCB7XG4gICAgICAgIHRoaXMub25Db25uID0gZjtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgb25EaXNjb25uZWN0KGY6IChldmVudDogQ2xvc2VFdmVudCkgPT4gdm9pZCk6IEV0cENsaWVudCB7XG4gICAgICAgIHRoaXMub25EaXMgPSBmO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICBvbkVycm9yKGY6IChlOiBhbnkpID0+IHZvaWQpOiBFdHBDbGllbnQge1xuICAgICAgICB0aGlzLm9uRXJyID0gZjtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgb248VD4odHlwZTogc3RyaW5nLCBmOiAoZGF0YTogVCkgPT4gdm9pZCk6IEV0cENsaWVudCB7XG4gICAgICAgIHRoaXMuaGFuZGxlcnMub24odHlwZSwgZik7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIG9mZih0eXBlOiBzdHJpbmcpOiBFdHBDbGllbnQge1xuICAgICAgICB0aGlzLmhhbmRsZXJzLm9mZih0eXBlKTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgZW1pdCh0eXBlOiBzdHJpbmcsIHBheWxvYWQ6IGFueSwgYWNrVGltZW91dE1zPzogbnVtYmVyKTogUHJvbWlzZTxhbnk+IHtcbiAgICAgICAgaWYgKCF0aGlzLmNvbm4gfHwgdGhpcy5jb25uLnJlYWR5U3RhdGUgIT09IHRoaXMuY29ubi5PUEVOKSB7XG4gICAgICAgICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QoXCJjb25uZWN0aW9uIG5vdCBpbml0aWFsaXplZFwiKVxuICAgICAgICB9XG4gICAgICAgIGxldCBkYXRhID0gZW5jb2RlRXZlbnQodGhpcy5vcHRpb25zLmNvZGVjLCB0eXBlLCBwYXlsb2FkKTtcbiAgICAgICAgdGhpcy5jb25uLnNlbmQoZGF0YSk7XG4gICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoKVxuICAgIH1cblxuICAgIGNvbm5lY3QoKTogRXRwQ2xpZW50IHtcbiAgICAgICAgbGV0IHVybCA9IHRoaXMudXJsO1xuICAgICAgICBpZiAoT2JqZWN0LmtleXModGhpcy5vcHRpb25zLnBhcmFtcykubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgdXJsID0gXCI/XCIgKyBlbmNvZGVHZXRQYXJhbXModGhpcy5vcHRpb25zLnBhcmFtcyk7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3Qgd3MgPSBuZXcgV2ViU29ja2V0KHVybCk7XG4gICAgICAgIHdzLm9ub3BlbiA9ICgpID0+IHtcbiAgICAgICAgICAgIHRoaXMub25Db25uKCk7XG4gICAgICAgIH07XG4gICAgICAgIHdzLm9uY2xvc2UgPSAoZXZ0OiBDbG9zZUV2ZW50KSA9PiB7XG4gICAgICAgICAgICB0aGlzLm9uRGlzKGV2dCk7XG4gICAgICAgIH07XG4gICAgICAgIHdzLm9uZXJyb3IgPSBlcnIgPT4ge1xuICAgICAgICAgICAgdGhpcy5vbkVycihlcnIpO1xuICAgICAgICB9O1xuICAgICAgICB3cy5vbm1lc3NhZ2UgPSBtZXNzYWdlID0+IHtcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgY29uc3QgZXZlbnQgPSBkZWNvZGVFdmVudCh0aGlzLm9wdGlvbnMuY29kZWMsIG1lc3NhZ2UuZGF0YSk7XG4gICAgICAgICAgICAgICAgY29uc3QgaGFuZGxlciA9IHRoaXMuaGFuZGxlcnMuZ2V0KGV2ZW50LnR5cGUpO1xuICAgICAgICAgICAgICAgIGlmIChoYW5kbGVyKSB7XG4gICAgICAgICAgICAgICAgICAgIGhhbmRsZXIoZXZlbnQucGF5bG9hZCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgICAgICAgIHRoaXMub25FcnIoZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgICAgIHRoaXMuY29ubiA9IHdzO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICBjbG9zZSgpOiBFdHBDbGllbnQge1xuICAgICAgICBpZiAodGhpcy5jb25uKSB7XG4gICAgICAgICAgICB0aGlzLmNvbm4uY2xvc2UoKTtcbiAgICAgICAgICAgIHRoaXMuY29ubiA9IHVuZGVmaW5lZDtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbn1cblxuZXhwb3J0IGRlZmF1bHQgRXRwQ2xpZW50O1xuIl19