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
    var currIndex = void 0;

    if (i !== limit) {
      currIndex = value.indexOf(bodySplitter, prevIndex);

      if (currIndex === -1) {
        return res;
      }
    } else {
      currIndex = value.length;
    }

    res.push(value.substring(prevIndex, currIndex));
    prevIndex = currIndex + bodySplitter.length;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9jbGllbnQudHMiXSwibmFtZXMiOlsiYm9keVNwbGl0dGVyIiwiZW5jb2RlR2V0UGFyYW1zIiwicGFyYW1zIiwiT2JqZWN0IiwiZW50cmllcyIsIm1hcCIsImt2IiwiZW5jb2RlVVJJQ29tcG9uZW50Iiwiam9pbiIsImVuY29kZUV2ZW50IiwiY29kZWMiLCJ0eXBlIiwicGF5bG9hZCIsImRhdGEiLCJtYXJzaGFsIiwic3BsaXQiLCJ2YWx1ZSIsImxpbWl0IiwicmVzIiwicHJldkluZGV4IiwiaSIsImN1cnJJbmRleCIsImluZGV4T2YiLCJsZW5ndGgiLCJwdXNoIiwic3Vic3RyaW5nIiwiZGVjb2RlRXZlbnQiLCJwYXJ0cyIsInVuZGVmaW5lZCIsInVubWFyc2hhbCIsIkV0cENsaWVudCIsInVybCIsIm9wdGlvbnMiLCJIYW5kbGVyc0ltcGwiLCJldnQiLCJlcnIiLCJvcHRzIiwiZiIsIm9uQ29ubiIsIm9uRGlzIiwib25FcnIiLCJoYW5kbGVycyIsIm9uIiwib2ZmIiwiYWNrVGltZW91dE1zIiwiY29ubiIsInJlYWR5U3RhdGUiLCJPUEVOIiwiUHJvbWlzZSIsInJlamVjdCIsIkpzb25Db2RlYyIsInNlbmQiLCJyZXNvbHZlIiwia2V5cyIsIndzIiwiV2ViU29ja2V0Iiwib25vcGVuIiwib25jbG9zZSIsIm9uZXJyb3IiLCJvbm1lc3NhZ2UiLCJtZXNzYWdlIiwiZXZlbnQiLCJoYW5kbGVyIiwiZ2V0IiwiZSIsImNvZGUiLCJyZWFzb24iLCJjbG9zZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUFBOztBQUNBOztBQUNBOzs7Ozs7Ozs7Ozs7OztBQUVBLElBQU1BLFlBQVksR0FBRyxJQUFyQjs7QUFFQSxTQUFTQyxlQUFULENBQXlCQyxNQUF6QixFQUFpRDtBQUM3QyxTQUFPQyxNQUFNLENBQUNDLE9BQVAsQ0FBZUYsTUFBZixFQUF1QkcsR0FBdkIsQ0FBMkIsVUFBQUMsRUFBRTtBQUFBLFdBQUlBLEVBQUUsQ0FBQ0QsR0FBSCxDQUFPRSxrQkFB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VXNCLEtBQVYsQ0FBZ0JGLElBQWhCLEVBQXNCQyxNQUF0QjtBQUNBLGFBQUtyQixJQUFMLEdBQVlqQixTQUFaO0FBQ0g7O0FBQ0QsYUFBTyxJQUFQO0FBQ0g7Ozs7OztlQUlVRSxTIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtkZWZhdWx0T3B0aW9ucywgT3B0aW9uc30gZnJvbSBcIi4vb3B0aW9uc1wiO1xuaW1wb3J0IHtDb2RlYywgSnNvbkNvZGVjfSBmcm9tIFwiLi9jb2RlY1wiO1xuaW1wb3J0IHtIYW5kbGVyc0ltcGwsIEhhbmRsZXJzfSBmcm9tIFwiLi9oYW5kbGVyc1wiO1xuXG5jb25zdCBib2R5U3BsaXR0ZXIgPSAnfHwnO1xuXG5mdW5jdGlvbiBlbmNvZGVHZXRQYXJhbXMocGFyYW1zOiBvYmplY3QpOiBzdHJpbmcge1xuICAgIHJldHVybiBPYmplY3QuZW50cmllcyhwYXJhbXMpLm1hcChrdiA9PiBrdi5tYXAoZW5jb2RlVVJJQ29tcG9uZW50KS5qb2luKFwiPVwiKSkuam9pbihcIiZcIik7XG59XG5cbmZ1bmN0aW9uIGVuY29kZUV2ZW50KGNvZGVjOiBDb2RlYywgdHlwZTogc3RyaW5nLCBwYXlsb2FkOiBhbnkpOiBzdHJpbmcge1xuICAgIGxldCBkYXRhID0gXCJcIjtcbiAgICBpZiAocGF5bG9hZCkge1xuICAgICAgICBkYXRhID0gY29kZWMubWFyc2hhbChwYXlsb2FkKTtcbiAgICB9XG4gICAgcmV0dXJuIGAke3R5cGV9JHtib2R5U3BsaXR0ZXJ9MCR7Ym9keVNwbGl0dGVyfSR7ZGF0YX1gO1xufVxuXG5mdW5jdGlvbiBzcGxpdCh2YWx1ZTogc3RyaW5nLCBib2R5U3BsaXR0ZXI6IHN0cmluZywgbGltaXQ6IG51bWJlcikgOiBzdHJpbmdbXSB7XG4gICAgbGV0IHJlcyA9IFtdXG4gICAgbGV0IHByZXZJbmRleCA9IDBcblxuICAgIGZvciAobGV0IGkgPSAxOyBpIDwgbGltaXQrMTsgaSsrKSB7XG4gICAgICAgIGxldCBjdXJySW5kZXggOiBudW1iZXJcblxuICAgICAgICBpZiAoaSAhPT0gbGltaXQpIHtcbiAgICAgICAgICAgIGN1cnJJbmRleCA9IHZhbHVlLmluZGV4T2YoYm9keVNwbGl0dGVyLCBwcmV2SW5kZXgpXG4gICAgICAgICAgICBpZiAoY3VyckluZGV4ID09PSAtMSkge1xuICAgICAgICAgICAgICAgIHJldHVybiByZXNcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGN1cnJJbmRleCA9IHZhbHVlLmxlbmd0aFxuICAgICAgICB9XG5cbiAgICAgICAgcmVzLnB1c2godmFsdWUuc3Vic3RyaW5nKHByZXZJbmRleCwgY3VyckluZGV4KSlcbiAgICAgICAgcHJldkluZGV4ID0gY3VyckluZGV4ICsgYm9keVNwbGl0dGVyLmxlbmd0aFxuICAgIH1cblxuICAgIHJldHVybiByZXNcbn1cblxuZnVuY3Rpb24gZGVjb2RlRXZlbnQoY29kZWM6IENvZGVjLCBkYXRhOiBzdHJpbmcpOiB7IHR5cGU6IHN0cmluZywgcGF5bG9hZD86IGFueSB9IHtcbiAgICBsZXQgcGFydHMgPSBzcGxpdChkYXRhLCBib2R5U3BsaXR0ZXIsIDMpO1xuICAgIGlmIChwYXJ0cy5sZW5ndGggPCAzKSB7XG4gICAgICAgIHRocm93IFwiaW52YWxpZCBtZXNzYWdlIHJlY2VpdmVkLiBTcGxpdHRlciB8fCBleHBlY3RlZFwiO1xuICAgIH1cbiAgICBsZXQgcGF5bG9hZCA9IHVuZGVmaW5lZDtcbiAgICBpZiAocGFydHNbMl0pIHtcbiAgICAgICAgcGF5bG9hZCA9IGNvZGVjLnVubWFyc2hhbChwYXJ0c1syXSk7XG4gICAgfVxuICAgIHJldHVybiB7XG4gICAgICAgIHR5cGU6IHBhcnRzWzBdLCBwYXlsb2FkOiBwYXlsb2FkLFxuICAgIH1cbn1cblxuY2xhc3MgRXRwQ2xpZW50IHtcbiAgICBwcml2YXRlIGNvbm4/OiBXZWJTb2NrZXQ7XG4gICAgcHJpdmF0ZSByZWFkb25seSBoYW5kbGVyczogSGFuZGxlcnMgPSBuZXcgSGFuZGxlcnNJbXBsKCk7XG4gICAgcHJpdmF0ZSByZWFkb25seSB1cmw6IHN0cmluZztcbiAgICBwcml2YXRlIHJlYWRvbmx5IG9wdGlvbnM6IE9wdGlvbnM7XG4gICAgcHJpdmF0ZSBvbkNvbm46ICgpID0+IHZvaWQgPSAoKSA9PiB7XG4gICAgfTtcbiAgICBwcml2YXRlIG9uRGlzOiAoZXZ0OiBDbG9zZUV2ZW50KSA9PiB2b2lkID0gZXZ0ID0+IHtcbiAgICB9O1xuICAgIHByaXZhdGUgb25FcnI6IChlcnI6IGFueSkgPT4gdm9pZCA9IGVyciA9PiB7XG4gICAgfTtcblxuICAgIGNvbnN0cnVjdG9yKHVybDogc3RyaW5nLCBvcHRpb25zPzogT3B0aW9ucykge1xuICAgICAgICBsZXQgb3B0cyA9IGRlZmF1bHRPcHRpb25zKCk7XG4gICAgICAgIGlmIChvcHRpb25zKSB7XG4gICAgICAgICAgICBvcHRzID0gey4uLm9wdHMsIC4uLm9wdGlvbnN9O1xuICAgICAgICB9XG4gICAgICAgIHRoaXMudXJsID0gdXJsO1xuICAgICAgICB0aGlzLm9wdGlvbnMgPSBvcHRzO1xuICAgIH1cblxuICAgIG9uQ29ubmVjdChmOiAoKSA9PiB2b2lkKTogRXRwQ2xpZW50IHtcbiAgICAgICAgdGhpcy5vbkNvbm4gPSBmO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICBvbkRpc2Nvbm5lY3QoZjogKGV2ZW50OiBDbG9zZUV2ZW50KSA9PiB2b2lkKTogRXRwQ2xpZW50IHtcbiAgICAgICAgdGhpcy5vbkRpcyA9IGY7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIG9uRXJyb3IoZjogKGU6IGFueSkgPT4gdm9pZCk6IEV0cENsaWVudCB7XG4gICAgICAgIHRoaXMub25FcnIgPSBmO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICBvbjxUPih0eXBlOiBzdHJpbmcsIGY6IChkYXRhOiBUKSA9PiB2b2lkKTogRXRwQ2xpZW50IHtcbiAgICAgICAgdGhpcy5oYW5kbGVycy5vbih0eXBlLCBmKTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgb2ZmKHR5cGU6IHN0cmluZyk6IEV0cENsaWVudCB7XG4gICAgICAgIHRoaXMuaGFuZGxlcnMub2ZmKHR5cGUpO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICBlbWl0KHR5cGU6IHN0cmluZywgcGF5bG9hZDogYW55LCBhY2tUaW1lb3V0TXM/OiBudW1iZXIpOiBQcm9taXNlPGFueT4ge1xuICAgICAgICBpZiAoIXRoaXMuY29ubiB8fCB0aGlzLmNvbm4ucmVhZHlTdGF0ZSAhPT0gdGhpcy5jb25uLk9QRU4pIHtcbiAgICAgICAgICAgIHJldHVybiBQcm9taXNlLnJlamVjdChcImNvbm5lY3Rpb24gbm90IGluaXRpYWxpemVkXCIpXG4gICAgICAgIH1cbiAgICAgICAgbGV0IGRhdGEgPSBlbmNvZGVFdmVudCh0aGlzLm9wdGlvbnMuY29kZWMgfHwgbmV3IEpzb25Db2RlYygpLCB0eXBlLCBwYXlsb2FkKTtcbiAgICAgICAgdGhpcy5jb25uLnNlbmQoZGF0YSk7XG4gICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoKVxuICAgIH1cblxuICAgIGNvbm5lY3QoKTogRXRwQ2xpZW50IHtcbiAgICAgICAgbGV0IHVybCA9IHRoaXMudXJsO1xuICAgICAgICBpZiAodGhpcy5vcHRpb25zLnBhcmFtcyAmJiBPYmplY3Qua2V5cyh0aGlzLm9wdGlvbnMucGFyYW1zKS5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICB1cmwgPSB1cmwgKyBcIj9cIiArIGVuY29kZUdldFBhcmFtcyh0aGlzLm9wdGlvbnMucGFyYW1zKTtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCB3cyA9IG5ldyBXZWJTb2NrZXQodXJsKTtcbiAgICAgICAgd3Mub25vcGVuID0gKCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5vbkNvbm4oKTtcbiAgICAgICAgfTtcbiAgICAgICAgd3Mub25jbG9zZSA9IChldnQ6IENsb3NlRXZlbnQpID0+IHtcbiAgICAgICAgICAgIHRoaXMub25EaXMoZXZ0KTtcbiAgICAgICAgfTtcbiAgICAgICAgd3Mub25lcnJvciA9IGVyciA9PiB7XG4gICAgICAgICAgICB0aGlzLm9uRXJyKGVycik7XG4gICAgICAgIH07XG4gICAgICAgIHdzLm9ubWVzc2FnZSA9IG1lc3NhZ2UgPT4ge1xuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICBjb25zdCBldmVudCA9IGRlY29kZUV2ZW50KHRoaXMub3B0aW9ucy5jb2RlYyB8fCBuZXcgSnNvbkNvZGVjKCksIG1lc3NhZ2UuZGF0YSk7XG4gICAgICAgICAgICAgICAgY29uc3QgaGFuZGxlciA9IHRoaXMuaGFuZGxlcnMuZ2V0KGV2ZW50LnR5cGUpO1xuICAgICAgICAgICAgICAgIGlmIChoYW5kbGVyKSB7XG4gICAgICAgICAgICAgICAgICAgIGhhbmRsZXIoZXZlbnQucGF5bG9hZCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgICAgICAgIHRoaXMub25FcnIoZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgICAgIHRoaXMuY29ubiA9IHdzO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICBjbG9zZShjb2RlPzogbnVtYmVyLCByZWFzb24/OiBzdHJpbmcpOiBFdHBDbGllbnQge1xuICAgICAgICBpZiAodGhpcy5jb25uKSB7XG4gICAgICAgICAgICB0aGlzLmNvbm4uY2xvc2UoY29kZSwgcmVhc29uKTtcbiAgICAgICAgICAgIHRoaXMuY29ubiA9IHVuZGVmaW5lZDtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbn1cblxuZXhwb3J0IGRlZmF1bHQgRXRwQ2xpZW50O1xuIl19