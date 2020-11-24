"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.JsonCodec = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var JsonCodec = /*#__PURE__*/function () {
  function JsonCodec() {
    _classCallCheck(this, JsonCodec);
  }

  _createClass(JsonCodec, [{
    key: "marshal",
    value: function marshal(data) {
      return JSON.stringify(data);
    }
  }, {
    key: "unmarshal",
    value: function unmarshal(data) {
      return JSON.parse(data);
    }
  }]);

  return JsonCodec;
}();

exports.JsonCodec = JsonCodec;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9jb2RlYy50cyJdLCJuYW1lcyI6WyJKc29uQ29kZWMiLCJkYXRhIiwiSlNPTiIsInN0cmluZ2lmeSIsInBhcnNlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7O0lBTWFBLFM7Ozs7Ozs7NEJBQ0RDLEksRUFBbUI7QUFDdkIsYUFBT0MsSUFBSSxDQUFDQyxTQUFMLENBQWVGLElBQWYsQ0FBUDtBQUNIOzs7OEJBRVNBLEksRUFBcUI7QUFDM0IsYUFBT0MsSUFBSSxDQUFDRSxLQUFMLENBQVdILElBQVgsQ0FBUDtBQUNIIiwic291cmNlc0NvbnRlbnQiOlsiZXhwb3J0IGludGVyZmFjZSBDb2RlYyB7XG4gICAgbWFyc2hhbChkYXRhOiBhbnkpOiBzdHJpbmcsXG5cbiAgICB1bm1hcnNoYWwoZGF0YTogc3RyaW5nKTogYW55XG59XG5cbmV4cG9ydCBjbGFzcyBKc29uQ29kZWMgaW1wbGVtZW50cyBDb2RlYyB7XG4gICAgbWFyc2hhbChkYXRhOiBhbnkpOiBzdHJpbmcge1xuICAgICAgICByZXR1cm4gSlNPTi5zdHJpbmdpZnkoZGF0YSlcbiAgICB9XG5cbiAgICB1bm1hcnNoYWwoZGF0YTogc3RyaW5nKTogKGFueSkge1xuICAgICAgICByZXR1cm4gSlNPTi5wYXJzZShkYXRhKVxuICAgIH1cbn1cbiJdfQ==