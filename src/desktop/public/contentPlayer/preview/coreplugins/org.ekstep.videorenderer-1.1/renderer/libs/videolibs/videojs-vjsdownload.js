/**
 * videojs-vjsdownload
 * @version 1.0.4
 * @copyright 2019 7Ds7
 * @license Apache-2.0
 */
! function(e) {
  if ("object" == typeof exports && "undefined" != typeof module) module.exports = e();
  else if ("function" == typeof define && define.amd) define([], e);
  else {
      var t;
      t = "undefined" != typeof window ? window : "undefined" != typeof global ? global : "undefined" != typeof self ? self : this, t.videojsVjsdownload = e()
  }
}(function() {
  return function e(t, o, n) {
      function r(l, u) {
          if (!o[l]) {
              if (!t[l]) {
                  var f = "function" == typeof require && require;
                  if (!u && f) return f(l, !0);
                  if (i) return i(l, !0);
                  var a = new Error("Cannot find module '" + l + "'");
                  throw a.code = "MODULE_NOT_FOUND", a
              }
              var d = o[l] = {
                  exports: {}
              };
              t[l][0].call(d.exports, function(e) {
                  var o = t[l][1][e];
                  return r(o || e)
              }, d, d.exports, e, t, o, n)
          }
          return o[l].exports
      }
      for (var i = "function" == typeof require && require, l = 0; l < n.length; l++) r(n[l]);
      return r
  }({
      1: [function(e, t, o) {
          (function(e) {
              "use strict";

              function n(e, t) {
                  if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
              }

              function r(e, t) {
                  if ("function" != typeof t && null !== t) throw new TypeError("Super expression must either be null or a function, not " + typeof t);
                  e.prototype = Object.create(t && t.prototype, {
                      constructor: {
                          value: e,
                          enumerable: !1,
                          writable: !0,
                          configurable: !0
                      }
                  }), t && (Object.setPrototypeOf ? Object.setPrototypeOf(e, t) : e.__proto__ = t)
              }
              Object.defineProperty(o, "__esModule", {
                  value: !0
              });
              var i = function() {
                      function e(e, t) {
                          for (var o = 0; o < t.length; o++) {
                              var n = t[o];
                              n.enumerable = n.enumerable || !1, n.configurable = !0, "value" in n && (n.writable = !0), Object.defineProperty(e, n.key, n)
                          }
                      }
                      return function(t, o, n) {
                          return o && e(t.prototype, o), n && e(t, n), t
                      }
                  }(),
                  l = function(e, t, o) {
                      for (var n = !0; n;) {
                          var r = e,
                              i = t,
                              l = o;
                          n = !1, null === r && (r = Function.prototype);
                          var u = Object.getOwnPropertyDescriptor(r, i);
                          if (void 0 !== u) {
                              if ("value" in u) return u.value;
                              var f = u.get;
                              if (void 0 === f) return;
                              return f.call(l)
                          }
                          var a = Object.getPrototypeOf(r);
                          if (null === a) return;
                          e = a, t = i, o = l, n = !0, u = a = void 0
                      }
                  },
                  u = "undefined" != typeof window ? window.videojs : void 0 !== e ? e.videojs : null,
                  f = function(e) {
                      return e && e.__esModule ? e : {
                          default: e
                      }
                  }(u),
                  a = {
                      beforeElement: "fullscreenToggle",
                      textControl: "Download video",
                      name: "downloadButton",
                      downloadURL: null
                  },
                  d = f.default.getComponent("Button"),
                  c = function(e) {
                      function t() {
                          n(this, t), l(Object.getPrototypeOf(t.prototype), "constructor", this).apply(this, arguments)
                      }
                      return r(t, e), i(t, [{
                          key: "buildCSSClass",
                          value: function() {
                              return "vjs-vjsdownload " + l(Object.getPrototypeOf(t.prototype), "buildCSSClass", this).call(this)
                          }
                      }, {
                          key: "handleClick",
                          value: function() {
                              var e = this.player();
                              window.open(this.options_.downloadURL || e.currentSrc(), "Download"), e.trigger("downloadvideo")
                          }
                      }]), t
                  }(d),
                  s = function(e, t) {
                      var o = e.controlBar.addChild(new c(e, t), {});
                      o.controlText(t.textControl), e.controlBar.el().insertBefore(o.el(), e.controlBar.getChild(t.beforeElement).el()), e.addClass("vjs-vjsdownload")
                  },
                  p = function(e) {
                      var t = this;
                      this.ready(function() {
                          s(t, f.default.mergeOptions(a, e))
                      })
                  };
              f.default.registerPlugin("vjsdownload", p), o.default = p, t.exports = o.default
          }).call(this, "undefined" != typeof global ? global : "undefined" != typeof self ? self : "undefined" != typeof window ? window : {})
      }, {}]
  }, {}, [1])(1)
});