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

function encodeEvent(codec, type, payload) {
  var data = codec.marshal(payload);
  return data + bodySplitter + data;
}

function decodeEvent(codec, data) {
  var parts = data.split(bodySplitter, 1);

  if (parts.length < 2) {
    throw "invalid message received. Splitter || expected";
  }

  var payload = codec.unmarshal(parts[1]);
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

      var ws = new WebSocket(this.url);

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
        var event = decodeEvent(_this.options.codec, message.data);

        var handler = _this.handlers.get(event.type);

        if (handler) {
          handler(event.payload);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9pbmRleC50cyJdLCJuYW1lcyI6WyJib2R5U3BsaXR0ZXIiLCJlbmNvZGVFdmVudCIsImNvZGVjIiwidHlwZSIsInBheWxvYWQiLCJkYXRhIiwibWFyc2hhbCIsImRlY29kZUV2ZW50IiwicGFydHMiLCJzcGxpdCIsImxlbmd0aCIsInVubWFyc2hhbCIsIkV0cENsaWVudCIsInVybCIsIm9wdGlvbnMiLCJIYW5kbGVyc0ltcGwiLCJldnQiLCJlcnIiLCJvcHRzIiwiZiIsIm9uQ29ubiIsIm9uRGlzIiwib25FcnIiLCJoYW5kbGVycyIsIm9uIiwib2ZmIiwiYWNrVGltZW91dE1zIiwiY29ubiIsInJlYWR5U3RhdGUiLCJPUEVOIiwiUHJvbWlzZSIsInJlamVjdCIsInNlbmQiLCJyZXNvbHZlIiwid3MiLCJXZWJTb2NrZXQiLCJvbm9wZW4iLCJvbmNsb3NlIiwib25lcnJvciIsIm9ubWVzc2FnZSIsIm1lc3NhZ2UiLCJldmVudCIsImhhbmRsZXIiLCJnZXQiLCJjbG9zZSIsInVuZGVmaW5lZCJdLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUFBOztBQUVBOzs7Ozs7Ozs7Ozs7OztBQUVBLElBQU1BLFlBQVksR0FBRyxJQUFyQjs7QUFFQSxTQUFTQyxXQUFULENBQXFCQyxLQUFyQixFQUFtQ0MsSUFBbkMsRUFBaURDLE9BQWpELEVBQXVFO0FBQ25FLE1BQU1DLElBQUksR0FBR0gsS0FBSyxDQUFDSSxPQUFOLENBQWNGLE9BQWQsQ0FBYjtBQUNBLFNBQU9DLElBQUksR0FBR0wsWUFBUCxHQUFzQkssSUFBN0I7QUFDSDs7QUFFRCxTQUFTRSxXQUFULENBQXFCTCxLQUFyQixFQUFtQ0csSUFBbkMsRUFBaUY7QUFDN0UsTUFBSUcsS0FBSyxHQUFHSCxJQUFJLENBQUNJLEtBQUwsQ0FBV1QsWUFBWCxFQUF5QixDQUF6QixDQUFaOztBQUNBLE1BQUlRLEtBQUssQ0FBQ0UsTUFBTixHQUFlLENBQW5CLEVBQXNCO0FBQ2xCLFVBQU0sZ0RBQU47QUFDSDs7QUFDRCxN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QUssQ0FBQ3RDLElBQXhCLENBQWhCOztBQUNBLFlBQUl1QyxPQUFKLEVBQWE7QUFDVEEsVUFBQUEsT0FBTyxDQUFDRCxLQUFLLENBQUNyQyxPQUFQLENBQVA7QUFDSDtBQUNKLE9BTkQ7O0FBT0EsV0FBS3VCLElBQUwsR0FBWU8sRUFBWjtBQUNBLGFBQU8sSUFBUDtBQUNIOzs7NEJBRWtCO0FBQ2YsVUFBSSxLQUFLUCxJQUFULEVBQWU7QUFDWCxhQUFLQSxJQUFMLENBQVVpQixLQUFWO0FBQ0EsYUFBS2pCLElBQUwsR0FBWWtCLFNBQVo7QUFDSDs7QUFDRCxhQUFPLElBQVA7QUFDSDs7Ozs7O2VBSVVqQyxTIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtkZWZhdWx0T3B0aW9ucywgT3B0aW9uc30gZnJvbSBcIi4vb3B0aW9uc1wiO1xuaW1wb3J0IHtDb2RlY30gZnJvbSBcIi4vY29kZWNcIjtcbmltcG9ydCB7SGFuZGxlcnNJbXBsLCBIYW5kbGVyc30gZnJvbSBcIi4vaGFuZGxlcnNcIjtcblxuY29uc3QgYm9keVNwbGl0dGVyID0gJ3x8JztcblxuZnVuY3Rpb24gZW5jb2RlRXZlbnQoY29kZWM6IENvZGVjLCB0eXBlOiBzdHJpbmcsIHBheWxvYWQ6IGFueSk6IHN0cmluZyB7XG4gICAgY29uc3QgZGF0YSA9IGNvZGVjLm1hcnNoYWwocGF5bG9hZCk7XG4gICAgcmV0dXJuIGRhdGEgKyBib2R5U3BsaXR0ZXIgKyBkYXRhO1xufVxuXG5mdW5jdGlvbiBkZWNvZGVFdmVudChjb2RlYzogQ29kZWMsIGRhdGE6IHN0cmluZyk6IHsgdHlwZTogc3RyaW5nLCBwYXlsb2FkOiBhbnkgfSB7XG4gICAgbGV0IHBhcnRzID0gZGF0YS5zcGxpdChib2R5U3BsaXR0ZXIsIDEpO1xuICAgIGlmIChwYXJ0cy5sZW5ndGggPCAyKSB7XG4gICAgICAgIHRocm93IFwiaW52YWxpZCBtZXNzYWdlIHJlY2VpdmVkLiBTcGxpdHRlciB8fCBleHBlY3RlZFwiO1xuICAgIH1cbiAgICBjb25zdCBwYXlsb2FkID0gY29kZWMudW5tYXJzaGFsKHBhcnRzWzFdKTtcbiAgICByZXR1cm4ge1xuICAgICAgICB0eXBlOiBwYXJ0c1swXSwgcGF5bG9hZDogcGF5bG9hZCxcbiAgICB9XG59XG5cbmNsYXNzIEV0cENsaWVudCB7XG4gICAgcHJpdmF0ZSBjb25uPzogV2ViU29ja2V0O1xuICAgIHByaXZhdGUgcmVhZG9ubHkgaGFuZGxlcnM6IEhhbmRsZXJzID0gbmV3IEhhbmRsZXJzSW1wbCgpO1xuICAgIHByaXZhdGUgcmVhZG9ubHkgdXJsOiBzdHJpbmc7XG4gICAgcHJpdmF0ZSByZWFkb25seSBvcHRpb25zOiBPcHRpb25zO1xuICAgIHByaXZhdGUgb25Db25uOiAoKSA9PiB2b2lkID0gKCkgPT4ge1xuICAgIH07XG4gICAgcHJpdmF0ZSBvbkRpczogKGV2dDogQ2xvc2VFdmVudCkgPT4gdm9pZCA9IGV2dCA9PiB7XG4gICAgfTtcbiAgICBwcml2YXRlIG9uRXJyOiAoZXJyOiBhbnkpID0+IHZvaWQgPSBlcnIgPT4ge1xuICAgIH07XG5cbiAgICBjb25zdHJ1Y3Rvcih1cmw6IHN0cmluZywgb3B0aW9ucz86IE9wdGlvbnMpIHtcbiAgICAgICAgbGV0IG9wdHMgPSBkZWZhdWx0T3B0aW9ucygpO1xuICAgICAgICBpZiAob3B0aW9ucykge1xuICAgICAgICAgICAgb3B0cyA9IHsuLi5vcHRzLCAuLi5vcHRpb25zfTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnVybCA9IHVybDtcbiAgICAgICAgdGhpcy5vcHRpb25zID0gb3B0cztcbiAgICB9XG5cbiAgICBvbkNvbm5lY3QoZjogKCkgPT4gdm9pZCk6IEV0cENsaWVudCB7XG4gICAgICAgIHRoaXMub25Db25uID0gZjtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgb25EaXNjb25uZWN0KGY6IChldmVudDogQ2xvc2VFdmVudCkgPT4gdm9pZCk6IEV0cENsaWVudCB7XG4gICAgICAgIHRoaXMub25EaXMgPSBmO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICBvbkVycm9yKGY6IChlOiBhbnkpID0+IHZvaWQpOiBFdHBDbGllbnQge1xuICAgICAgICB0aGlzLm9uRXJyID0gZjtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgb248VD4odHlwZTogc3RyaW5nLCBmOiAoZGF0YTogVCkgPT4gdm9pZCk6IEV0cENsaWVudCB7XG4gICAgICAgIHRoaXMuaGFuZGxlcnMub24odHlwZSwgZik7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIG9mZih0eXBlOiBzdHJpbmcpOiBFdHBDbGllbnQge1xuICAgICAgICB0aGlzLmhhbmRsZXJzLm9mZih0eXBlKTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgZW1pdCh0eXBlOiBzdHJpbmcsIHBheWxvYWQ6IGFueSwgYWNrVGltZW91dE1zPzogbnVtYmVyKTogUHJvbWlzZTxhbnk+IHtcbiAgICAgICAgaWYgKCF0aGlzLmNvbm4gfHwgdGhpcy5jb25uLnJlYWR5U3RhdGUgIT09IHRoaXMuY29ubi5PUEVOKSB7XG4gICAgICAgICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QoXCJjb25uZWN0aW9uIG5vdCBpbml0aWFsaXplZFwiKVxuICAgICAgICB9XG4gICAgICAgIGxldCBkYXRhID0gZW5jb2RlRXZlbnQodGhpcy5vcHRpb25zLmNvZGVjLCB0eXBlLCBwYXlsb2FkKTtcbiAgICAgICAgdGhpcy5jb25uLnNlbmQoZGF0YSk7XG4gICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoKVxuICAgIH1cblxuICAgIGNvbm5lY3QoKTogRXRwQ2xpZW50IHtcbiAgICAgICAgY29uc3Qgd3MgPSBuZXcgV2ViU29ja2V0KHRoaXMudXJsKTtcbiAgICAgICAgd3Mub25vcGVuID0gKCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5vbkNvbm4oKTtcbiAgICAgICAgfTtcbiAgICAgICAgd3Mub25jbG9zZSA9IChldnQ6IENsb3NlRXZlbnQpID0+IHtcbiAgICAgICAgICAgIHRoaXMub25EaXMoZXZ0KTtcbiAgICAgICAgfTtcbiAgICAgICAgd3Mub25lcnJvciA9IGVyciA9PiB7XG4gICAgICAgICAgICB0aGlzLm9uRXJyKGVycik7XG4gICAgICAgIH07XG4gICAgICAgIHdzLm9ubWVzc2FnZSA9IG1lc3NhZ2UgPT4ge1xuICAgICAgICAgICAgY29uc3QgZXZlbnQgPSBkZWNvZGVFdmVudCh0aGlzLm9wdGlvbnMuY29kZWMsIG1lc3NhZ2UuZGF0YSk7XG4gICAgICAgICAgICBjb25zdCBoYW5kbGVyID0gdGhpcy5oYW5kbGVycy5nZXQoZXZlbnQudHlwZSk7XG4gICAgICAgICAgICBpZiAoaGFuZGxlcikge1xuICAgICAgICAgICAgICAgIGhhbmRsZXIoZXZlbnQucGF5bG9hZCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgICAgIHRoaXMuY29ubiA9IHdzO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICBjbG9zZSgpOiBFdHBDbGllbnQge1xuICAgICAgICBpZiAodGhpcy5jb25uKSB7XG4gICAgICAgICAgICB0aGlzLmNvbm4uY2xvc2UoKTtcbiAgICAgICAgICAgIHRoaXMuY29ubiA9IHVuZGVmaW5lZDtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbn1cblxuZXhwb3J0IGRlZmF1bHQgRXRwQ2xpZW50O1xuIl19