"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.HandlersImpl = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var HandlersImpl =
/*#__PURE__*/
function () {
  function HandlersImpl() {
    _classCallCheck(this, HandlersImpl);

    _defineProperty(this, "subs", {});
  }

  _createClass(HandlersImpl, [{
    key: "get",
    value: function get(type) {
      var h = this.subs[type];
      return h ? h : null;
    }
  }, {
    key: "off",
    value: function off(type) {
      delete this.subs[type];
    }
  }, {
    key: "on",
    value: function on(type, f) {
      this.subs[type] = f;
    }
  }]);

  return HandlersImpl;
}();

exports.HandlersImpl = HandlersImpl;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9oYW5kbGVycy50cyJdLCJuYW1lcyI6WyJIYW5kbGVyc0ltcGwiLCJ0eXBlIiwiaCIsInN1YnMiLCJmIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7SUFVYUEsWTs7Ozs7O2tDQUNvQyxFOzs7Ozt3QkFFekNDLEksRUFBNEM7QUFDNUMsVUFBTUMsQ0FBQyxHQUFHLEtBQUtDLElBQUwsQ0FBVUYsSUFBVixDQUFWO0FBQ0EsYUFBT0MsQ0FBQyxHQUFHQSxDQUFILEdBQU8sSUFBZjtBQUNIOzs7d0JBRUdELEksRUFBb0I7QUFDcEIsYUFBTyxLQUFLRSxJQUFMLENBQVVGLElBQVYsQ0FBUDtBQUNIOzs7dUJBRUVBLEksRUFBY0csQyxFQUE4QjtBQUMzQyxXQUFLRCxJQUFMLENBQVVGLElBQVYsSUFBa0JHLENBQWxCO0FBQ0giLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgaW50ZXJmYWNlIEhhbmRsZXJzIHtcbiAgICBzdWJzOiB7IFt0eXBlOiBzdHJpbmddOiAoZGF0YTogYW55KSA9PiB2b2lkIH07XG5cbiAgICBvbih0eXBlOiBzdHJpbmcsIGY6IChkYXRhOiBhbnkpID0+IHZvaWQpOiB2b2lkXG5cbiAgICBvZmYodHlwZTogc3RyaW5nKTogdm9pZFxuXG4gICAgZ2V0KHR5cGU6IHN0cmluZyk6ICgoZGF0YTogYW55KSA9PiB2b2lkKSB8IG51bGxcbn1cblxuZXhwb3J0IGNsYXNzIEhhbmRsZXJzSW1wbCBpbXBsZW1lbnRzIEhhbmRsZXJzIHtcbiAgICBzdWJzOiB7IFtwOiBzdHJpbmddOiAoZGF0YTogYW55KSA9PiB2b2lkIH0gPSB7fTtcblxuICAgIGdldCh0eXBlOiBzdHJpbmcpOiAoKGRhdGE6IGFueSkgPT4gdm9pZCkgfCBudWxsIHtcbiAgICAgICAgY29uc3QgaCA9IHRoaXMuc3Vic1t0eXBlXTtcbiAgICAgICAgcmV0dXJuIGggPyBoIDogbnVsbFxuICAgIH1cblxuICAgIG9mZih0eXBlOiBzdHJpbmcpOiB2b2lkIHtcbiAgICAgICAgZGVsZXRlIHRoaXMuc3Vic1t0eXBlXVxuICAgIH1cblxuICAgIG9uKHR5cGU6IHN0cmluZywgZjogKGRhdGE6IGFueSkgPT4gdm9pZCk6IHZvaWQge1xuICAgICAgICB0aGlzLnN1YnNbdHlwZV0gPSBmXG4gICAgfVxufVxuIl19