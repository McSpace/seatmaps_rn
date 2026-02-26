"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Utils = void 0;
class Utils {
  static generateId() {
    return '_' + Math.random().toString(36).substring(2, 9);
  }
}
exports.Utils = Utils;
//# sourceMappingURL=utils.js.map