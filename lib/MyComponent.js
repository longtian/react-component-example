"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var MyComponent = function MyComponent(props) {
  return _react2.default.createElement(
    "div",
    { className: "my-component" },
    "props:",
    _react2.default.createElement(
      "pre",
      null,
      JSON.stringify(props, null, 2)
    )
  );
}; /**
    * Created by yan on 16-1-20.
    */

exports.default = MyComponent;
//# sourceMappingURL=MyComponent.js.map