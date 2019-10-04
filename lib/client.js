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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9jbGllbnQudHMiXSwibmFtZXMiOlsiYm9keVNwbGl0dGVyIiwiZW5jb2RlR2V0UGFyYW1zIiwicGFyYW1zIiwiT2JqZWN0IiwiZW50cmllcyIsIm1hcCIsImt2IiwiZW5jb2RlVVJJQ29tcG9uZW50Iiwiam9pbiIsImVuY29kZUV2ZW50IiwiY29kZWMiLCJ0eXBlIiwicGF5bG9hZCIsImRhdGEiLCJtYXJzaGFsIiwiZGVjb2RlRXZlbnQiLCJwYXJ0cyIsInNwbGl0IiwibGVuZ3RoIiwidW5kZWZpbmVkIiwidW5tYXJzaGFsIiwiRXRwQ2xpZW50IiwidXJsIiwib3B0aW9ucyIsIkhhbmRsZXJzSW1wbCIsImV2dCIsImVyciIsIm9wdHMiLCJmIiwib25Db25uIiwib25EaXMiLCJvbkVyciIsImhhbmRsZXJzIiwib24iLCJvZmYiLCJhY2tUaW1lb3V0TXMiLCJjb25uIiwicmVhZHlTdGF0ZSIsIk9QRU4iLCJQcm9taXNlIiwicmVqZWN0IiwiSnNvbkNvZGVjIiwic2VuZCIsInJlc29sdmUiLCJrZXlzIiwid3MiLCJXZWJTb2NrZXQiLCJvbm9wZW4iLCJvbmNsb3NlIiwib25lcnJvciIsIm9ubWVzc2FnZSIsIm1lc3NhZ2UiLCJldmVudCIsImhhbmRsZXIiLCJnZXQiLCJlIiwiY29kZSIsInJlYXNvbiIsImNsb3NlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBQUE7O0FBQ0E7O0FBQ0E7Ozs7Ozs7Ozs7Ozs7O0FBRUEsSUFBTUEsWUFBWSxHQUFHLElBQXJCOztBQUVBLFNBQVNDLGVBQVQsQ0FBeUJDLE1BQXpCLEVBQWlEO0FBQzdDLFNBQU9DLE1BQU0sQ0FBQ0MsT0FBUCxDQUFlRixNQUFmLEVBQXVCRyxHQUF2QixDQUEyQixVQUFBQyxFQUFFO0FBQUEsV0FBSUEsRUFBRSxDQUFDRCxHQUFILENBQU9FLGtCQUFQLEVBQTJCQyxJQUEzQixDQUFnQyxHQUFoQyxDQUFKO0FBQUEsR0FBN0IsRUFBdUVBLElBQXZFLENBQTRFLEdBQTVFLENBQVA7QUFDSDs7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LEVBQVU7QUFDUixVQUFBLEtBQUksQ0FBQ3hCLEtBQUwsQ0FBV3dCLENBQVg7QUFDSDtBQUNKLE9BVkQ7O0FBV0EsV0FBS25CLElBQUwsR0FBWVMsRUFBWjtBQUNBLGFBQU8sSUFBUDtBQUNIOzs7MEJBRUtXLEksRUFBZUMsTSxFQUE0QjtBQUM3QyxVQUFJLEtBQUtyQixJQUFULEVBQWU7QUFDWCxhQUFLQSxJQUFMLENBQVVzQixLQUFWLENBQWdCRixJQUFoQixFQUFzQkMsTUFBdEI7QUFDQSxhQUFLckIsSUFBTCxHQUFZakIsU0FBWjtBQUNIOztBQUNELGFBQU8sSUFBUDtBQUNIOzs7Ozs7ZUFJVUUsUyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7ZGVmYXVsdE9wdGlvbnMsIE9wdGlvbnN9IGZyb20gXCIuL29wdGlvbnNcIjtcbmltcG9ydCB7Q29kZWMsIEpzb25Db2RlY30gZnJvbSBcIi4vY29kZWNcIjtcbmltcG9ydCB7SGFuZGxlcnNJbXBsLCBIYW5kbGVyc30gZnJvbSBcIi4vaGFuZGxlcnNcIjtcblxuY29uc3QgYm9keVNwbGl0dGVyID0gJ3x8JztcblxuZnVuY3Rpb24gZW5jb2RlR2V0UGFyYW1zKHBhcmFtczogb2JqZWN0KTogc3RyaW5nIHtcbiAgICByZXR1cm4gT2JqZWN0LmVudHJpZXMocGFyYW1zKS5tYXAoa3YgPT4ga3YubWFwKGVuY29kZVVSSUNvbXBvbmVudCkuam9pbihcIj1cIikpLmpvaW4oXCImXCIpO1xufVxuXG5mdW5jdGlvbiBlbmNvZGVFdmVudChjb2RlYzogQ29kZWMsIHR5cGU6IHN0cmluZywgcGF5bG9hZDogYW55KTogc3RyaW5nIHtcbiAgICBsZXQgZGF0YSA9IFwiXCI7XG4gICAgaWYgKHBheWxvYWQpIHtcbiAgICAgICAgZGF0YSA9IGNvZGVjLm1hcnNoYWwocGF5bG9hZCk7XG4gICAgfVxuICAgIHJldHVybiB0eXBlICsgYm9keVNwbGl0dGVyICsgZGF0YTtcbn1cblxuZnVuY3Rpb24gZGVjb2RlRXZlbnQoY29kZWM6IENvZGVjLCBkYXRhOiBzdHJpbmcpOiB7IHR5cGU6IHN0cmluZywgcGF5bG9hZD86IGFueSB9IHtcbiAgICBsZXQgcGFydHMgPSBkYXRhLnNwbGl0KGJvZHlTcGxpdHRlciwgMik7XG4gICAgaWYgKHBhcnRzLmxlbmd0aCA8IDIpIHtcbiAgICAgICAgdGhyb3cgXCJpbnZhbGlkIG1lc3NhZ2UgcmVjZWl2ZWQuIFNwbGl0dGVyIHx8IGV4cGVjdGVkXCI7XG4gICAgfVxuICAgIGxldCBwYXlsb2FkID0gdW5kZWZpbmVkO1xuICAgIGlmIChwYXJ0c1sxXSkge1xuICAgICAgICBwYXlsb2FkID0gY29kZWMudW5tYXJzaGFsKHBhcnRzWzFdKTtcbiAgICB9XG4gICAgcmV0dXJuIHtcbiAgICAgICAgdHlwZTogcGFydHNbMF0sIHBheWxvYWQ6IHBheWxvYWQsXG4gICAgfVxufVxuXG5jbGFzcyBFdHBDbGllbnQge1xuICAgIHByaXZhdGUgY29ubj86IFdlYlNvY2tldDtcbiAgICBwcml2YXRlIHJlYWRvbmx5IGhhbmRsZXJzOiBIYW5kbGVycyA9IG5ldyBIYW5kbGVyc0ltcGwoKTtcbiAgICBwcml2YXRlIHJlYWRvbmx5IHVybDogc3RyaW5nO1xuICAgIHByaXZhdGUgcmVhZG9ubHkgb3B0aW9uczogT3B0aW9ucztcbiAgICBwcml2YXRlIG9uQ29ubjogKCkgPT4gdm9pZCA9ICgpID0+IHtcbiAgICB9O1xuICAgIHByaXZhdGUgb25EaXM6IChldnQ6IENsb3NlRXZlbnQpID0+IHZvaWQgPSBldnQgPT4ge1xuICAgIH07XG4gICAgcHJpdmF0ZSBvbkVycjogKGVycjogYW55KSA9PiB2b2lkID0gZXJyID0+IHtcbiAgICB9O1xuXG4gICAgY29uc3RydWN0b3IodXJsOiBzdHJpbmcsIG9wdGlvbnM/OiBPcHRpb25zKSB7XG4gICAgICAgIGxldCBvcHRzID0gZGVmYXVsdE9wdGlvbnMoKTtcbiAgICAgICAgaWYgKG9wdGlvbnMpIHtcbiAgICAgICAgICAgIG9wdHMgPSB7Li4ub3B0cywgLi4ub3B0aW9uc307XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy51cmwgPSB1cmw7XG4gICAgICAgIHRoaXMub3B0aW9ucyA9IG9wdHM7XG4gICAgfVxuXG4gICAgb25Db25uZWN0KGY6ICgpID0+IHZvaWQpOiBFdHBDbGllbnQge1xuICAgICAgICB0aGlzLm9uQ29ubiA9IGY7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIG9uRGlzY29ubmVjdChmOiAoZXZlbnQ6IENsb3NlRXZlbnQpID0+IHZvaWQpOiBFdHBDbGllbnQge1xuICAgICAgICB0aGlzLm9uRGlzID0gZjtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgb25FcnJvcihmOiAoZTogYW55KSA9PiB2b2lkKTogRXRwQ2xpZW50IHtcbiAgICAgICAgdGhpcy5vbkVyciA9IGY7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIG9uPFQ+KHR5cGU6IHN0cmluZywgZjogKGRhdGE6IFQpID0+IHZvaWQpOiBFdHBDbGllbnQge1xuICAgICAgICB0aGlzLmhhbmRsZXJzLm9uKHR5cGUsIGYpO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICBvZmYodHlwZTogc3RyaW5nKTogRXRwQ2xpZW50IHtcbiAgICAgICAgdGhpcy5oYW5kbGVycy5vZmYodHlwZSk7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIGVtaXQodHlwZTogc3RyaW5nLCBwYXlsb2FkOiBhbnksIGFja1RpbWVvdXRNcz86IG51bWJlcik6IFByb21pc2U8YW55PiB7XG4gICAgICAgIGlmICghdGhpcy5jb25uIHx8IHRoaXMuY29ubi5yZWFkeVN0YXRlICE9PSB0aGlzLmNvbm4uT1BFTikge1xuICAgICAgICAgICAgcmV0dXJuIFByb21pc2UucmVqZWN0KFwiY29ubmVjdGlvbiBub3QgaW5pdGlhbGl6ZWRcIilcbiAgICAgICAgfVxuICAgICAgICBsZXQgZGF0YSA9IGVuY29kZUV2ZW50KHRoaXMub3B0aW9ucy5jb2RlYyB8fCBuZXcgSnNvbkNvZGVjKCksIHR5cGUsIHBheWxvYWQpO1xuICAgICAgICB0aGlzLmNvbm4uc2VuZChkYXRhKTtcbiAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSgpXG4gICAgfVxuXG4gICAgY29ubmVjdCgpOiBFdHBDbGllbnQge1xuICAgICAgICBsZXQgdXJsID0gdGhpcy51cmw7XG4gICAgICAgIGlmICh0aGlzLm9wdGlvbnMucGFyYW1zICYmIE9iamVjdC5rZXlzKHRoaXMub3B0aW9ucy5wYXJhbXMpLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIHVybCA9IHVybCArIFwiP1wiICsgZW5jb2RlR2V0UGFyYW1zKHRoaXMub3B0aW9ucy5wYXJhbXMpO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IHdzID0gbmV3IFdlYlNvY2tldCh1cmwpO1xuICAgICAgICB3cy5vbm9wZW4gPSAoKSA9PiB7XG4gICAgICAgICAgICB0aGlzLm9uQ29ubigpO1xuICAgICAgICB9O1xuICAgICAgICB3cy5vbmNsb3NlID0gKGV2dDogQ2xvc2VFdmVudCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5vbkRpcyhldnQpO1xuICAgICAgICB9O1xuICAgICAgICB3cy5vbmVycm9yID0gZXJyID0+IHtcbiAgICAgICAgICAgIHRoaXMub25FcnIoZXJyKTtcbiAgICAgICAgfTtcbiAgICAgICAgd3Mub25tZXNzYWdlID0gbWVzc2FnZSA9PiB7XG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgIGNvbnN0IGV2ZW50ID0gZGVjb2RlRXZlbnQodGhpcy5vcHRpb25zLmNvZGVjIHx8IG5ldyBKc29uQ29kZWMoKSwgbWVzc2FnZS5kYXRhKTtcbiAgICAgICAgICAgICAgICBjb25zdCBoYW5kbGVyID0gdGhpcy5oYW5kbGVycy5nZXQoZXZlbnQudHlwZSk7XG4gICAgICAgICAgICAgICAgaWYgKGhhbmRsZXIpIHtcbiAgICAgICAgICAgICAgICAgICAgaGFuZGxlcihldmVudC5wYXlsb2FkKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5vbkVycihlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICAgICAgdGhpcy5jb25uID0gd3M7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIGNsb3NlKGNvZGU/OiBudW1iZXIsIHJlYXNvbj86IHN0cmluZyk6IEV0cENsaWVudCB7XG4gICAgICAgIGlmICh0aGlzLmNvbm4pIHtcbiAgICAgICAgICAgIHRoaXMuY29ubi5jbG9zZShjb2RlLCByZWFzb24pO1xuICAgICAgICAgICAgdGhpcy5jb25uID0gdW5kZWZpbmVkO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxufVxuXG5leHBvcnQgZGVmYXVsdCBFdHBDbGllbnQ7XG4iXX0=