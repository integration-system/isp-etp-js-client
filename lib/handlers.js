"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.HandlersImpl = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var HandlersImpl = /*#__PURE__*/function () {
  function HandlersImpl() {
    _classCallCheck(this, HandlersImpl);

    _defineProperty(this, "subs", {});
  }

  _createClass(HandlersImpl, [{
    key: "get",
    value: function get(type) {
      var h = this.subs[type]; // @ts-ignore

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9oYW5kbGVycy50cyJdLCJuYW1lcyI6WyJIYW5kbGVyc0ltcGwiLCJ0eXBlIiwiaCIsInN1YnMiLCJmIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7SUFVYUEsWTs7OztrQ0FDb0MsRTs7Ozs7d0JBRXpDQyxJLEVBQTRDO0FBQzVDLFVBQU1DLENBQUMsR0FBRyxLQUFLQyxJQUFMLENBQVVGLElBQVYsQ0FBVixDQUQ0QyxDQUU1Qzs7QUFDQSxhQUFPQyxDQUFDLEdBQUdBLENBQUgsR0FBTyxJQUFmO0FBQ0g7Ozt3QkFFR0QsSSxFQUFvQjtBQUNwQixhQUFPLEtBQUtFLElBQUwsQ0FBVUYsSUFBVixDQUFQO0FBQ0g7Ozt1QkFFRUEsSSxFQUFjRyxDLEVBQThCO0FBQzNDLFdBQUtELElBQUwsQ0FBVUYsSUFBVixJQUFrQkcsQ0FBbEI7QUFDSCIsInNvdXJjZXNDb250ZW50IjpbImV4cG9ydCBpbnRlcmZhY2UgSGFuZGxlcnMge1xuICAgIHN1YnM6IHsgW3R5cGU6IHN0cmluZ106IChkYXRhOiBhbnkpID0+IHZvaWQgfTtcblxuICAgIG9uKHR5cGU6IHN0cmluZywgZjogKGRhdGE6IGFueSkgPT4gdm9pZCk6IHZvaWRcblxuICAgIG9mZih0eXBlOiBzdHJpbmcpOiB2b2lkXG5cbiAgICBnZXQodHlwZTogc3RyaW5nKTogKChkYXRhOiBhbnkpID0+IHZvaWQpIHwgbnVsbFxufVxuXG5leHBvcnQgY2xhc3MgSGFuZGxlcnNJbXBsIGltcGxlbWVudHMgSGFuZGxlcnMge1xuICAgIHN1YnM6IHsgW3A6IHN0cmluZ106IChkYXRhOiBhbnkpID0+IHZvaWQgfSA9IHt9O1xuXG4gICAgZ2V0KHR5cGU6IHN0cmluZyk6ICgoZGF0YTogYW55KSA9PiB2b2lkKSB8IG51bGwge1xuICAgICAgICBjb25zdCBoID0gdGhpcy5zdWJzW3R5cGVdO1xuICAgICAgICAvLyBAdHMtaWdub3JlXG4gICAgICAgIHJldHVybiBoID8gaCA6IG51bGxcbiAgICB9XG5cbiAgICBvZmYodHlwZTogc3RyaW5nKTogdm9pZCB7XG4gICAgICAgIGRlbGV0ZSB0aGlzLnN1YnNbdHlwZV1cbiAgICB9XG5cbiAgICBvbih0eXBlOiBzdHJpbmcsIGY6IChkYXRhOiBhbnkpID0+IHZvaWQpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5zdWJzW3R5cGVdID0gZlxuICAgIH1cbn1cbiJdfQ==