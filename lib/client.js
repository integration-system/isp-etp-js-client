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
  var data = codec.marshal(payload);
  return type + bodySplitter + data;
}

function decodeEvent(codec, data) {
  var parts = data.split(bodySplitter, 2);

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

      var url = this.url;

      if (Object.keys(this.options.params)) {
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9jbGllbnQudHMiXSwibmFtZXMiOlsiYm9keVNwbGl0dGVyIiwiZW5jb2RlR2V0UGFyYW1zIiwicGFyYW1zIiwiT2JqZWN0IiwiZW50cmllcyIsIm1hcCIsImt2IiwiZW5jb2RlVVJJQ29tcG9uZW50Iiwiam9pbiIsImVuY29kZUV2ZW50IiwiY29kZWMiLCJ0eXBlIiwicGF5bG9hZCIsImRhdGEiLCJtYXJzaGFsIiwiZGVjb2RlRXZlbnQiLCJwYXJ0cyIsInNwbGl0IiwibGVuZ3RoIiwidW5tYXJzaGFsIiwiRXRwQ2xpZW50IiwidXJsIiwib3B0aW9ucyIsIkhhbmRsZXJzSW1wbCIsImV2dCIsImVyciIsIm9wdHMiLCJmIiwib25Db25uIiwib25EaXMiLCJvbkVyciIsImhhbmRsZXJzIiwib24iLCJvZmYiLCJhY2tUaW1lb3V0TXMiLCJjb25uIiwicmVhZHlTdGF0ZSIsIk9QRU4iLCJQcm9taXNlIiwicmVqZWN0Iiwic2VuZCIsInJlc29sdmUiLCJrZXlzIiwid3MiLCJXZWJTb2NrZXQiLCJvbm9wZW4iLCJvbmNsb3NlIiwib25lcnJvciIsIm9ubWVzc2FnZSIsIm1lc3NhZ2UiLCJldmVudCIsImhhbmRsZXIiLCJnZXQiLCJlIiwiY2xvc2UiLCJ1bmRlZmluZWQiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7QUFBQTs7QUFFQTs7Ozs7Ozs7Ozs7Ozs7QUFFQSxJQUFNQSxZQUFZLEdBQUcsSUFBckI7O0FBRUEsU0FBU0MsZUFBVCxDQUF5QkMsTUFBekIsRUFBaUQ7QUFDN0MsU0FBT0MsTUFBTSxDQUFDQyxPQUFQLENBQWVGLE1BQWYsRUFBdUJHLEdBQXZCLENBQTJCLFVBQUFDLEVBQUU7QUFBQSxXQUFJQSxFQUFFLENBQUNELEdBQUgsQ0FBT0Usa0JBQVAsRUFBMkJDLElBQTNCLENBQWdDLEdBQWhDLENBQUo7QUFBQSxHQUE3QixFQUF1RUEsSUFBdkUsQ0FBNEUsR0FBNUUsQ0FBUDtBQUNIOztBQUVELFNBQVNDLFdBQVQsQ0FBcUJDLEtBQXJCLEVBQW1D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bHRPcHRpb25zLCBPcHRpb25zfSBmcm9tIFwiLi9vcHRpb25zXCI7XG5pbXBvcnQge0NvZGVjfSBmcm9tIFwiLi9jb2RlY1wiO1xuaW1wb3J0IHtIYW5kbGVyc0ltcGwsIEhhbmRsZXJzfSBmcm9tIFwiLi9oYW5kbGVyc1wiO1xuXG5jb25zdCBib2R5U3BsaXR0ZXIgPSAnfHwnO1xuXG5mdW5jdGlvbiBlbmNvZGVHZXRQYXJhbXMocGFyYW1zOiBvYmplY3QpOiBzdHJpbmcge1xuICAgIHJldHVybiBPYmplY3QuZW50cmllcyhwYXJhbXMpLm1hcChrdiA9PiBrdi5tYXAoZW5jb2RlVVJJQ29tcG9uZW50KS5qb2luKFwiPVwiKSkuam9pbihcIiZcIik7XG59XG5cbmZ1bmN0aW9uIGVuY29kZUV2ZW50KGNvZGVjOiBDb2RlYywgdHlwZTogc3RyaW5nLCBwYXlsb2FkOiBhbnkpOiBzdHJpbmcge1xuICAgIGNvbnN0IGRhdGEgPSBjb2RlYy5tYXJzaGFsKHBheWxvYWQpO1xuICAgIHJldHVybiB0eXBlICsgYm9keVNwbGl0dGVyICsgZGF0YTtcbn1cblxuZnVuY3Rpb24gZGVjb2RlRXZlbnQoY29kZWM6IENvZGVjLCBkYXRhOiBzdHJpbmcpOiB7IHR5cGU6IHN0cmluZywgcGF5bG9hZDogYW55IH0ge1xuICAgIGxldCBwYXJ0cyA9IGRhdGEuc3BsaXQoYm9keVNwbGl0dGVyLCAyKTtcbiAgICBpZiAocGFydHMubGVuZ3RoIDwgMikge1xuICAgICAgICB0aHJvdyBcImludmFsaWQgbWVzc2FnZSByZWNlaXZlZC4gU3BsaXR0ZXIgfHwgZXhwZWN0ZWRcIjtcbiAgICB9XG4gICAgY29uc3QgcGF5bG9hZCA9IGNvZGVjLnVubWFyc2hhbChwYXJ0c1sxXSk7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgdHlwZTogcGFydHNbMF0sIHBheWxvYWQ6IHBheWxvYWQsXG4gICAgfVxufVxuXG5jbGFzcyBFdHBDbGllbnQge1xuICAgIHByaXZhdGUgY29ubj86IFdlYlNvY2tldDtcbiAgICBwcml2YXRlIHJlYWRvbmx5IGhhbmRsZXJzOiBIYW5kbGVycyA9IG5ldyBIYW5kbGVyc0ltcGwoKTtcbiAgICBwcml2YXRlIHJlYWRvbmx5IHVybDogc3RyaW5nO1xuICAgIHByaXZhdGUgcmVhZG9ubHkgb3B0aW9uczogT3B0aW9ucztcbiAgICBwcml2YXRlIG9uQ29ubjogKCkgPT4gdm9pZCA9ICgpID0+IHtcbiAgICB9O1xuICAgIHByaXZhdGUgb25EaXM6IChldnQ6IENsb3NlRXZlbnQpID0+IHZvaWQgPSBldnQgPT4ge1xuICAgIH07XG4gICAgcHJpdmF0ZSBvbkVycjogKGVycjogYW55KSA9PiB2b2lkID0gZXJyID0+IHtcbiAgICB9O1xuXG4gICAgY29uc3RydWN0b3IodXJsOiBzdHJpbmcsIG9wdGlvbnM/OiBPcHRpb25zKSB7XG4gICAgICAgIGxldCBvcHRzID0gZGVmYXVsdE9wdGlvbnMoKTtcbiAgICAgICAgaWYgKG9wdGlvbnMpIHtcbiAgICAgICAgICAgIG9wdHMgPSB7Li4ub3B0cywgLi4ub3B0aW9uc307XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy51cmwgPSB1cmw7XG4gICAgICAgIHRoaXMub3B0aW9ucyA9IG9wdHM7XG4gICAgfVxuXG4gICAgb25Db25uZWN0KGY6ICgpID0+IHZvaWQpOiBFdHBDbGllbnQge1xuICAgICAgICB0aGlzLm9uQ29ubiA9IGY7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIG9uRGlzY29ubmVjdChmOiAoZXZlbnQ6IENsb3NlRXZlbnQpID0+IHZvaWQpOiBFdHBDbGllbnQge1xuICAgICAgICB0aGlzLm9uRGlzID0gZjtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgb25FcnJvcihmOiAoZTogYW55KSA9PiB2b2lkKTogRXRwQ2xpZW50IHtcbiAgICAgICAgdGhpcy5vbkVyciA9IGY7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIG9uPFQ+KHR5cGU6IHN0cmluZywgZjogKGRhdGE6IFQpID0+IHZvaWQpOiBFdHBDbGllbnQge1xuICAgICAgICB0aGlzLmhhbmRsZXJzLm9uKHR5cGUsIGYpO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICBvZmYodHlwZTogc3RyaW5nKTogRXRwQ2xpZW50IHtcbiAgICAgICAgdGhpcy5oYW5kbGVycy5vZmYodHlwZSk7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIGVtaXQodHlwZTogc3RyaW5nLCBwYXlsb2FkOiBhbnksIGFja1RpbWVvdXRNcz86IG51bWJlcik6IFByb21pc2U8YW55PiB7XG4gICAgICAgIGlmICghdGhpcy5jb25uIHx8IHRoaXMuY29ubi5yZWFkeVN0YXRlICE9PSB0aGlzLmNvbm4uT1BFTikge1xuICAgICAgICAgICAgcmV0dXJuIFByb21pc2UucmVqZWN0KFwiY29ubmVjdGlvbiBub3QgaW5pdGlhbGl6ZWRcIilcbiAgICAgICAgfVxuICAgICAgICBsZXQgZGF0YSA9IGVuY29kZUV2ZW50KHRoaXMub3B0aW9ucy5jb2RlYywgdHlwZSwgcGF5bG9hZCk7XG4gICAgICAgIHRoaXMuY29ubi5zZW5kKGRhdGEpO1xuICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKClcbiAgICB9XG5cbiAgICBjb25uZWN0KCk6IEV0cENsaWVudCB7XG4gICAgICAgIGxldCB1cmwgPSB0aGlzLnVybDtcbiAgICAgICAgaWYgKE9iamVjdC5rZXlzKHRoaXMub3B0aW9ucy5wYXJhbXMpKSB7XG4gICAgICAgICAgICB1cmwgPSBcIj9cIiArIGVuY29kZUdldFBhcmFtcyh0aGlzLm9wdGlvbnMucGFyYW1zKTtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCB3cyA9IG5ldyBXZWJTb2NrZXQodXJsKTtcbiAgICAgICAgd3Mub25vcGVuID0gKCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5vbkNvbm4oKTtcbiAgICAgICAgfTtcbiAgICAgICAgd3Mub25jbG9zZSA9IChldnQ6IENsb3NlRXZlbnQpID0+IHtcbiAgICAgICAgICAgIHRoaXMub25EaXMoZXZ0KTtcbiAgICAgICAgfTtcbiAgICAgICAgd3Mub25lcnJvciA9IGVyciA9PiB7XG4gICAgICAgICAgICB0aGlzLm9uRXJyKGVycik7XG4gICAgICAgIH07XG4gICAgICAgIHdzLm9ubWVzc2FnZSA9IG1lc3NhZ2UgPT4ge1xuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICBjb25zdCBldmVudCA9IGRlY29kZUV2ZW50KHRoaXMub3B0aW9ucy5jb2RlYywgbWVzc2FnZS5kYXRhKTtcbiAgICAgICAgICAgICAgICBjb25zdCBoYW5kbGVyID0gdGhpcy5oYW5kbGVycy5nZXQoZXZlbnQudHlwZSk7XG4gICAgICAgICAgICAgICAgaWYgKGhhbmRsZXIpIHtcbiAgICAgICAgICAgICAgICAgICAgaGFuZGxlcihldmVudC5wYXlsb2FkKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5vbkVycihlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICAgICAgdGhpcy5jb25uID0gd3M7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIGNsb3NlKCk6IEV0cENsaWVudCB7XG4gICAgICAgIGlmICh0aGlzLmNvbm4pIHtcbiAgICAgICAgICAgIHRoaXMuY29ubi5jbG9zZSgpO1xuICAgICAgICAgICAgdGhpcy5jb25uID0gdW5kZWZpbmVkO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxufVxuXG5leHBvcnQgZGVmYXVsdCBFdHBDbGllbnQ7XG4iXX0=