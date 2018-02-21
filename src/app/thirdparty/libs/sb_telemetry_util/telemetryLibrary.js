/**
 * @author Krushanu Mohapatra<Krushanu.Mohapatra@tarento.com>
 */
var detectClient = function () {
  var nAgt = navigator.userAgent
  var browserName = navigator.appName
  var fullVersion = '' + parseFloat(navigator.appVersion)
  var nameOffset, verOffset, ix

  // In Opera
  /* istanbul ignore next. Cannot test this as the test cases runs in phatomjs browser */
  if ((verOffset = nAgt.indexOf('Opera')) != -1) {
    browserName = 'opera'
    fullVersion = nAgt.substring(verOffset + 6)
    if ((verOffset = nAgt.indexOf('Version')) != -1) { fullVersion = nAgt.substring(verOffset + 8) }
  }
  // In MSIE
  else if ((verOffset = nAgt.indexOf('MSIE')) != -1) {
    browserName = 'IE'
    fullVersion = nAgt.substring(verOffset + 5)
  }
  // In Chrome
  else if ((verOffset = nAgt.indexOf('Chrome')) != -1) {
    browserName = 'chrome'
    fullVersion = nAgt.substring(verOffset + 7)
  }
  // In Safari
  else if ((verOffset = nAgt.indexOf('Safari')) != -1) {
    browserName = 'safari'
    fullVersion = nAgt.substring(verOffset + 7)
    if ((verOffset = nAgt.indexOf('Version')) != -1) { fullVersion = nAgt.substring(verOffset + 8) }
  }
  // In Firefox
  else if ((verOffset = nAgt.indexOf('Firefox')) != -1) {
    browserName = 'firefox'
    fullVersion = nAgt.substring(verOffset + 8)
  }

  // trim the fullVersion string at semicolon/space if present
  /* istanbul ignore next. Cannot test this as the test cases runs in phatomjs browser */
  if ((ix = fullVersion.indexOf(';')) != -1) { fullVersion = fullVersion.substring(0, ix) }
  /* istanbul ignore next. Cannot test this as the test cases runs in phatomjs browser */
  if ((ix = fullVersion.indexOf(' ')) != -1) { fullVersion = fullVersion.substring(0, ix) }

  return { browser: browserName, browserver: fullVersion, os: navigator.platform }
}

/*
CryptoJS v3.1.2
code.google.com/p/crypto-js
(c) 2009-2013 by Jeff Mott. All rights reserved.
code.google.com/p/crypto-js/wiki/License
*/
var CryptoJS = CryptoJS || (function (s, p) {
  var m = {},
    l = m.lib = {},
    n = function () {},
    r = l.Base = {
      extend: function (b) {
        n.prototype = this
        var h = new n()
        b && h.mixIn(b)
        h.hasOwnProperty('init') || (h.init = function () {
          h.$super.init.apply(this, arguments)
        })
        h.init.prototype = h
        h.$super = this
        return h
      },
      create: function () {
        var b = this.extend()
        b.init.apply(b, arguments)
        return b
      },
      init: function () {},
      mixIn: function (b) {
        for (var h in b) b.hasOwnProperty(h) && (this[h] = b[h])
        b.hasOwnProperty('toString') && (this.toString = b.toString)
      },
      clone: function () {
        return this.init.prototype.extend(this)
      }
    },
    q = l.WordArray = r.extend({
      init: function (b, h) {
        b = this.words = b || []
        this.sigBytes = h != p ? h : 4 * b.length
      },
      toString: function (b) {
        return (b || t).stringify(this)
      },
      concat: function (b) {
        var h = this.words,
          a = b.words,
          j = this.sigBytes
        b = b.sigBytes
        this.clamp()
        if (j % 4) { for (var g = 0; g < b; g++) h[j + g >>> 2] |= (a[g >>> 2] >>> 24 - 8 * (g % 4) & 255) << 24 - 8 * ((j + g) % 4) } else if (a.length > 65535) { for (g = 0; g < b; g += 4) h[j + g >>> 2] = a[g >>> 2] } else h.push.apply(h, a)
        this.sigBytes += b
        return this
      },
      clamp: function () {
        var b = this.words,
          h = this.sigBytes
        b[h >>> 2] &= 4294967295 <<
                32 - 8 * (h % 4)
        b.length = s.ceil(h / 4)
      },
      clone: function () {
        var b = r.clone.call(this)
        b.words = this.words.slice(0)
        return b
      },
      random: function (b) {
        for (var h = [], a = 0; a < b; a += 4) h.push(4294967296 * s.random() | 0)
        return new q.init(h, b)
      }
    }),
    v = m.enc = {},
    t = v.Hex = {
      stringify: function (b) {
        var a = b.words
        b = b.sigBytes
        for (var g = [], j = 0; j < b; j++) {
          var k = a[j >>> 2] >>> 24 - 8 * (j % 4) & 255
          g.push((k >>> 4).toString(16))
          g.push((k & 15).toString(16))
        }
        return g.join('')
      },
      parse: function (b) {
        for (var a = b.length, g = [], j = 0; j < a; j += 2) {
          g[j >>> 3] |= parseInt(b.substr(j,
            2), 16) << 24 - 4 * (j % 8)
        }
        return new q.init(g, a / 2)
      }
    },
    a = v.Latin1 = {
      stringify: function (b) {
        var a = b.words
        b = b.sigBytes
        for (var g = [], j = 0; j < b; j++) g.push(String.fromCharCode(a[j >>> 2] >>> 24 - 8 * (j % 4) & 255))
        return g.join('')
      },
      parse: function (b) {
        for (var a = b.length, g = [], j = 0; j < a; j++) g[j >>> 2] |= (b.charCodeAt(j) & 255) << 24 - 8 * (j % 4)
        return new q.init(g, a)
      }
    },
    u = v.Utf8 = {
      stringify: function (b) {
        try {
          return decodeURIComponent(escape(a.stringify(b)))
        } catch (g) {
          throw Error('Malformed UTF-8 data')
        }
      },
      parse: function (b) {
        return a.parse(unescape(encodeURIComponent(b)))
      }
    },
    g = l.BufferedBlockAlgorithm = r.extend({
      reset: function () {
        this._data = new q.init()
        this._nDataBytes = 0
      },
      _append: function (b) {
        typeof b === 'string' && (b = u.parse(b))
        this._data.concat(b)
        this._nDataBytes += b.sigBytes
      },
      _process: function (b) {
        var a = this._data,
          g = a.words,
          j = a.sigBytes,
          k = this.blockSize,
          m = j / (4 * k),
          m = b ? s.ceil(m) : s.max((m | 0) - this._minBufferSize, 0)
        b = m * k
        j = s.min(4 * b, j)
        if (b) {
          for (var l = 0; l < b; l += k) this._doProcessBlock(g, l)
          l = g.splice(0, b)
          a.sigBytes -= j
        }
        return new q.init(l, j)
      },
      clone: function () {
        var b = r.clone.call(this)
        b._data = this._data.clone()
        return b
      },
      _minBufferSize: 0
    })
  l.Hasher = g.extend({
    cfg: r.extend(),
    init: function (b) {
      this.cfg = this.cfg.extend(b)
      this.reset()
    },
    reset: function () {
      g.reset.call(this)
      this._doReset()
    },
    update: function (b) {
      this._append(b)
      this._process()
      return this
    },
    finalize: function (b) {
      b && this._append(b)
      return this._doFinalize()
    },
    blockSize: 16,
    _createHelper: function (b) {
      return function (a, g) {
        return (new b.init(g)).finalize(a)
      }
    },
    _createHmacHelper: function (b) {
      return function (a, g) {
        return (new k.HMAC.init(b,
          g)).finalize(a)
      }
    }
  })
  var k = m.algo = {}
  return m
}(Math));
(function (s) {
  function p (a, k, b, h, l, j, m) {
    a = a + (k & b | ~k & h) + l + m
    return (a << j | a >>> 32 - j) + k
  }

  function m (a, k, b, h, l, j, m) {
    a = a + (k & h | b & ~h) + l + m
    return (a << j | a >>> 32 - j) + k
  }

  function l (a, k, b, h, l, j, m) {
    a = a + (k ^ b ^ h) + l + m
    return (a << j | a >>> 32 - j) + k
  }

  function n (a, k, b, h, l, j, m) {
    a = a + (b ^ (k | ~h)) + l + m
    return (a << j | a >>> 32 - j) + k
  }
  for (var r = CryptoJS, q = r.lib, v = q.WordArray, t = q.Hasher, q = r.algo, a = [], u = 0; u < 64; u++) a[u] = 4294967296 * s.abs(s.sin(u + 1)) | 0
  q = q.MD5 = t.extend({
    _doReset: function () {
      this._hash = new v.init([1732584193, 4023233417, 2562383102, 271733878])
    },
    _doProcessBlock: function (g, k) {
      for (var b = 0; b < 16; b++) {
        var h = k + b,
          w = g[h]
        g[h] = (w << 8 | w >>> 24) & 16711935 | (w << 24 | w >>> 8) & 4278255360
      }
      var b = this._hash.words,
        h = g[k + 0],
        w = g[k + 1],
        j = g[k + 2],
        q = g[k + 3],
        r = g[k + 4],
        s = g[k + 5],
        t = g[k + 6],
        u = g[k + 7],
        v = g[k + 8],
        x = g[k + 9],
        y = g[k + 10],
        z = g[k + 11],
        A = g[k + 12],
        B = g[k + 13],
        C = g[k + 14],
        D = g[k + 15],
        c = b[0],
        d = b[1],
        e = b[2],
        f = b[3],
        c = p(c, d, e, f, h, 7, a[0]),
        f = p(f, c, d, e, w, 12, a[1]),
        e = p(e, f, c, d, j, 17, a[2]),
        d = p(d, e, f, c, q, 22, a[3]),
        c = p(c, d, e, f, r, 7, a[4]),
        f = p(f, c, d, e, s, 12, a[5]),
        e = p(e, f, c, d, t, 17, a[6]),
        d = p(d, e, f, c, u, 22, a[7]),
        c = p(c, d, e, f, v, 7, a[8]),
        f = p(f, c, d, e, x, 12, a[9]),
        e = p(e, f, c, d, y, 17, a[10]),
        d = p(d, e, f, c, z, 22, a[11]),
        c = p(c, d, e, f, A, 7, a[12]),
        f = p(f, c, d, e, B, 12, a[13]),
        e = p(e, f, c, d, C, 17, a[14]),
        d = p(d, e, f, c, D, 22, a[15]),
        c = m(c, d, e, f, w, 5, a[16]),
        f = m(f, c, d, e, t, 9, a[17]),
        e = m(e, f, c, d, z, 14, a[18]),
        d = m(d, e, f, c, h, 20, a[19]),
        c = m(c, d, e, f, s, 5, a[20]),
        f = m(f, c, d, e, y, 9, a[21]),
        e = m(e, f, c, d, D, 14, a[22]),
        d = m(d, e, f, c, r, 20, a[23]),
        c = m(c, d, e, f, x, 5, a[24]),
        f = m(f, c, d, e, C, 9, a[25]),
        e = m(e, f, c, d, q, 14, a[26]),
        d = m(d, e, f, c, v, 20, a[27]),
        c = m(c, d, e, f, B, 5, a[28]),
        f = m(f, c,
          d, e, j, 9, a[29]),
        e = m(e, f, c, d, u, 14, a[30]),
        d = m(d, e, f, c, A, 20, a[31]),
        c = l(c, d, e, f, s, 4, a[32]),
        f = l(f, c, d, e, v, 11, a[33]),
        e = l(e, f, c, d, z, 16, a[34]),
        d = l(d, e, f, c, C, 23, a[35]),
        c = l(c, d, e, f, w, 4, a[36]),
        f = l(f, c, d, e, r, 11, a[37]),
        e = l(e, f, c, d, u, 16, a[38]),
        d = l(d, e, f, c, y, 23, a[39]),
        c = l(c, d, e, f, B, 4, a[40]),
        f = l(f, c, d, e, h, 11, a[41]),
        e = l(e, f, c, d, q, 16, a[42]),
        d = l(d, e, f, c, t, 23, a[43]),
        c = l(c, d, e, f, x, 4, a[44]),
        f = l(f, c, d, e, A, 11, a[45]),
        e = l(e, f, c, d, D, 16, a[46]),
        d = l(d, e, f, c, j, 23, a[47]),
        c = n(c, d, e, f, h, 6, a[48]),
        f = n(f, c, d, e, u, 10, a[49]),
        e = n(e, f, c, d,
          C, 15, a[50]),
        d = n(d, e, f, c, s, 21, a[51]),
        c = n(c, d, e, f, A, 6, a[52]),
        f = n(f, c, d, e, q, 10, a[53]),
        e = n(e, f, c, d, y, 15, a[54]),
        d = n(d, e, f, c, w, 21, a[55]),
        c = n(c, d, e, f, v, 6, a[56]),
        f = n(f, c, d, e, D, 10, a[57]),
        e = n(e, f, c, d, t, 15, a[58]),
        d = n(d, e, f, c, B, 21, a[59]),
        c = n(c, d, e, f, r, 6, a[60]),
        f = n(f, c, d, e, z, 10, a[61]),
        e = n(e, f, c, d, j, 15, a[62]),
        d = n(d, e, f, c, x, 21, a[63])
      b[0] = b[0] + c | 0
      b[1] = b[1] + d | 0
      b[2] = b[2] + e | 0
      b[3] = b[3] + f | 0
    },
    _doFinalize: function () {
      var a = this._data,
        k = a.words,
        b = 8 * this._nDataBytes,
        h = 8 * a.sigBytes
      k[h >>> 5] |= 128 << 24 - h % 32
      var l = s.floor(b /
            4294967296)
      k[(h + 64 >>> 9 << 4) + 15] = (l << 8 | l >>> 24) & 16711935 | (l << 24 | l >>> 8) & 4278255360
      k[(h + 64 >>> 9 << 4) + 14] = (b << 8 | b >>> 24) & 16711935 | (b << 24 | b >>> 8) & 4278255360
      a.sigBytes = 4 * (k.length + 1)
      this._process()
      a = this._hash
      k = a.words
      for (b = 0; b < 4; b++) h = k[b], k[b] = (h << 8 | h >>> 24) & 16711935 | (h << 24 | h >>> 8) & 4278255360
      return a
    },
    clone: function () {
      var a = t.clone.call(this)
      a._hash = this._hash.clone()
      return a
    }
  })
  r.MD5 = t._createHelper(q)
  r.HmacMD5 = t._createHmacHelper(q)
})(Math);
/*
* Fingerprintjs2 1.5.1 - Modern & flexible browser fingerprint library v2
* https://github.com/Valve/fingerprintjs2
* Copyright (c) 2015 Valentin Vasilyev (valentin.vasilyev@outlook.com)
* Licensed under the MIT (http://www.opensource.org/licenses/mit-license.php) license.
*
* THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
* AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
* IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
* ARE DISCLAIMED. IN NO EVENT SHALL VALENTIN VASILYEV BE LIABLE FOR ANY
* DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
* (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
* LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
* ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
* (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF
* THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/

(function (name, context, definition) {
  'use strict'
  if (typeof window !== 'undefined') {
    if (typeof window.define === 'function' && window.define.amd) {
      window.define(definition)
    } else if (typeof module !== 'undefined' && module.exports) {
      module.exports = definition()
    } else if (context.exports) {
      context.exports = definition()
    } else {
      context[name] = definition()
    }
  }
})('Fingerprint2', this, function () {
  'use strict'
  /**
 * @constructor
 * @param {Object=} options
 */
  var Fingerprint2 = function (options) {
    if (!(this instanceof Fingerprint2)) {
      return new Fingerprint2(options)
    }

    var defaultOptions = {
      swfContainerId: 'fingerprintjs2',
      swfPath: 'flash/compiled/FontList.swf',
      detectScreenOrientation: true,
      sortPluginsFor: [/palemoon/i],
      userDefinedFonts: []
    }
    this.options = this.extend(options, defaultOptions)
    this.nativeForEach = Array.prototype.forEach
    this.nativeMap = Array.prototype.map
  }
  Fingerprint2.prototype = {
    extend: function (source, target) {
      if (source == null) {
        return target
      }
      for (var k in source) {
        if (source[k] != null && target[k] !== source[k]) {
          target[k] = source[k]
        }
      }
      return target
    },
    get: function (done) {
      var that = this
      var keys = {
        data: [],
        addPreprocessedComponent: function (pair) {
          var componentValue = pair.value
          if (typeof that.options.preprocessor === 'function') {
            componentValue = that.options.preprocessor(pair.key, componentValue)
          }
          keys.data.push({
            key: pair.key,
            value: componentValue
          })
        }
      }
      keys = this.userAgentKey(keys)
      keys = this.languageKey(keys)
      keys = this.colorDepthKey(keys)
      keys = this.deviceMemoryKey(keys)
      keys = this.pixelRatioKey(keys)
      keys = this.hardwareConcurrencyKey(keys)
      keys = this.screenResolutionKey(keys)
      keys = this.availableScreenResolutionKey(keys)
      keys = this.timezoneOffsetKey(keys)
      keys = this.sessionStorageKey(keys)
      keys = this.localStorageKey(keys)
      keys = this.indexedDbKey(keys)
      keys = this.addBehaviorKey(keys)
      keys = this.openDatabaseKey(keys)
      keys = this.cpuClassKey(keys)
      keys = this.platformKey(keys)
      keys = this.doNotTrackKey(keys)
      keys = this.pluginsKey(keys)
      keys = this.canvasKey(keys)
      keys = this.webglKey(keys)
      keys = this.webglVendorAndRendererKey(keys)
      keys = this.adBlockKey(keys)
      keys = this.hasLiedLanguagesKey(keys)
      keys = this.hasLiedResolutionKey(keys)
      keys = this.hasLiedOsKey(keys)
      keys = this.hasLiedBrowserKey(keys)
      keys = this.touchSupportKey(keys)
      keys = this.customEntropyFunction(keys)
      this.fontsKey(keys, function (newKeys) {
        var values = []
        that.each(newKeys.data, function (pair) {
          var value = pair.value
          if (value && typeof value.join === 'function') {
            value = value.join(';')
          }
          values.push(value)
        })
        var murmur = that.x64hash128(values.join('~~~'), 31)
        return done(murmur, newKeys.data)
      })
    },
    customEntropyFunction: function (keys) {
      if (typeof this.options.customFunction === 'function') {
        keys.addPreprocessedComponent({
          key: 'custom',
          value: this.options.customFunction()
        })
      }
      return keys
    },
    userAgentKey: function (keys) {
      if (!this.options.excludeUserAgent) {
        keys.addPreprocessedComponent({
          key: 'user_agent',
          value: this.getUserAgent()
        })
      }
      return keys
    },
    // for tests
    getUserAgent: function () {
      return navigator.userAgent
    },
    languageKey: function (keys) {
      if (!this.options.excludeLanguage) {
        // IE 9,10 on Windows 10 does not have the `navigator.language` property any longer
        keys.addPreprocessedComponent({
          key: 'language',
          value: navigator.language || navigator.userLanguage || navigator.browserLanguage || navigator.systemLanguage || ''
        })
      }
      return keys
    },
    colorDepthKey: function (keys) {
      if (!this.options.excludeColorDepth) {
        keys.addPreprocessedComponent({
          key: 'color_depth',
          value: window.screen.colorDepth || -1
        })
      }
      return keys
    },
    deviceMemoryKey: function (keys) {
      if (!this.options.excludeDeviceMemory) {
        keys.addPreprocessedComponent({
          key: 'device_memory',
          value: this.getDeviceMemory()
        })
      }
      return keys
    },
    getDeviceMemory: function () {
      return navigator.deviceMemory || -1
    },
    pixelRatioKey: function (keys) {
      if (!this.options.excludePixelRatio) {
        keys.addPreprocessedComponent({
          key: 'pixel_ratio',
          value: this.getPixelRatio()
        })
      }
      return keys
    },
    getPixelRatio: function () {
      return window.devicePixelRatio || ''
    },
    screenResolutionKey: function (keys) {
      if (!this.options.excludeScreenResolution) {
        return this.getScreenResolution(keys)
      }
      return keys
    },
    getScreenResolution: function (keys) {
      var resolution
      if (this.options.detectScreenOrientation) {
        resolution = (window.screen.height > window.screen.width) ? [window.screen.height, window.screen.width] : [window.screen.width, window.screen.height]
      } else {
        resolution = [window.screen.width, window.screen.height]
      }
      keys.addPreprocessedComponent({
        key: 'resolution',
        value: resolution
      })
      return keys
    },
    availableScreenResolutionKey: function (keys) {
      if (!this.options.excludeAvailableScreenResolution) {
        return this.getAvailableScreenResolution(keys)
      }
      return keys
    },
    getAvailableScreenResolution: function (keys) {
      var available
      if (window.screen.availWidth && window.screen.availHeight) {
        if (this.options.detectScreenOrientation) {
          available = (window.screen.availHeight > window.screen.availWidth) ? [window.screen.availHeight, window.screen.availWidth] : [window.screen.availWidth, window.screen.availHeight]
        } else {
          available = [window.screen.availHeight, window.screen.availWidth]
        }
      }
      if (typeof available !== 'undefined') { // headless browsers
        keys.addPreprocessedComponent({
          key: 'available_resolution',
          value: available
        })
      }
      return keys
    },
    timezoneOffsetKey: function (keys) {
      if (!this.options.excludeTimezoneOffset) {
        keys.addPreprocessedComponent({
          key: 'timezone_offset',
          value: new Date().getTimezoneOffset()
        })
      }
      return keys
    },
    sessionStorageKey: function (keys) {
      if (!this.options.excludeSessionStorage && this.hasSessionStorage()) {
        keys.addPreprocessedComponent({
          key: 'session_storage',
          value: 1
        })
      }
      return keys
    },
    localStorageKey: function (keys) {
      if (!this.options.excludeSessionStorage && this.hasLocalStorage()) {
        keys.addPreprocessedComponent({
          key: 'local_storage',
          value: 1
        })
      }
      return keys
    },
    indexedDbKey: function (keys) {
      if (!this.options.excludeIndexedDB && this.hasIndexedDB()) {
        keys.addPreprocessedComponent({
          key: 'indexed_db',
          value: 1
        })
      }
      return keys
    },
    addBehaviorKey: function (keys) {
      // body might not be defined at this point or removed programmatically
      if (!this.options.excludeAddBehavior && document.body && document.body.addBehavior) {
        keys.addPreprocessedComponent({
          key: 'add_behavior',
          value: 1
        })
      }
      return keys
    },
    openDatabaseKey: function (keys) {
      if (!this.options.excludeOpenDatabase && window.openDatabase) {
        keys.addPreprocessedComponent({
          key: 'open_database',
          value: 1
        })
      }
      return keys
    },
    cpuClassKey: function (keys) {
      if (!this.options.excludeCpuClass) {
        keys.addPreprocessedComponent({
          key: 'cpu_class',
          value: this.getNavigatorCpuClass()
        })
      }
      return keys
    },
    platformKey: function (keys) {
      if (!this.options.excludePlatform) {
        keys.addPreprocessedComponent({
          key: 'navigator_platform',
          value: this.getNavigatorPlatform()
        })
      }
      return keys
    },
    doNotTrackKey: function (keys) {
      if (!this.options.excludeDoNotTrack) {
        keys.addPreprocessedComponent({
          key: 'do_not_track',
          value: this.getDoNotTrack()
        })
      }
      return keys
    },
    canvasKey: function (keys) {
      if (!this.options.excludeCanvas && this.isCanvasSupported()) {
        keys.addPreprocessedComponent({
          key: 'canvas',
          value: this.getCanvasFp()
        })
      }
      return keys
    },
    webglKey: function (keys) {
      if (!this.options.excludeWebGL && this.isWebGlSupported()) {
        keys.addPreprocessedComponent({
          key: 'webgl',
          value: this.getWebglFp()
        })
      }
      return keys
    },
    webglVendorAndRendererKey: function (keys) {
      if (!this.options.excludeWebGLVendorAndRenderer && this.isWebGlSupported()) {
        keys.addPreprocessedComponent({
          key: 'webgl_vendor',
          value: this.getWebglVendorAndRenderer()
        })
      }
      return keys
    },
    adBlockKey: function (keys) {
      if (!this.options.excludeAdBlock) {
        keys.addPreprocessedComponent({
          key: 'adblock',
          value: this.getAdBlock()
        })
      }
      return keys
    },
    hasLiedLanguagesKey: function (keys) {
      if (!this.options.excludeHasLiedLanguages) {
        keys.addPreprocessedComponent({
          key: 'has_lied_languages',
          value: this.getHasLiedLanguages()
        })
      }
      return keys
    },
    hasLiedResolutionKey: function (keys) {
      if (!this.options.excludeHasLiedResolution) {
        keys.addPreprocessedComponent({
          key: 'has_lied_resolution',
          value: this.getHasLiedResolution()
        })
      }
      return keys
    },
    hasLiedOsKey: function (keys) {
      if (!this.options.excludeHasLiedOs) {
        keys.addPreprocessedComponent({
          key: 'has_lied_os',
          value: this.getHasLiedOs()
        })
      }
      return keys
    },
    hasLiedBrowserKey: function (keys) {
      if (!this.options.excludeHasLiedBrowser) {
        keys.addPreprocessedComponent({
          key: 'has_lied_browser',
          value: this.getHasLiedBrowser()
        })
      }
      return keys
    },
    fontsKey: function (keys, done) {
      if (this.options.excludeJsFonts) {
        return this.flashFontsKey(keys, done)
      }
      return this.jsFontsKey(keys, done)
    },
    // flash fonts (will increase fingerprinting time 20X to ~ 130-150ms)
    flashFontsKey: function (keys, done) {
      if (this.options.excludeFlashFonts) {
        return done(keys)
      }
      // we do flash if swfobject is loaded
      if (!this.hasSwfObjectLoaded()) {
        return done(keys)
      }
      if (!this.hasMinFlashInstalled()) {
        return done(keys)
      }
      if (typeof this.options.swfPath === 'undefined') {
        return done(keys)
      }
      this.loadSwfAndDetectFonts(function (fonts) {
        keys.addPreprocessedComponent({
          key: 'swf_fonts',
          value: fonts.join(';')
        })
        done(keys)
      })
    },
    // kudos to http://www.lalit.org/lab/javascript-css-font-detect/
    jsFontsKey: function (keys, done) {
      var that = this
      // doing js fonts detection in a pseudo-async fashion
      return setTimeout(function () {
        // a font will be compared against all the three default fonts.
        // and if it doesn't match all 3 then that font is not available.
        var baseFonts = ['monospace', 'sans-serif', 'serif']

        var fontList = [
          'Andale Mono', 'Arial', 'Arial Black', 'Arial Hebrew', 'Arial MT', 'Arial Narrow', 'Arial Rounded MT Bold', 'Arial Unicode MS',
          'Bitstream Vera Sans Mono', 'Book Antiqua', 'Bookman Old Style',
          'Calibri', 'Cambria', 'Cambria Math', 'Century', 'Century Gothic', 'Century Schoolbook', 'Comic Sans', 'Comic Sans MS', 'Consolas', 'Courier', 'Courier New',
          'Garamond', 'Geneva', 'Georgia',
          'Helvetica', 'Helvetica Neue',
          'Impact',
          'Lucida Bright', 'Lucida Calligraphy', 'Lucida Console', 'Lucida Fax', 'LUCIDA GRANDE', 'Lucida Handwriting', 'Lucida Sans', 'Lucida Sans Typewriter', 'Lucida Sans Unicode',
          'Microsoft Sans Serif', 'Monaco', 'Monotype Corsiva', 'MS Gothic', 'MS Outlook', 'MS PGothic', 'MS Reference Sans Serif', 'MS Sans Serif', 'MS Serif', 'MYRIAD', 'MYRIAD PRO',
          'Palatino', 'Palatino Linotype',
          'Segoe Print', 'Segoe Script', 'Segoe UI', 'Segoe UI Light', 'Segoe UI Semibold', 'Segoe UI Symbol',
          'Tahoma', 'Times', 'Times New Roman', 'Times New Roman PS', 'Trebuchet MS',
          'Verdana', 'Wingdings', 'Wingdings 2', 'Wingdings 3'
        ]
        var extendedFontList = [
          'Abadi MT Condensed Light', 'Academy Engraved LET', 'ADOBE CASLON PRO', 'Adobe Garamond', 'ADOBE GARAMOND PRO', 'Agency FB', 'Aharoni', 'Albertus Extra Bold', 'Albertus Medium', 'Algerian', 'Amazone BT', 'American Typewriter',
          'American Typewriter Condensed', 'AmerType Md BT', 'Andalus', 'Angsana New', 'AngsanaUPC', 'Antique Olive', 'Aparajita', 'Apple Chancery', 'Apple Color Emoji', 'Apple SD Gothic Neo', 'Arabic Typesetting', 'ARCHER',
          'ARNO PRO', 'Arrus BT', 'Aurora Cn BT', 'AvantGarde Bk BT', 'AvantGarde Md BT', 'AVENIR', 'Ayuthaya', 'Bandy', 'Bangla Sangam MN', 'Bank Gothic', 'BankGothic Md BT', 'Baskerville',
          'Baskerville Old Face', 'Batang', 'BatangChe', 'Bauer Bodoni', 'Bauhaus 93', 'Bazooka', 'Bell MT', 'Bembo', 'Benguiat Bk BT', 'Berlin Sans FB', 'Berlin Sans FB Demi', 'Bernard MT Condensed', 'BernhardFashion BT', 'BernhardMod BT', 'Big Caslon', 'BinnerD',
          'Blackadder ITC', 'BlairMdITC TT', 'Bodoni 72', 'Bodoni 72 Oldstyle', 'Bodoni 72 Smallcaps', 'Bodoni MT', 'Bodoni MT Black', 'Bodoni MT Condensed', 'Bodoni MT Poster Compressed',
          'Bookshelf Symbol 7', 'Boulder', 'Bradley Hand', 'Bradley Hand ITC', 'Bremen Bd BT', 'Britannic Bold', 'Broadway', 'Browallia New', 'BrowalliaUPC', 'Brush Script MT', 'Californian FB', 'Calisto MT', 'Calligrapher', 'Candara',
          'CaslonOpnface BT', 'Castellar', 'Centaur', 'Cezanne', 'CG Omega', 'CG Times', 'Chalkboard', 'Chalkboard SE', 'Chalkduster', 'Charlesworth', 'Charter Bd BT', 'Charter BT', 'Chaucer',
          'ChelthmITC Bk BT', 'Chiller', 'Clarendon', 'Clarendon Condensed', 'CloisterBlack BT', 'Cochin', 'Colonna MT', 'Constantia', 'Cooper Black', 'Copperplate', 'Copperplate Gothic', 'Copperplate Gothic Bold',
          'Copperplate Gothic Light', 'CopperplGoth Bd BT', 'Corbel', 'Cordia New', 'CordiaUPC', 'Cornerstone', 'Coronet', 'Cuckoo', 'Curlz MT', 'DaunPenh', 'Dauphin', 'David', 'DB LCD Temp', 'DELICIOUS', 'Denmark',
          'DFKai-SB', 'Didot', 'DilleniaUPC', 'DIN', 'DokChampa', 'Dotum', 'DotumChe', 'Ebrima', 'Edwardian Script ITC', 'Elephant', 'English 111 Vivace BT', 'Engravers MT', 'EngraversGothic BT', 'Eras Bold ITC', 'Eras Demi ITC', 'Eras Light ITC', 'Eras Medium ITC',
          'EucrosiaUPC', 'Euphemia', 'Euphemia UCAS', 'EUROSTILE', 'Exotc350 Bd BT', 'FangSong', 'Felix Titling', 'Fixedsys', 'FONTIN', 'Footlight MT Light', 'Forte',
          'FrankRuehl', 'Fransiscan', 'Freefrm721 Blk BT', 'FreesiaUPC', 'Freestyle Script', 'French Script MT', 'FrnkGothITC Bk BT', 'Fruitger', 'FRUTIGER',
          'Futura', 'Futura Bk BT', 'Futura Lt BT', 'Futura Md BT', 'Futura ZBlk BT', 'FuturaBlack BT', 'Gabriola', 'Galliard BT', 'Gautami', 'Geeza Pro', 'Geometr231 BT', 'Geometr231 Hv BT', 'Geometr231 Lt BT', 'GeoSlab 703 Lt BT',
          'GeoSlab 703 XBd BT', 'Gigi', 'Gill Sans', 'Gill Sans MT', 'Gill Sans MT Condensed', 'Gill Sans MT Ext Condensed Bold', 'Gill Sans Ultra Bold', 'Gill Sans Ultra Bold Condensed', 'Gisha', 'Gloucester MT Extra Condensed', 'GOTHAM', 'GOTHAM BOLD',
          'Goudy Old Style', 'Goudy Stout', 'GoudyHandtooled BT', 'GoudyOLSt BT', 'Gujarati Sangam MN', 'Gulim', 'GulimChe', 'Gungsuh', 'GungsuhChe', 'Gurmukhi MN', 'Haettenschweiler', 'Harlow Solid Italic', 'Harrington', 'Heather', 'Heiti SC', 'Heiti TC', 'HELV',
          'Herald', 'High Tower Text', 'Hiragino Kaku Gothic ProN', 'Hiragino Mincho ProN', 'Hoefler Text', 'Humanst 521 Cn BT', 'Humanst521 BT', 'Humanst521 Lt BT', 'Imprint MT Shadow', 'Incised901 Bd BT', 'Incised901 BT',
          'Incised901 Lt BT', 'INCONSOLATA', 'Informal Roman', 'Informal011 BT', 'INTERSTATE', 'IrisUPC', 'Iskoola Pota', 'JasmineUPC', 'Jazz LET', 'Jenson', 'Jester', 'Jokerman', 'Juice ITC', 'Kabel Bk BT', 'Kabel Ult BT', 'Kailasa', 'KaiTi', 'Kalinga', 'Kannada Sangam MN',
          'Kartika', 'Kaufmann Bd BT', 'Kaufmann BT', 'Khmer UI', 'KodchiangUPC', 'Kokila', 'Korinna BT', 'Kristen ITC', 'Krungthep', 'Kunstler Script', 'Lao UI', 'Latha', 'Leelawadee', 'Letter Gothic', 'Levenim MT', 'LilyUPC', 'Lithograph', 'Lithograph Light', 'Long Island',
          'Lydian BT', 'Magneto', 'Maiandra GD', 'Malayalam Sangam MN', 'Malgun Gothic',
          'Mangal', 'Marigold', 'Marion', 'Marker Felt', 'Market', 'Marlett', 'Matisse ITC', 'Matura MT Script Capitals', 'Meiryo', 'Meiryo UI', 'Microsoft Himalaya', 'Microsoft JhengHei', 'Microsoft New Tai Lue', 'Microsoft PhagsPa', 'Microsoft Tai Le',
          'Microsoft Uighur', 'Microsoft YaHei', 'Microsoft Yi Baiti', 'MingLiU', 'MingLiU_HKSCS', 'MingLiU_HKSCS-ExtB', 'MingLiU-ExtB', 'Minion', 'Minion Pro', 'Miriam', 'Miriam Fixed', 'Mistral', 'Modern', 'Modern No. 20', 'Mona Lisa Solid ITC TT', 'Mongolian Baiti',
          'MONO', 'MoolBoran', 'Mrs Eaves', 'MS LineDraw', 'MS Mincho', 'MS PMincho', 'MS Reference Specialty', 'MS UI Gothic', 'MT Extra', 'MUSEO', 'MV Boli',
          'Nadeem', 'Narkisim', 'NEVIS', 'News Gothic', 'News GothicMT', 'NewsGoth BT', 'Niagara Engraved', 'Niagara Solid', 'Noteworthy', 'NSimSun', 'Nyala', 'OCR A Extended', 'Old Century', 'Old English Text MT', 'Onyx', 'Onyx BT', 'OPTIMA', 'Oriya Sangam MN',
          'OSAKA', 'OzHandicraft BT', 'Palace Script MT', 'Papyrus', 'Parchment', 'Party LET', 'Pegasus', 'Perpetua', 'Perpetua Titling MT', 'PetitaBold', 'Pickwick', 'Plantagenet Cherokee', 'Playbill', 'PMingLiU', 'PMingLiU-ExtB',
          'Poor Richard', 'Poster', 'PosterBodoni BT', 'PRINCETOWN LET', 'Pristina', 'PTBarnum BT', 'Pythagoras', 'Raavi', 'Rage Italic', 'Ravie', 'Ribbon131 Bd BT', 'Rockwell', 'Rockwell Condensed', 'Rockwell Extra Bold', 'Rod', 'Roman', 'Sakkal Majalla',
          'Santa Fe LET', 'Savoye LET', 'Sceptre', 'Script', 'Script MT Bold', 'SCRIPTINA', 'Serifa', 'Serifa BT', 'Serifa Th BT', 'ShelleyVolante BT', 'Sherwood',
          'Shonar Bangla', 'Showcard Gothic', 'Shruti', 'Signboard', 'SILKSCREEN', 'SimHei', 'Simplified Arabic', 'Simplified Arabic Fixed', 'SimSun', 'SimSun-ExtB', 'Sinhala Sangam MN', 'Sketch Rockwell', 'Skia', 'Small Fonts', 'Snap ITC', 'Snell Roundhand', 'Socket',
          'Souvenir Lt BT', 'Staccato222 BT', 'Steamer', 'Stencil', 'Storybook', 'Styllo', 'Subway', 'Swis721 BlkEx BT', 'Swiss911 XCm BT', 'Sylfaen', 'Synchro LET', 'System', 'Tamil Sangam MN', 'Technical', 'Teletype', 'Telugu Sangam MN', 'Tempus Sans ITC',
          'Terminal', 'Thonburi', 'Traditional Arabic', 'Trajan', 'TRAJAN PRO', 'Tristan', 'Tubular', 'Tunga', 'Tw Cen MT', 'Tw Cen MT Condensed', 'Tw Cen MT Condensed Extra Bold',
          'TypoUpright BT', 'Unicorn', 'Univers', 'Univers CE 55 Medium', 'Univers Condensed', 'Utsaah', 'Vagabond', 'Vani', 'Vijaya', 'Viner Hand ITC', 'VisualUI', 'Vivaldi', 'Vladimir Script', 'Vrinda', 'Westminster', 'WHITNEY', 'Wide Latin',
          'ZapfEllipt BT', 'ZapfHumnst BT', 'ZapfHumnst Dm BT', 'Zapfino', 'Zurich BlkEx BT', 'Zurich Ex BT', 'ZWAdobeF'
        ]

        if (that.options.extendedJsFonts) {
          fontList = fontList.concat(extendedFontList)
        }

        fontList = fontList.concat(that.options.userDefinedFonts)

        // we use m or w because these two characters take up the maximum width.
        // And we use a LLi so that the same matching fonts can get separated
        var testString = 'mmmmmmmmmmlli'

        // we test using 72px font size, we may use any size. I guess larger the better.
        var testSize = '72px'

        var h = document.getElementsByTagName('body')[0]

        // div to load spans for the base fonts
        var baseFontsDiv = document.createElement('div')

        // div to load spans for the fonts to detect
        var fontsDiv = document.createElement('div')

        var defaultWidth = {}
        var defaultHeight = {}

        // creates a span where the fonts will be loaded
        var createSpan = function () {
          var s = document.createElement('span')
          /*
                     * We need this css as in some weird browser this
                     * span elements shows up for a microSec which creates a
                     * bad user experience
                     */
          s.style.position = 'absolute'
          s.style.left = '-9999px'
          s.style.fontSize = testSize
          s.style.lineHeight = 'normal'
          s.innerHTML = testString
          return s
        }

        // creates a span and load the font to detect and a base font for fallback
        var createSpanWithFonts = function (fontToDetect, baseFont) {
          var s = createSpan()
          s.style.fontFamily = '\'' + fontToDetect + '\',' + baseFont
          return s
        }

        // creates spans for the base fonts and adds them to baseFontsDiv
        var initializeBaseFontsSpans = function () {
          var spans = []
          for (var index = 0, length = baseFonts.length; index < length; index++) {
            var s = createSpan()
            s.style.fontFamily = baseFonts[index]
            baseFontsDiv.appendChild(s)
            spans.push(s)
          }
          return spans
        }

        // creates spans for the fonts to detect and adds them to fontsDiv
        var initializeFontsSpans = function () {
          var spans = {}
          for (var i = 0, l = fontList.length; i < l; i++) {
            var fontSpans = []
            for (var j = 0, numDefaultFonts = baseFonts.length; j < numDefaultFonts; j++) {
              var s = createSpanWithFonts(fontList[i], baseFonts[j])
              fontsDiv.appendChild(s)
              fontSpans.push(s)
            }
            spans[fontList[i]] = fontSpans // Stores {fontName : [spans for that font]}
          }
          return spans
        }

        // checks if a font is available
        var isFontAvailable = function (fontSpans) {
          var detected = false
          for (var i = 0; i < baseFonts.length; i++) {
            detected = (fontSpans[i].offsetWidth !== defaultWidth[baseFonts[i]] || fontSpans[i].offsetHeight !== defaultHeight[baseFonts[i]])
            if (detected) {
              return detected
            }
          }
          return detected
        }

        // create spans for base fonts
        var baseFontsSpans = initializeBaseFontsSpans()

        // add the spans to the DOM
        h.appendChild(baseFontsDiv)

        // get the default width for the three base fonts
        for (var index = 0, length = baseFonts.length; index < length; index++) {
          defaultWidth[baseFonts[index]] = baseFontsSpans[index].offsetWidth // width for the default font
          defaultHeight[baseFonts[index]] = baseFontsSpans[index].offsetHeight // height for the default font
        }

        // create spans for fonts to detect
        var fontsSpans = initializeFontsSpans()

        // add all the spans to the DOM
        h.appendChild(fontsDiv)

        // check available fonts
        var available = []
        for (var i = 0, l = fontList.length; i < l; i++) {
          if (isFontAvailable(fontsSpans[fontList[i]])) {
            available.push(fontList[i])
          }
        }

        // remove spans from DOM
        h.removeChild(fontsDiv)
        h.removeChild(baseFontsDiv)

        keys.addPreprocessedComponent({
          key: 'js_fonts',
          value: available
        })
        done(keys)
      }, 1)
    },
    pluginsKey: function (keys) {
      if (!this.options.excludePlugins) {
        if (this.isIE()) {
          if (!this.options.excludeIEPlugins) {
            keys.addPreprocessedComponent({
              key: 'ie_plugins',
              value: this.getIEPlugins()
            })
          }
        } else {
          keys.addPreprocessedComponent({
            key: 'regular_plugins',
            value: this.getRegularPlugins()
          })
        }
      }
      return keys
    },
    getRegularPlugins: function () {
      var plugins = []
      if (navigator.plugins) {
        // plugins isn't defined in Node envs.
        for (var i = 0, l = navigator.plugins.length; i < l; i++) {
          if (navigator.plugins[i]) {
            plugins.push(navigator.plugins[i])
          }
        }
      }
      // sorting plugins only for those user agents, that we know randomize the plugins
      // every time we try to enumerate them
      if (this.pluginsShouldBeSorted()) {
        plugins = plugins.sort(function (a, b) {
          if (a.name > b.name) {
            return 1
          }
          if (a.name < b.name) {
            return -1
          }
          return 0
        })
      }
      return this.map(plugins, function (p) {
        var mimeTypes = this.map(p, function (mt) {
          return [mt.type, mt.suffixes].join('~')
        }).join(',')
        return [p.name, p.description, mimeTypes].join('::')
      }, this)
    },
    getIEPlugins: function () {
      var result = []
      if ((Object.getOwnPropertyDescriptor && Object.getOwnPropertyDescriptor(window, 'ActiveXObject')) || ('ActiveXObject' in window)) {
        var names = [
          'AcroPDF.PDF', // Adobe PDF reader 7+
          'Adodb.Stream',
          'AgControl.AgControl', // Silverlight
          'DevalVRXCtrl.DevalVRXCtrl.1',
          'MacromediaFlashPaper.MacromediaFlashPaper',
          'Msxml2.DOMDocument',
          'Msxml2.XMLHTTP',
          'PDF.PdfCtrl', // Adobe PDF reader 6 and earlier, brrr
          'QuickTime.QuickTime', // QuickTime
          'QuickTimeCheckObject.QuickTimeCheck.1',
          'RealPlayer',
          'RealPlayer.RealPlayer(tm) ActiveX Control (32-bit)',
          'RealVideo.RealVideo(tm) ActiveX Control (32-bit)',
          'Scripting.Dictionary',
          'SWCtl.SWCtl', // ShockWave player
          'Shell.UIHelper',
          'ShockwaveFlash.ShockwaveFlash', // flash plugin
          'Skype.Detection',
          'TDCCtl.TDCCtl',
          'WMPlayer.OCX', // Windows media player
          'rmocx.RealPlayer G2 Control',
          'rmocx.RealPlayer G2 Control.1'
        ]
        // starting to detect plugins in IE
        result = this.map(names, function (name) {
          try {
            // eslint-disable-next-line no-new
            new window.ActiveXObject(name)
            return name
          } catch (e) {
            return null
          }
        })
      }
      if (navigator.plugins) {
        result = result.concat(this.getRegularPlugins())
      }
      return result
    },
    pluginsShouldBeSorted: function () {
      var should = false
      for (var i = 0, l = this.options.sortPluginsFor.length; i < l; i++) {
        var re = this.options.sortPluginsFor[i]
        if (navigator.userAgent.match(re)) {
          should = true
          break
        }
      }
      return should
    },
    touchSupportKey: function (keys) {
      if (!this.options.excludeTouchSupport) {
        keys.addPreprocessedComponent({
          key: 'touch_support',
          value: this.getTouchSupport()
        })
      }
      return keys
    },
    hardwareConcurrencyKey: function (keys) {
      if (!this.options.excludeHardwareConcurrency) {
        keys.addPreprocessedComponent({
          key: 'hardware_concurrency',
          value: this.getHardwareConcurrency()
        })
      }
      return keys
    },
    hasSessionStorage: function () {
      try {
        return !!window.sessionStorage
      } catch (e) {
        return true // SecurityError when referencing it means it exists
      }
    },
    // https://bugzilla.mozilla.org/show_bug.cgi?id=781447
    hasLocalStorage: function () {
      try {
        return !!window.localStorage
      } catch (e) {
        return true // SecurityError when referencing it means it exists
      }
    },
    hasIndexedDB: function () {
      try {
        return !!window.indexedDB
      } catch (e) {
        return true // SecurityError when referencing it means it exists
      }
    },
    getHardwareConcurrency: function () {
      if (navigator.hardwareConcurrency) {
        return navigator.hardwareConcurrency
      }
      return 'unknown'
    },
    getNavigatorCpuClass: function () {
      if (navigator.cpuClass) {
        return navigator.cpuClass
      } else {
        return 'unknown'
      }
    },
    getNavigatorPlatform: function () {
      if (navigator.platform) {
        return navigator.platform
      } else {
        return 'unknown'
      }
    },
    getDoNotTrack: function () {
      if (navigator.doNotTrack) {
        return navigator.doNotTrack
      } else if (navigator.msDoNotTrack) {
        return navigator.msDoNotTrack
      } else if (window.doNotTrack) {
        return window.doNotTrack
      } else {
        return 'unknown'
      }
    },
    // This is a crude and primitive touch screen detection.
    // It's not possible to currently reliably detect the  availability of a touch screen
    // with a JS, without actually subscribing to a touch event.
    // http://www.stucox.com/blog/you-cant-detect-a-touchscreen/
    // https://github.com/Modernizr/Modernizr/issues/548
    // method returns an array of 3 values:
    // maxTouchPoints, the success or failure of creating a TouchEvent,
    // and the availability of the 'ontouchstart' property
    getTouchSupport: function () {
      var maxTouchPoints = 0
      var touchEvent = false
      if (typeof navigator.maxTouchPoints !== 'undefined') {
        maxTouchPoints = navigator.maxTouchPoints
      } else if (typeof navigator.msMaxTouchPoints !== 'undefined') {
        maxTouchPoints = navigator.msMaxTouchPoints
      }
      try {
        document.createEvent('TouchEvent')
        touchEvent = true
      } catch (_) { /* squelch */ }
      var touchStart = 'ontouchstart' in window
      return [maxTouchPoints, touchEvent, touchStart]
    },
    // https://www.browserleaks.com/canvas#how-does-it-work
    getCanvasFp: function () {
      var result = []
      // Very simple now, need to make it more complex (geo shapes etc)
      var canvas = document.createElement('canvas')
      canvas.width = 2000
      canvas.height = 200
      canvas.style.display = 'inline'
      var ctx = canvas.getContext('2d')
      // detect browser support of canvas winding
      // http://blogs.adobe.com/webplatform/2013/01/30/winding-rules-in-canvas/
      // https://github.com/Modernizr/Modernizr/blob/master/feature-detects/canvas/winding.js
      ctx.rect(0, 0, 10, 10)
      ctx.rect(2, 2, 6, 6)
      result.push('canvas winding:' + ((ctx.isPointInPath(5, 5, 'evenodd') === false) ? 'yes' : 'no'))

      ctx.textBaseline = 'alphabetic'
      ctx.fillStyle = '#f60'
      ctx.fillRect(125, 1, 62, 20)
      ctx.fillStyle = '#069'
      // https://github.com/Valve/fingerprintjs2/issues/66
      if (this.options.dontUseFakeFontInCanvas) {
        ctx.font = '11pt Arial'
      } else {
        ctx.font = '11pt no-real-font-123'
      }
      ctx.fillText('Cwm fjordbank glyphs vext quiz, \ud83d\ude03', 2, 15)
      ctx.fillStyle = 'rgba(102, 204, 0, 0.2)'
      ctx.font = '18pt Arial'
      ctx.fillText('Cwm fjordbank glyphs vext quiz, \ud83d\ude03', 4, 45)

      // canvas blending
      // http://blogs.adobe.com/webplatform/2013/01/28/blending-features-in-canvas/
      // http://jsfiddle.net/NDYV8/16/
      ctx.globalCompositeOperation = 'multiply'
      ctx.fillStyle = 'rgb(255,0,255)'
      ctx.beginPath()
      ctx.arc(50, 50, 50, 0, Math.PI * 2, true)
      ctx.closePath()
      ctx.fill()
      ctx.fillStyle = 'rgb(0,255,255)'
      ctx.beginPath()
      ctx.arc(100, 50, 50, 0, Math.PI * 2, true)
      ctx.closePath()
      ctx.fill()
      ctx.fillStyle = 'rgb(255,255,0)'
      ctx.beginPath()
      ctx.arc(75, 100, 50, 0, Math.PI * 2, true)
      ctx.closePath()
      ctx.fill()
      ctx.fillStyle = 'rgb(255,0,255)'
      // canvas winding
      // http://blogs.adobe.com/webplatform/2013/01/30/winding-rules-in-canvas/
      // http://jsfiddle.net/NDYV8/19/
      ctx.arc(75, 75, 75, 0, Math.PI * 2, true)
      ctx.arc(75, 75, 25, 0, Math.PI * 2, true)
      ctx.fill('evenodd')

      if (canvas.toDataURL) {
        result.push('canvas fp:' + canvas.toDataURL())
      }
      return result.join('~')
    },

    getWebglFp: function () {
      var gl
      var fa2s = function (fa) {
        gl.clearColor(0.0, 0.0, 0.0, 1.0)
        gl.enable(gl.DEPTH_TEST)
        gl.depthFunc(gl.LEQUAL)
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
        return '[' + fa[0] + ', ' + fa[1] + ']'
      }
      var maxAnisotropy = function (gl) {
        var ext = gl.getExtension('EXT_texture_filter_anisotropic') || gl.getExtension('WEBKIT_EXT_texture_filter_anisotropic') || gl.getExtension('MOZ_EXT_texture_filter_anisotropic')
        if (ext) {
          var anisotropy = gl.getParameter(ext.MAX_TEXTURE_MAX_ANISOTROPY_EXT)
          if (anisotropy === 0) {
            anisotropy = 2
          }
          return anisotropy
        } else {
          return null
        }
      }
      gl = this.getWebglCanvas()
      if (!gl) {
        return null
      }
      // WebGL fingerprinting is a combination of techniques, found in MaxMind antifraud script & Augur fingerprinting.
      // First it draws a gradient object with shaders and convers the image to the Base64 string.
      // Then it enumerates all WebGL extensions & capabilities and appends them to the Base64 string, resulting in a huge WebGL string, potentially very unique on each device
      // Since iOS supports webgl starting from version 8.1 and 8.1 runs on several graphics chips, the results may be different across ios devices, but we need to verify it.
      var result = []
      var vShaderTemplate = 'attribute vec2 attrVertex;varying vec2 varyinTexCoordinate;uniform vec2 uniformOffset;void main(){varyinTexCoordinate=attrVertex+uniformOffset;gl_Position=vec4(attrVertex,0,1);}'
      var fShaderTemplate = 'precision mediump float;varying vec2 varyinTexCoordinate;void main() {gl_FragColor=vec4(varyinTexCoordinate,0,1);}'
      var vertexPosBuffer = gl.createBuffer()
      gl.bindBuffer(gl.ARRAY_BUFFER, vertexPosBuffer)
      var vertices = new Float32Array([-0.2, -0.9, 0, 0.4, -0.26, 0, 0, 0.732134444, 0])
      gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW)
      vertexPosBuffer.itemSize = 3
      vertexPosBuffer.numItems = 3
      var program = gl.createProgram()
      var vshader = gl.createShader(gl.VERTEX_SHADER)
      gl.shaderSource(vshader, vShaderTemplate)
      gl.compileShader(vshader)
      var fshader = gl.createShader(gl.FRAGMENT_SHADER)
      gl.shaderSource(fshader, fShaderTemplate)
      gl.compileShader(fshader)
      gl.attachShader(program, vshader)
      gl.attachShader(program, fshader)
      gl.linkProgram(program)
      gl.useProgram(program)
      program.vertexPosAttrib = gl.getAttribLocation(program, 'attrVertex')
      program.offsetUniform = gl.getUniformLocation(program, 'uniformOffset')
      gl.enableVertexAttribArray(program.vertexPosArray)
      gl.vertexAttribPointer(program.vertexPosAttrib, vertexPosBuffer.itemSize, gl.FLOAT, !1, 0, 0)
      gl.uniform2f(program.offsetUniform, 1, 1)
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, vertexPosBuffer.numItems)
      try {
        result.push(gl.canvas.toDataURL())
      } catch (e) {
        /* .toDataURL may be absent or broken (blocked by extension) */
      }
      result.push('extensions:' + (gl.getSupportedExtensions() || []).join(';'))
      result.push('webgl aliased line width range:' + fa2s(gl.getParameter(gl.ALIASED_LINE_WIDTH_RANGE)))
      result.push('webgl aliased point size range:' + fa2s(gl.getParameter(gl.ALIASED_POINT_SIZE_RANGE)))
      result.push('webgl alpha bits:' + gl.getParameter(gl.ALPHA_BITS))
      result.push('webgl antialiasing:' + (gl.getContextAttributes().antialias ? 'yes' : 'no'))
      result.push('webgl blue bits:' + gl.getParameter(gl.BLUE_BITS))
      result.push('webgl depth bits:' + gl.getParameter(gl.DEPTH_BITS))
      result.push('webgl green bits:' + gl.getParameter(gl.GREEN_BITS))
      result.push('webgl max anisotropy:' + maxAnisotropy(gl))
      result.push('webgl max combined texture image units:' + gl.getParameter(gl.MAX_COMBINED_TEXTURE_IMAGE_UNITS))
      result.push('webgl max cube map texture size:' + gl.getParameter(gl.MAX_CUBE_MAP_TEXTURE_SIZE))
      result.push('webgl max fragment uniform vectors:' + gl.getParameter(gl.MAX_FRAGMENT_UNIFORM_VECTORS))
      result.push('webgl max render buffer size:' + gl.getParameter(gl.MAX_RENDERBUFFER_SIZE))
      result.push('webgl max texture image units:' + gl.getParameter(gl.MAX_TEXTURE_IMAGE_UNITS))
      result.push('webgl max texture size:' + gl.getParameter(gl.MAX_TEXTURE_SIZE))
      result.push('webgl max varying vectors:' + gl.getParameter(gl.MAX_VARYING_VECTORS))
      result.push('webgl max vertex attribs:' + gl.getParameter(gl.MAX_VERTEX_ATTRIBS))
      result.push('webgl max vertex texture image units:' + gl.getParameter(gl.MAX_VERTEX_TEXTURE_IMAGE_UNITS))
      result.push('webgl max vertex uniform vectors:' + gl.getParameter(gl.MAX_VERTEX_UNIFORM_VECTORS))
      result.push('webgl max viewport dims:' + fa2s(gl.getParameter(gl.MAX_VIEWPORT_DIMS)))
      result.push('webgl red bits:' + gl.getParameter(gl.RED_BITS))
      result.push('webgl renderer:' + gl.getParameter(gl.RENDERER))
      result.push('webgl shading language version:' + gl.getParameter(gl.SHADING_LANGUAGE_VERSION))
      result.push('webgl stencil bits:' + gl.getParameter(gl.STENCIL_BITS))
      result.push('webgl vendor:' + gl.getParameter(gl.VENDOR))
      result.push('webgl version:' + gl.getParameter(gl.VERSION))

      try {
        // Add the unmasked vendor and unmasked renderer if the debug_renderer_info extension is available
        var extensionDebugRendererInfo = gl.getExtension('WEBGL_debug_renderer_info')
        if (extensionDebugRendererInfo) {
          result.push('webgl unmasked vendor:' + gl.getParameter(extensionDebugRendererInfo.UNMASKED_VENDOR_WEBGL))
          result.push('webgl unmasked renderer:' + gl.getParameter(extensionDebugRendererInfo.UNMASKED_RENDERER_WEBGL))
        }
      } catch (e) { /* squelch */ }

      if (!gl.getShaderPrecisionFormat) {
        return result.join('~')
      }

      result.push('webgl vertex shader high float precision:' + gl.getShaderPrecisionFormat(gl.VERTEX_SHADER, gl.HIGH_FLOAT).precision)
      result.push('webgl vertex shader high float precision rangeMin:' + gl.getShaderPrecisionFormat(gl.VERTEX_SHADER, gl.HIGH_FLOAT).rangeMin)
      result.push('webgl vertex shader high float precision rangeMax:' + gl.getShaderPrecisionFormat(gl.VERTEX_SHADER, gl.HIGH_FLOAT).rangeMax)
      result.push('webgl vertex shader medium float precision:' + gl.getShaderPrecisionFormat(gl.VERTEX_SHADER, gl.MEDIUM_FLOAT).precision)
      result.push('webgl vertex shader medium float precision rangeMin:' + gl.getShaderPrecisionFormat(gl.VERTEX_SHADER, gl.MEDIUM_FLOAT).rangeMin)
      result.push('webgl vertex shader medium float precision rangeMax:' + gl.getShaderPrecisionFormat(gl.VERTEX_SHADER, gl.MEDIUM_FLOAT).rangeMax)
      result.push('webgl vertex shader low float precision:' + gl.getShaderPrecisionFormat(gl.VERTEX_SHADER, gl.LOW_FLOAT).precision)
      result.push('webgl vertex shader low float precision rangeMin:' + gl.getShaderPrecisionFormat(gl.VERTEX_SHADER, gl.LOW_FLOAT).rangeMin)
      result.push('webgl vertex shader low float precision rangeMax:' + gl.getShaderPrecisionFormat(gl.VERTEX_SHADER, gl.LOW_FLOAT).rangeMax)
      result.push('webgl fragment shader high float precision:' + gl.getShaderPrecisionFormat(gl.FRAGMENT_SHADER, gl.HIGH_FLOAT).precision)
      result.push('webgl fragment shader high float precision rangeMin:' + gl.getShaderPrecisionFormat(gl.FRAGMENT_SHADER, gl.HIGH_FLOAT).rangeMin)
      result.push('webgl fragment shader high float precision rangeMax:' + gl.getShaderPrecisionFormat(gl.FRAGMENT_SHADER, gl.HIGH_FLOAT).rangeMax)
      result.push('webgl fragment shader medium float precision:' + gl.getShaderPrecisionFormat(gl.FRAGMENT_SHADER, gl.MEDIUM_FLOAT).precision)
      result.push('webgl fragment shader medium float precision rangeMin:' + gl.getShaderPrecisionFormat(gl.FRAGMENT_SHADER, gl.MEDIUM_FLOAT).rangeMin)
      result.push('webgl fragment shader medium float precision rangeMax:' + gl.getShaderPrecisionFormat(gl.FRAGMENT_SHADER, gl.MEDIUM_FLOAT).rangeMax)
      result.push('webgl fragment shader low float precision:' + gl.getShaderPrecisionFormat(gl.FRAGMENT_SHADER, gl.LOW_FLOAT).precision)
      result.push('webgl fragment shader low float precision rangeMin:' + gl.getShaderPrecisionFormat(gl.FRAGMENT_SHADER, gl.LOW_FLOAT).rangeMin)
      result.push('webgl fragment shader low float precision rangeMax:' + gl.getShaderPrecisionFormat(gl.FRAGMENT_SHADER, gl.LOW_FLOAT).rangeMax)
      result.push('webgl vertex shader high int precision:' + gl.getShaderPrecisionFormat(gl.VERTEX_SHADER, gl.HIGH_INT).precision)
      result.push('webgl vertex shader high int precision rangeMin:' + gl.getShaderPrecisionFormat(gl.VERTEX_SHADER, gl.HIGH_INT).rangeMin)
      result.push('webgl vertex shader high int precision rangeMax:' + gl.getShaderPrecisionFormat(gl.VERTEX_SHADER, gl.HIGH_INT).rangeMax)
      result.push('webgl vertex shader medium int precision:' + gl.getShaderPrecisionFormat(gl.VERTEX_SHADER, gl.MEDIUM_INT).precision)
      result.push('webgl vertex shader medium int precision rangeMin:' + gl.getShaderPrecisionFormat(gl.VERTEX_SHADER, gl.MEDIUM_INT).rangeMin)
      result.push('webgl vertex shader medium int precision rangeMax:' + gl.getShaderPrecisionFormat(gl.VERTEX_SHADER, gl.MEDIUM_INT).rangeMax)
      result.push('webgl vertex shader low int precision:' + gl.getShaderPrecisionFormat(gl.VERTEX_SHADER, gl.LOW_INT).precision)
      result.push('webgl vertex shader low int precision rangeMin:' + gl.getShaderPrecisionFormat(gl.VERTEX_SHADER, gl.LOW_INT).rangeMin)
      result.push('webgl vertex shader low int precision rangeMax:' + gl.getShaderPrecisionFormat(gl.VERTEX_SHADER, gl.LOW_INT).rangeMax)
      result.push('webgl fragment shader high int precision:' + gl.getShaderPrecisionFormat(gl.FRAGMENT_SHADER, gl.HIGH_INT).precision)
      result.push('webgl fragment shader high int precision rangeMin:' + gl.getShaderPrecisionFormat(gl.FRAGMENT_SHADER, gl.HIGH_INT).rangeMin)
      result.push('webgl fragment shader high int precision rangeMax:' + gl.getShaderPrecisionFormat(gl.FRAGMENT_SHADER, gl.HIGH_INT).rangeMax)
      result.push('webgl fragment shader medium int precision:' + gl.getShaderPrecisionFormat(gl.FRAGMENT_SHADER, gl.MEDIUM_INT).precision)
      result.push('webgl fragment shader medium int precision rangeMin:' + gl.getShaderPrecisionFormat(gl.FRAGMENT_SHADER, gl.MEDIUM_INT).rangeMin)
      result.push('webgl fragment shader medium int precision rangeMax:' + gl.getShaderPrecisionFormat(gl.FRAGMENT_SHADER, gl.MEDIUM_INT).rangeMax)
      result.push('webgl fragment shader low int precision:' + gl.getShaderPrecisionFormat(gl.FRAGMENT_SHADER, gl.LOW_INT).precision)
      result.push('webgl fragment shader low int precision rangeMin:' + gl.getShaderPrecisionFormat(gl.FRAGMENT_SHADER, gl.LOW_INT).rangeMin)
      result.push('webgl fragment shader low int precision rangeMax:' + gl.getShaderPrecisionFormat(gl.FRAGMENT_SHADER, gl.LOW_INT).rangeMax)
      return result.join('~')
    },
    getWebglVendorAndRenderer: function () {
      /* This a subset of the WebGL fingerprint with a lot of entropy, while being reasonably browser-independent */
      try {
        var glContext = this.getWebglCanvas()
        var extensionDebugRendererInfo = glContext.getExtension('WEBGL_debug_renderer_info')
        return glContext.getParameter(extensionDebugRendererInfo.UNMASKED_VENDOR_WEBGL) + '~' + glContext.getParameter(extensionDebugRendererInfo.UNMASKED_RENDERER_WEBGL)
      } catch (e) {
        return null
      }
    },
    getAdBlock: function () {
      var ads = document.createElement('div')
      ads.innerHTML = '&nbsp;'
      ads.className = 'adsbox'
      var result = false
      try {
        // body may not exist, that's why we need try/catch
        document.body.appendChild(ads)
        result = document.getElementsByClassName('adsbox')[0].offsetHeight === 0
        document.body.removeChild(ads)
      } catch (e) {
        result = false
      }
      return result
    },
    getHasLiedLanguages: function () {
      // We check if navigator.language is equal to the first language of navigator.languages
      if (typeof navigator.languages !== 'undefined') {
        try {
          var firstLanguages = navigator.languages[0].substr(0, 2)
          if (firstLanguages !== navigator.language.substr(0, 2)) {
            return true
          }
        } catch (err) {
          return true
        }
      }
      return false
    },
    getHasLiedResolution: function () {
      if (window.screen.width < window.screen.availWidth) {
        return true
      }
      if (window.screen.height < window.screen.availHeight) {
        return true
      }
      return false
    },
    getHasLiedOs: function () {
      var userAgent = navigator.userAgent.toLowerCase()
      var oscpu = navigator.oscpu
      var platform = navigator.platform.toLowerCase()
      var os
      // We extract the OS from the user agent (respect the order of the if else if statement)
      if (userAgent.indexOf('windows phone') >= 0) {
        os = 'Windows Phone'
      } else if (userAgent.indexOf('win') >= 0) {
        os = 'Windows'
      } else if (userAgent.indexOf('android') >= 0) {
        os = 'Android'
      } else if (userAgent.indexOf('linux') >= 0) {
        os = 'Linux'
      } else if (userAgent.indexOf('iphone') >= 0 || userAgent.indexOf('ipad') >= 0) {
        os = 'iOS'
      } else if (userAgent.indexOf('mac') >= 0) {
        os = 'Mac'
      } else {
        os = 'Other'
      }
      // We detect if the person uses a mobile device
      var mobileDevice
      if (('ontouchstart' in window) ||
            (navigator.maxTouchPoints > 0) ||
            (navigator.msMaxTouchPoints > 0)) {
        mobileDevice = true
      } else {
        mobileDevice = false
      }

      if (mobileDevice && os !== 'Windows Phone' && os !== 'Android' && os !== 'iOS' && os !== 'Other') {
        return true
      }

      // We compare oscpu with the OS extracted from the UA
      if (typeof oscpu !== 'undefined') {
        oscpu = oscpu.toLowerCase()
        if (oscpu.indexOf('win') >= 0 && os !== 'Windows' && os !== 'Windows Phone') {
          return true
        } else if (oscpu.indexOf('linux') >= 0 && os !== 'Linux' && os !== 'Android') {
          return true
        } else if (oscpu.indexOf('mac') >= 0 && os !== 'Mac' && os !== 'iOS') {
          return true
        } else if ((oscpu.indexOf('win') === -1 && oscpu.indexOf('linux') === -1 && oscpu.indexOf('mac') === -1) !== (os === 'Other')) {
          return true
        }
      }

      // We compare platform with the OS extracted from the UA
      if (platform.indexOf('win') >= 0 && os !== 'Windows' && os !== 'Windows Phone') {
        return true
      } else if ((platform.indexOf('linux') >= 0 || platform.indexOf('android') >= 0 || platform.indexOf('pike') >= 0) && os !== 'Linux' && os !== 'Android') {
        return true
      } else if ((platform.indexOf('mac') >= 0 || platform.indexOf('ipad') >= 0 || platform.indexOf('ipod') >= 0 || platform.indexOf('iphone') >= 0) && os !== 'Mac' && os !== 'iOS') {
        return true
      } else if ((platform.indexOf('win') === -1 && platform.indexOf('linux') === -1 && platform.indexOf('mac') === -1) !== (os === 'Other')) {
        return true
      }

      if (typeof navigator.plugins === 'undefined' && os !== 'Windows' && os !== 'Windows Phone') {
        // We are are in the case where the person uses ie, therefore we can infer that it's windows
        return true
      }

      return false
    },
    getHasLiedBrowser: function () {
      var userAgent = navigator.userAgent.toLowerCase()
      var productSub = navigator.productSub

      // we extract the browser from the user agent (respect the order of the tests)
      var browser
      if (userAgent.indexOf('firefox') >= 0) {
        browser = 'Firefox'
      } else if (userAgent.indexOf('opera') >= 0 || userAgent.indexOf('opr') >= 0) {
        browser = 'Opera'
      } else if (userAgent.indexOf('chrome') >= 0) {
        browser = 'Chrome'
      } else if (userAgent.indexOf('safari') >= 0) {
        browser = 'Safari'
      } else if (userAgent.indexOf('trident') >= 0) {
        browser = 'Internet Explorer'
      } else {
        browser = 'Other'
      }

      if ((browser === 'Chrome' || browser === 'Safari' || browser === 'Opera') && productSub !== '20030107') {
        return true
      }

      // eslint-disable-next-line no-eval
      var tempRes = eval.toString().length
      if (tempRes === 37 && browser !== 'Safari' && browser !== 'Firefox' && browser !== 'Other') {
        return true
      } else if (tempRes === 39 && browser !== 'Internet Explorer' && browser !== 'Other') {
        return true
      } else if (tempRes === 33 && browser !== 'Chrome' && browser !== 'Opera' && browser !== 'Other') {
        return true
      }

      // We create an error to see how it is handled
      var errFirefox
      try {
        // eslint-disable-next-line no-throw-literal
        throw 'a'
      } catch (err) {
        try {
          err.toSource()
          errFirefox = true
        } catch (errOfErr) {
          errFirefox = false
        }
      }
      if (errFirefox && browser !== 'Firefox' && browser !== 'Other') {
        return true
      }
      return false
    },
    isCanvasSupported: function () {
      var elem = document.createElement('canvas')
      return !!(elem.getContext && elem.getContext('2d'))
    },
    isWebGlSupported: function () {
      // code taken from Modernizr
      if (!this.isCanvasSupported()) {
        return false
      }

      var glContext = this.getWebglCanvas()
      return !!window.WebGLRenderingContext && !!glContext
    },
    isIE: function () {
      if (navigator.appName === 'Microsoft Internet Explorer') {
        return true
      } else if (navigator.appName === 'Netscape' && /Trident/.test(navigator.userAgent)) { // IE 11
        return true
      }
      return false
    },
    hasSwfObjectLoaded: function () {
      return typeof window.swfobject !== 'undefined'
    },
    hasMinFlashInstalled: function () {
      return window.swfobject.hasFlashPlayerVersion('9.0.0')
    },
    addFlashDivNode: function () {
      var node = document.createElement('div')
      node.setAttribute('id', this.options.swfContainerId)
      document.body.appendChild(node)
    },
    loadSwfAndDetectFonts: function (done) {
      var hiddenCallback = '___fp_swf_loaded'
      window[hiddenCallback] = function (fonts) {
        done(fonts)
      }
      var id = this.options.swfContainerId
      this.addFlashDivNode()
      var flashvars = {
        onReady: hiddenCallback
      }
      var flashparams = {
        allowScriptAccess: 'always',
        menu: 'false'
      }
      window.swfobject.embedSWF(this.options.swfPath, id, '1', '1', '9.0.0', false, flashvars, flashparams, {})
    },
    getWebglCanvas: function () {
      var canvas = document.createElement('canvas')
      var gl = null
      try {
        gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl')
      } catch (e) { /* squelch */ }
      if (!gl) {
        gl = null
      }
      return gl
    },

    /**
     * @template T
     * @param {T=} context
     */
    each: function (obj, iterator, context) {
      if (obj === null) {
        return
      }
      if (this.nativeForEach && obj.forEach === this.nativeForEach) {
        obj.forEach(iterator, context)
      } else if (obj.length === +obj.length) {
        for (var i = 0, l = obj.length; i < l; i++) {
          if (iterator.call(context, obj[i], i, obj) === {}) {
            return
          }
        }
      } else {
        for (var key in obj) {
          if (obj.hasOwnProperty(key)) {
            if (iterator.call(context, obj[key], key, obj) === {}) {
              return
            }
          }
        }
      }
    },

    /**
     * @template T,V
     * @param {T=} context
     * @param {function(this:T, ?, (string|number), T=):V} iterator
     * @return {V}
     */
    map: function (obj, iterator, context) {
      var results = []
      // Not using strict equality so that this acts as a
      // shortcut to checking for `null` and `undefined`.
      if (obj == null) {
        return results
      }
      if (this.nativeMap && obj.map === this.nativeMap) {
        return obj.map(iterator, context)
      }
      this.each(obj, function (value, index, list) {
        results[results.length] = iterator.call(context, value, index, list)
      })
      return results
    },

    /// MurmurHash3 related functions

    //
    // Given two 64bit ints (as an array of two 32bit ints) returns the two
    // added together as a 64bit int (as an array of two 32bit ints).
    //
    x64Add: function (m, n) {
      m = [m[0] >>> 16, m[0] & 0xffff, m[1] >>> 16, m[1] & 0xffff]
      n = [n[0] >>> 16, n[0] & 0xffff, n[1] >>> 16, n[1] & 0xffff]
      var o = [0, 0, 0, 0]
      o[3] += m[3] + n[3]
      o[2] += o[3] >>> 16
      o[3] &= 0xffff
      o[2] += m[2] + n[2]
      o[1] += o[2] >>> 16
      o[2] &= 0xffff
      o[1] += m[1] + n[1]
      o[0] += o[1] >>> 16
      o[1] &= 0xffff
      o[0] += m[0] + n[0]
      o[0] &= 0xffff
      return [(o[0] << 16) | o[1], (o[2] << 16) | o[3]]
    },

    //
    // Given two 64bit ints (as an array of two 32bit ints) returns the two
    // multiplied together as a 64bit int (as an array of two 32bit ints).
    //
    x64Multiply: function (m, n) {
      m = [m[0] >>> 16, m[0] & 0xffff, m[1] >>> 16, m[1] & 0xffff]
      n = [n[0] >>> 16, n[0] & 0xffff, n[1] >>> 16, n[1] & 0xffff]
      var o = [0, 0, 0, 0]
      o[3] += m[3] * n[3]
      o[2] += o[3] >>> 16
      o[3] &= 0xffff
      o[2] += m[2] * n[3]
      o[1] += o[2] >>> 16
      o[2] &= 0xffff
      o[2] += m[3] * n[2]
      o[1] += o[2] >>> 16
      o[2] &= 0xffff
      o[1] += m[1] * n[3]
      o[0] += o[1] >>> 16
      o[1] &= 0xffff
      o[1] += m[2] * n[2]
      o[0] += o[1] >>> 16
      o[1] &= 0xffff
      o[1] += m[3] * n[1]
      o[0] += o[1] >>> 16
      o[1] &= 0xffff
      o[0] += (m[0] * n[3]) + (m[1] * n[2]) + (m[2] * n[1]) + (m[3] * n[0])
      o[0] &= 0xffff
      return [(o[0] << 16) | o[1], (o[2] << 16) | o[3]]
    },
    //
    // Given a 64bit int (as an array of two 32bit ints) and an int
    // representing a number of bit positions, returns the 64bit int (as an
    // array of two 32bit ints) rotated left by that number of positions.
    //
    x64Rotl: function (m, n) {
      n %= 64
      if (n === 32) {
        return [m[1], m[0]]
      } else if (n < 32) {
        return [(m[0] << n) | (m[1] >>> (32 - n)), (m[1] << n) | (m[0] >>> (32 - n))]
      } else {
        n -= 32
        return [(m[1] << n) | (m[0] >>> (32 - n)), (m[0] << n) | (m[1] >>> (32 - n))]
      }
    },
    //
    // Given a 64bit int (as an array of two 32bit ints) and an int
    // representing a number of bit positions, returns the 64bit int (as an
    // array of two 32bit ints) shifted left by that number of positions.
    //
    x64LeftShift: function (m, n) {
      n %= 64
      if (n === 0) {
        return m
      } else if (n < 32) {
        return [(m[0] << n) | (m[1] >>> (32 - n)), m[1] << n]
      } else {
        return [m[1] << (n - 32), 0]
      }
    },
    //
    // Given two 64bit ints (as an array of two 32bit ints) returns the two
    // xored together as a 64bit int (as an array of two 32bit ints).
    //
    x64Xor: function (m, n) {
      return [m[0] ^ n[0], m[1] ^ n[1]]
    },
    //
    // Given a block, returns murmurHash3's final x64 mix of that block.
    // (`[0, h[0] >>> 1]` is a 33 bit unsigned right shift. This is the
    // only place where we need to right shift 64bit ints.)
    //
    x64Fmix: function (h) {
      h = this.x64Xor(h, [0, h[0] >>> 1])
      h = this.x64Multiply(h, [0xff51afd7, 0xed558ccd])
      h = this.x64Xor(h, [0, h[0] >>> 1])
      h = this.x64Multiply(h, [0xc4ceb9fe, 0x1a85ec53])
      h = this.x64Xor(h, [0, h[0] >>> 1])
      return h
    },

    //
    // Given a string and an optional seed as an int, returns a 128 bit
    // hash using the x64 flavor of MurmurHash3, as an unsigned hex.
    //
    x64hash128: function (key, seed) {
      key = key || ''
      seed = seed || 0
      var remainder = key.length % 16
      var bytes = key.length - remainder
      var h1 = [0, seed]
      var h2 = [0, seed]
      var k1 = [0, 0]
      var k2 = [0, 0]
      var c1 = [0x87c37b91, 0x114253d5]
      var c2 = [0x4cf5ad43, 0x2745937f]
      for (var i = 0; i < bytes; i = i + 16) {
        k1 = [((key.charCodeAt(i + 4) & 0xff)) | ((key.charCodeAt(i + 5) & 0xff) << 8) | ((key.charCodeAt(i + 6) & 0xff) << 16) | ((key.charCodeAt(i + 7) & 0xff) << 24), ((key.charCodeAt(i) & 0xff)) | ((key.charCodeAt(i + 1) & 0xff) << 8) | ((key.charCodeAt(i + 2) & 0xff) << 16) | ((key.charCodeAt(i + 3) & 0xff) << 24)]
        k2 = [((key.charCodeAt(i + 12) & 0xff)) | ((key.charCodeAt(i + 13) & 0xff) << 8) | ((key.charCodeAt(i + 14) & 0xff) << 16) | ((key.charCodeAt(i + 15) & 0xff) << 24), ((key.charCodeAt(i + 8) & 0xff)) | ((key.charCodeAt(i + 9) & 0xff) << 8) | ((key.charCodeAt(i + 10) & 0xff) << 16) | ((key.charCodeAt(i + 11) & 0xff) << 24)]
        k1 = this.x64Multiply(k1, c1)
        k1 = this.x64Rotl(k1, 31)
        k1 = this.x64Multiply(k1, c2)
        h1 = this.x64Xor(h1, k1)
        h1 = this.x64Rotl(h1, 27)
        h1 = this.x64Add(h1, h2)
        h1 = this.x64Add(this.x64Multiply(h1, [0, 5]), [0, 0x52dce729])
        k2 = this.x64Multiply(k2, c2)
        k2 = this.x64Rotl(k2, 33)
        k2 = this.x64Multiply(k2, c1)
        h2 = this.x64Xor(h2, k2)
        h2 = this.x64Rotl(h2, 31)
        h2 = this.x64Add(h2, h1)
        h2 = this.x64Add(this.x64Multiply(h2, [0, 5]), [0, 0x38495ab5])
      }
      k1 = [0, 0]
      k2 = [0, 0]
      switch (remainder) {
      case 15:
        k2 = this.x64Xor(k2, this.x64LeftShift([0, key.charCodeAt(i + 14)], 48))
        // fallthrough
      case 14:
        k2 = this.x64Xor(k2, this.x64LeftShift([0, key.charCodeAt(i + 13)], 40))
        // fallthrough
      case 13:
        k2 = this.x64Xor(k2, this.x64LeftShift([0, key.charCodeAt(i + 12)], 32))
        // fallthrough
      case 12:
        k2 = this.x64Xor(k2, this.x64LeftShift([0, key.charCodeAt(i + 11)], 24))
        // fallthrough
      case 11:
        k2 = this.x64Xor(k2, this.x64LeftShift([0, key.charCodeAt(i + 10)], 16))
        // fallthrough
      case 10:
        k2 = this.x64Xor(k2, this.x64LeftShift([0, key.charCodeAt(i + 9)], 8))
        // fallthrough
      case 9:
        k2 = this.x64Xor(k2, [0, key.charCodeAt(i + 8)])
        k2 = this.x64Multiply(k2, c2)
        k2 = this.x64Rotl(k2, 33)
        k2 = this.x64Multiply(k2, c1)
        h2 = this.x64Xor(h2, k2)
        // fallthrough
      case 8:
        k1 = this.x64Xor(k1, this.x64LeftShift([0, key.charCodeAt(i + 7)], 56))
        // fallthrough
      case 7:
        k1 = this.x64Xor(k1, this.x64LeftShift([0, key.charCodeAt(i + 6)], 48))
        // fallthrough
      case 6:
        k1 = this.x64Xor(k1, this.x64LeftShift([0, key.charCodeAt(i + 5)], 40))
        // fallthrough
      case 5:
        k1 = this.x64Xor(k1, this.x64LeftShift([0, key.charCodeAt(i + 4)], 32))
        // fallthrough
      case 4:
        k1 = this.x64Xor(k1, this.x64LeftShift([0, key.charCodeAt(i + 3)], 24))
        // fallthrough
      case 3:
        k1 = this.x64Xor(k1, this.x64LeftShift([0, key.charCodeAt(i + 2)], 16))
        // fallthrough
      case 2:
        k1 = this.x64Xor(k1, this.x64LeftShift([0, key.charCodeAt(i + 1)], 8))
        // fallthrough
      case 1:
        k1 = this.x64Xor(k1, [0, key.charCodeAt(i)])
        k1 = this.x64Multiply(k1, c1)
        k1 = this.x64Rotl(k1, 31)
        k1 = this.x64Multiply(k1, c2)
        h1 = this.x64Xor(h1, k1)
                    // fallthrough
      }
      h1 = this.x64Xor(h1, [0, key.length])
      h2 = this.x64Xor(h2, [0, key.length])
      h1 = this.x64Add(h1, h2)
      h2 = this.x64Add(h2, h1)
      h1 = this.x64Fmix(h1)
      h2 = this.x64Fmix(h2)
      h1 = this.x64Add(h1, h2)
      h2 = this.x64Add(h2, h1)
      return ('00000000' + (h1[0] >>> 0).toString(16)).slice(-8) + ('00000000' + (h1[1] >>> 0).toString(16)).slice(-8) + ('00000000' + (h2[0] >>> 0).toString(16)).slice(-8) + ('00000000' + (h2[1] >>> 0).toString(16)).slice(-8)
    }
  }
  Fingerprint2.VERSION = '1.5.1'
  return Fingerprint2
})
/**
* This is responsible for syncing of Telemetry
* @class TelemetrySyncManager
* @author Krushanu Mohapatra <Krushanu.Mohapatra@tarento.com>
*/

var TelemetrySyncManager = {

/**
* This is the telemetry data for the perticular stage.
* @member {object} _teleData
* @memberof TelemetryPlugin
*/
  _teleData: [],
  init: function () {
    var instance = this
    document.addEventListener('TelemetryEvent', this.sendTelemetry)
  },
  sendTelemetry: function (event) {
    var Telemetry = EkTelemetry || Telemetry
    var telemetryEvent = event.detail
    console.log('Telemetry Events ', telemetryEvent)
    var instance = TelemetrySyncManager
    instance._teleData.push(telemetryEvent)
    if ((telemetryEvent.eid.toUpperCase() == 'END') || (instance._teleData.length >= Telemetry.config.batchsize)) {
      var telemetryData = instance._teleData
      var telemetryObj = {
        'id': 'ekstep.telemetry',
        'ver': Telemetry._version,
        'ets': (new Date()).getTime(),
        'events': telemetryData
      }
      var headersParam = {}
      if (typeof Telemetry.config.authtoken !== 'undefined') { headersParam['Authorization'] = 'Bearer ' + Telemetry.config.authtoken }

      var fullPath = Telemetry.config.host + Telemetry.config.apislug + Telemetry.config.endpoint
      headersParam['dataType'] = 'json'
      headersParam['Content-Type'] = 'application/json'
      jQuery.ajax({
        url: fullPath,
        type: 'POST',
        headers: headersParam,
        data: JSON.stringify(telemetryObj)
      }).done(function (resp) {
        instance._teleData = []
        console.log('Telemetry API success', resp)
      }).fail(function (error, textStatus, errorThrown) {
        if (error.status == 403) {
          console.error('Authentication error: ', error)
        } else {
          console.log('Error while Telemetry sync to server: ', error)
        }
      })
    }
  }
}
if (typeof document !== 'undefined') {
  TelemetrySyncManager.init()
}

/**
* Telemetry V3 Library
* @author Akash Gupta <Akash.Gupta@tarento.com>
*/

var libraryDispatcher = {
  dispatch: function (event) {
    if (typeof document !== 'undefined') {
      // To Support for external user who ever lisenting on this 'TelemetryEvent' event.
      document.dispatchEvent(new CustomEvent('TelemetryEvent', {detail: event }))
    } else {
      console.info('Library dispatcher supports only for client side.')
    }
  }
}

var EkTelemetry = (function () {
  this.ektelemetry = function () {}
  var instance = function () {}
  var telemetryInstance = this
  this.ektelemetry.initialized = false
  this.ektelemetry.config = {}
  this.ektelemetry._version = '3.0'
  this.ektelemetry.fingerPrintId = undefined
  this.dispatcher = libraryDispatcher
  this._defaultValue = {
    uid: 'anonymous',
    authtoken: '',
    batchsize: 20,
    host: 'https://api.ekstep.in',
    endpoint: '/data/v3/telemetry',
    apislug: '/action'
  },
  this.telemetryEnvelop = {
    'eid': '',
    'ets': '',
    'ver': '',
    'mid': '',
    'actor': {},
    'context': {},
    'object': {},
    'tags': [],
    'edata': ''
  }
  this._globalContext = {
    'channel': 'in.ekstep',
    'pdata': {id: 'in.ekstep', ver: '1.0', pid: ''},
    'env': 'ContentPlayer',
    'sid': '',
    'did': '',
    'cdata': [],
    'rollup': {}
  },
  this.runningEnv = 'client'
  this._globalObject = {}
  this.startData = []
  this.deviceSpecRequiredFields = ['os', 'make', 'id', 'mem', 'idisk', 'edisk', 'scrn', 'camera', 'cpu', 'sims', 'cap'],
  this.userAgentRequiredFields = ['agent', 'ver', 'system', 'platform', 'raw'],
  this.objectRequiredFields = ['id', 'type', 'ver'],
  this.targetRequiredFields = ['id', 'type', 'ver'],
  this.pluginRequiredFields = ['id', 'ver'],
  this.visitRequiredFields = ['objid', 'objtype'],
  this.questionRequiredFields = ['id', 'maxscore', 'exlength', 'desc', 'title'],
  this.pdataRequiredFields = ['id'],
  this.targetObjectRequiredFields = ['type', 'id'],

  /**
 * Which is used to initialize the telemetry event
 * @param  {object} config - Configurations for the telemetry lib to initialize the service. " Example: config = { batchsize:10,host:"" } "
 */
  this.ektelemetry.initialize = function (config) {
    instance.init(config)
  }

  /**
 * Which is used to start and initialize the telemetry event.
 * If the telemetry is already initialzed then it will trigger only start event.
 * @param  {object} config     [Telemetry lib configurations]
 * @param  {string} contentId  [Content Identifier]
 * @param  {string} contentVer [Content version]
 * @param  {object} data       [Can have userAgent,device spec object]
 * @param  {object} options    [It can have `context, object, actor` can be explicitly passed in this event]
 */
  this.ektelemetry.start = function (config, contentId, contentVer, data, options) {
    if (!instance.hasRequiredData(data, ['type'])) {
      console.error('Invalid start data')
      return
    }
    if (data.dspec && !instance.hasRequiredData(data.dspec, telemetryInstance.deviceSpecRequiredFields)) {
      console.error('Invalid device spec')
      return
    }
    if (data.uaspec && !instance.hasRequiredData(data.uaspec, telemetryInstance.userAgentRequiredFields)) {
      console.error('Invalid user agent spec')
      return
    }
    data.duration = data.duration || (new Date()).getTime()
    if (contentId && contentVer) {
      telemetryInstance._globalObject.id = contentId
      telemetryInstance._globalObject.ver = contentVer
    }

    if (!EkTelemetry.initialized && config) {
      instance.init(config, contentId, contentVer)
    }
    instance.updateValues(options)
    var startEventObj = instance.getEvent('START', data)
    instance._dispatch(startEventObj)
    telemetryInstance.startData.push(JSON.parse(JSON.stringify(startEventObj)))
  }

  /**
 * Which is used to log the impression telemetry event.
 * @param  {object} data       [data which is need to pass in this event ex: {"type":"player","mode":"ContentPlayer","pageid":"splash"}]
 * @param  {object} options    [It can have `context, object, actor` can be explicitly passed in this event]
 */
  this.ektelemetry.impression = function (data, options) {
    if (undefined == data.pageid || undefined == data.type || undefined == data.uri) {
      console.error('Invalid impression data. Required fields are missing.', data)
      return
    }
    if (data.visits && !instance.hasRequiredData(data.visits, telemetryInstance.visitRequiredFields)) {
      console.error('Invalid visits spec')
      return
    }
    instance.updateValues(options)
    instance._dispatch(instance.getEvent('IMPRESSION', data))
  }

  /**
 * Which is used to log the interact telemetry event.
 * @param  {object} data       [data which is need to pass in this event ex: {"type":"player","mode":"ContentPlayer","pageid":"splash"}]
 * @param  {object} options    [It can have `context, object, actor` can be explicitly passed in this event]
 */
  this.ektelemetry.interact = function (data, options) {
    if (!instance.hasRequiredData(data, ['type', 'id'])) {
      console.error('Invalid interact data')
      return
    }
    if (data.target && !instance.hasRequiredData(data.target, telemetryInstance.targetRequiredFields)) {
      console.error('Invalid target spec')
      return
    }
    if (data.plugin && !instance.hasRequiredData(data.plugin, telemetryInstance.pluginRequiredFields)) {
      console.error('Invalid plugin spec')
      return
    }
    instance.updateValues(options)
    instance._dispatch(instance.getEvent('INTERACT', data))
  }

  /**
 * Which is used to log the assess telemetry event.
 * @param  {object} data       [data which is need to pass in this event ex: {"type":"player","mode":"ContentPlayer","pageid":"splash"}]
 * @param  {object} options    [It can have `context, object, actor` can be explicitly passed in this event]
 */
  this.ektelemetry.assess = function (data, options) {
    if (!instance.hasRequiredData(data, ['item', 'pass', 'score', 'resvalues', 'duration'])) {
      console.error('Invalid assess data')
      return
    }
    if (!instance.hasRequiredData(data.item, telemetryInstance.questionRequiredFields)) {
      console.error('Invalid question spec')
      return
    }
    instance.updateValues(options)
    instance._dispatch(instance.getEvent('ASSESS', data))
  }

  /**
 * Which is used to log the response telemetry event.
 * @param  {object} data       [data which is need to pass in this event ex: {"type":"player","mode":"ContentPlayer","pageid":"splash"}]
 * @param  {object} options    [It can have `context, object, actor` can be explicitly passed in this event]
 */
  this.ektelemetry.response = function (data, options) {
    if (!instance.hasRequiredData(data, ['target', 'values', 'type'])) {
      console.error('Invalid response data')
      return
    }
    if (!instance.hasRequiredData(data.target, telemetryInstance.targetRequiredFields)) {
      console.error('Invalid target spec')
      return
    }
    instance.updateValues(options)
    instance._dispatch(instance.getEvent('RESPONSE', data))
  }

  /**
 * Which is used to log the interrupt telemetry event.
 * @param  {object} data       [data which is need to pass in this event ex: {"type":"player","mode":"ContentPlayer","pageid":"splash"}]
 * @param  {object} options    [It can have `context, object, actor` can be explicitly passed in this event]
 */
  this.ektelemetry.interrupt = function (data, options) {
    if (!instance.hasRequiredData(data, ['type'])) {
      console.error('Invalid interrupt data')
      return
    }
    instance.updateValues(options)
    instance._dispatch(instance.getEvent('INTERRUPT', data))
  }

  /**
 * Which is used to log the feedback telemetry event.
 * @param  {object} data       [data which is need to pass in this event ex: {"type":"player","mode":"ContentPlayer","pageid":"splash"}]
 * @param  {object} options    [It can have `context, object, actor` can be explicitly passed in this event]
 */
  this.ektelemetry.feedback = function (data, options) {
    var eksData = {
      'rating': data.rating || '',
      'comments': data.comments || ''
    }
    instance.updateValues(options)
    instance._dispatch(instance.getEvent('FEEDBACK', eksData))
  }

  /**
 * Which is used to log the share telemetry event.
 * @param  {object} data       [data which is need to pass in this event ex: {"type":"player","mode":"ContentPlayer","pageid":"splash"}]
 * @param  {object} options    [It can have `context, object, actor` can be explicitly passed in this event]
*/
  this.ektelemetry.share = function (data, options) {
    if (!instance.hasRequiredData(data, ['items'])) {
      console.error('Invalid share data')
      return
    }
    instance.updateValues(options)
    instance._dispatch(instance.getEvent('INTERRUPT', data))
  }

  /**
 * Which is used to log the audit telemetry event.
 * @param  {object} data       [data which is need to pass in this event ex: {"type":"player","mode":"ContentPlayer","pageid":"splash"}]
 * @param  {object} options    [It can have `context, object, actor` can be explicitly passed in this event]
 */
  this.ektelemetry.audit = function (data, options) {
    if (!instance.hasRequiredData(data, ['props'])) {
      console.error('Invalid audit data')
      return
    }
    instance.updateValues(options)
    instance._dispatch(instance.getEvent('AUDIT', data))
  }

  /**
 * Which is used to log the error telemetry event.
 * @param  {object} data       [data which is need to pass in this event ex: {"type":"player","mode":"ContentPlayer","pageid":"splash"}]
 * @param  {object} options    [It can have `context, object, actor` can be explicitly passed in this event]
 */
  this.ektelemetry.error = function (data, options) {
    if (!instance.hasRequiredData(data, ['err', 'errtype', 'stacktrace'])) {
      console.error('Invalid error data')
      return
    }
    if (data.object && !instance.hasRequiredData(data.object, telemetryInstance.objectRequiredFields)) {
      console.error('Invalid object spec')
      return
    }
    if (data.plugin && !instance.hasRequiredData(data.plugin, telemetryInstance.pluginRequiredFields)) {
      console.error('Invalid plugin spec')
      return
    }
    instance.updateValues(options)
    instance._dispatch(instance.getEvent('ERROR', data))
  }

  /**
 * Which is used to log the heartbeat telemetry event.
 * @param  {object} data       [data which is need to pass in this event ex: {"type":"player","mode":"ContentPlayer","pageid":"splash"}]
 * @param  {object} options    [It can have `context, object, actor` can be explicitly passed in this event]
 */
  this.ektelemetry.heartbeat = function (data, options) {
    instance.updateValues(options)
    instance._dispatch(instance.getEvent('HEARTBEAT', data))
  }

  /**
 * Which is used to log the log event.
 * @param  {object} data       [data which is need to pass in this event ex: {"type":"player","mode":"ContentPlayer","pageid":"splash"}]
 * @param  {object} options    [It can have `context, object, actor` can be explicitly passed in this event]
 */
  this.ektelemetry.log = function (data, options) {
    if (!instance.hasRequiredData(data, ['type', 'level', 'message'])) {
      console.error('Invalid log data')
      return
    }
    instance.updateValues(options)
    instance._dispatch(instance.getEvent('LOG', data))
  }

  /**
 * Which is used to log the search event.
 * @param  {object} data       [data which is need to pass in this event ex: {"type":"player","mode":"ContentPlayer","pageid":"splash"}]
 * @param  {object} options    [It can have `context, object, actor` can be explicitly passed in this event]
 */
  this.ektelemetry.search = function (data, options) {
    if (!instance.hasRequiredData(data, ['query', 'size', 'topn'])) {
      console.error('Invalid search data')
      return
    }
    instance.updateValues(options)
    instance._dispatch(instance.getEvent('SEARCH', data))
  }

  /**
 * Which is used to log the metrics event.
 * @param  {object} data       [data which is need to pass in this event ex: {"type":"player","mode":"ContentPlayer","pageid":"splash"}]
 * @param  {object} options    [It can have `context, object, actor` can be explicitly passed in this event]
 */
  this.ektelemetry.metrics = function (data, options) {
    instance.updateValues(options)
    instance._dispatch(instance.getEvent('METRICS', data))
  }

  /**
 * Which is used to log the exdata event.
 * @param  {object} data       [data which is need to pass in this event ex: {"type":"player","mode":"ContentPlayer","pageid":"splash"}]
 * @param  {object} options    [It can have `context, object, actor` can be explicitly passed in this event]
 */
  this.ektelemetry.exdata = function (data, options) {
    instance.updateValues(options)
    instance._dispatch(instance.getEvent('EXDATA', data))
  }

  /**
 * Which is used to log the summary event.
 * @param  {object} data       [data which is need to pass in this event ex: {"type":"player","mode":"ContentPlayer","pageid":"splash"}]
 * @param  {object} options    [It can have `context, object, actor` can be explicitly passed in this event]
 */
  this.ektelemetry.summary = function (data, options) {
    if (!instance.hasRequiredData(data, ['type', 'starttime', 'endtime', 'timespent', 'pageviews', 'interactions'])) {
      console.error('Invalid summary data')
      return
    }
    instance.updateValues(options)
    instance._dispatch(instance.getEvent('SUMMARY', data))
  }

  /**
 * Which is used to log the end telemetry event.
 * @param  {object} data       [data which is need to pass in this event ex: {"type":"player","mode":"ContentPlayer","pageid":"splash"}]
 * @param  {object} options    [It can have `context, object, actor` can be explicitly passed in this event]
 */
  this.ektelemetry.end = function (data, options) {
    if (!instance.hasRequiredData(data, ['type'])) {
      console.error('Invalid end data. Required fields are missing.', data)
      return
    }
    if (telemetryInstance.startData.length) {
      var startEventObj = telemetryInstance.startData.pop()
      data.duration = ((new Date()).getTime() - startEventObj.ets)
      instance.updateValues(options)
      instance._dispatch(instance.getEvent('END', data))
    } else {
      console.info('Please invoke start before invoking end event.')
    }
  }

  /**
 * Which is used to know the whether telemetry is initialized or not.
 * @return {Boolean}
 */
  this.ektelemetry.isInitialized = function () {
    return EkTelemetry.initialized
  }

  /**
 * Which is used to reset the current context
 * @param  {object} context [Context value]
 */
  this.ektelemetry.resetContext = function (context) {
    telemetryInstance._currentContext = context || {}
  }

  /**
 * Which is used to reset the current object value.
 * @param  {object} object [Object value]
 */
  this.ektelemetry.resetObject = function (object) {
    telemetryInstance._currentObject = object || {}
  },

  /**
 * Which is used to reset the current actor value.
 * @param  {object} object [Object value]
 */
  this.ektelemetry.resetActor = function (actor) {
    telemetryInstance._currentActor = actor || {}
  }

  /**
 * Which is used to reset the current actor value.
 * @param  {object} object [Object value]
 */
  this.ektelemetry.resetTags = function (tags) {
    telemetryInstance._currentTags = tags || []
  }

  /**
 * Which is used to initialize the telemetry in globally.
 * @param  {object} config     [Telemetry configurations]
 * @param  {string} contentId  [Identifier value]
 * @param  {string} contentVer [Version]
 * @param  {object} type       [object type]
 */
  instance.init = function (config, contentId, contentVer) {
    if (EkTelemetry.initialized) {
      console.log('Telemetry is already initialized..')
      return
    }
    !config && (config = {})
    if (config.pdata && !instance.hasRequiredData(config.pdata, telemetryInstance.pdataRequiredFields)) {
      console.error('Invalid pdata spec in config')
      return
    }
    if (config.object && !instance.hasRequiredData(config.object, telemetryInstance.targetObjectRequiredFields)) {
      console.error('Invalid target object spec in config')
      return
    }
    contentId && (telemetryInstance._globalObject.id = contentId)
    contentVer && (telemetryInstance._globalObject.ver = contentVer)
    // if (!instance.hasRequiredData(config, ["pdata", "channel", "uid", "env"])) {
    //     console.error('Invalid start data');
    //     EkTelemetry.initialized = false;
    //     return;
    // }

    config.runningEnv && (telemetryInstance.runningEnv = config.runningEnv)
    config.batchsize = config.batchsize ? (config.batchsize < 10 ? 10 : (config.batchsize > 1000 ? 1000 : config.batchsize)) : _defaultValue.batchsize
    EkTelemetry.config = Object.assign(_defaultValue, config)
    EkTelemetry.initialized = true
    telemetryInstance.dispatcher = EkTelemetry.config.dispatcher ? EkTelemetry.config.dispatcher : libraryDispatcher
    instance.updateConfigurations(config)
    console.info('Telemetry is initialized.')
  }

  /**
 * Which is used to dispatch a telemetry events.
 * @param  {object} message [Telemetry event object]
 */
  instance._dispatch = function (message) {
    message.mid = message.eid + ':' + CryptoJS.MD5(JSON.stringify(message)).toString()
    if (telemetryInstance.runningEnv === 'client') {
      if (!message.context.did) {
        if (!EkTelemetry.fingerPrintId) {
          instance.getFingerPrint(function (result, components) {
            message.context.did = result
            EkTelemetry.fingerPrintId = result
            dispatcher.dispatch(message)
          })
        } else {
          message.context.did = EkTelemetry.fingerPrintId
          dispatcher.dispatch(message)
        }
      } else {
        dispatcher.dispatch(message)
      }
    } else {
      dispatcher.dispatch(message)
    }
  }

  /**
 * Which is used to get the telemetry envelop data
 * @param  {string} eventId [Name of the event]
 * @param  {object} data    [Event data]
 * @return {object}         [Telemetry envelop data]
 */
  instance.getEvent = function (eventId, data) {
    telemetryInstance.telemetryEnvelop.eid = eventId
    telemetryInstance.telemetryEnvelop.ets = (new Date()).getTime()
    telemetryInstance.telemetryEnvelop.ver = EkTelemetry._version
    telemetryInstance.telemetryEnvelop.mid = ''
    telemetryInstance.telemetryEnvelop.actor = Object.assign({}, {'id': EkTelemetry.config.uid || 'anonymous', 'type': 'User' }, instance.getUpdatedValue('actor'))
    telemetryInstance.telemetryEnvelop.context = Object.assign({}, instance.getGlobalContext(), instance.getUpdatedValue('context'))
    telemetryInstance.telemetryEnvelop.object = Object.assign({}, instance.getGlobalObject(), instance.getUpdatedValue('object'))
    telemetryInstance.telemetryEnvelop.tags = Object.assign([], EkTelemetry.config.tags, instance.getUpdatedValue('tags'))
    telemetryInstance.telemetryEnvelop.edata = data
    return telemetryInstance.telemetryEnvelop
  }

  /**
 * Which is used to validate the object
 * @param  {object}  data            [Object which is need to be validate]
 * @param  {object}  mandatoryFields [required fields should be present in the object]
 * @return {Boolean}
 */
  instance.hasRequiredData = function (data, mandatoryFields) {
    var isValid = true
    mandatoryFields.forEach(function (key) {
      if (data) {
        if (!data.hasOwnProperty(key)) isValid = false
      } else {
        isValid = false
      }
    })
    return isValid
  }

  /**
 * Which is used to assing to globalObject and globalContext value from the telemetry configurations.
 * @param  {object} config [Telemetry configurations]
 */
  instance.updateConfigurations = function (config) {
    config.object && (telemetryInstance._globalObject = config.object)
    config.channel && (telemetryInstance._globalContext.channel = config.channel)
    config.env && (telemetryInstance._globalContext.env = config.env)
    config.rollup && (telemetryInstance._globalContext.rollup = config.rollup)
    config.sid && (telemetryInstance._globalContext.sid = config.sid)
    config.did && (telemetryInstance._globalContext.did = config.did)
    config.cdata && (telemetryInstance._globalContext.cdata = config.cdata)
    config.pdata && (telemetryInstance._globalContext.pdata = config.pdata)
  }

  /**
 * Which is used to get the current updated global context value.
 * @return {object}
 */
  instance.getGlobalContext = function () {
    return telemetryInstance._globalContext
  }

  /**
 * Which is used to get the current global object value.
 * @return {object}
 */
  instance.getGlobalObject = function () {
    return telemetryInstance._globalObject
  }

  /**
 * Which is used to update the both context and object vlaue.
 * For any event explicitly context and object value can be passed.
 * @param  {object} context [Context value object]
 * @param  {object} object  [Object value]
 */
  instance.updateValues = function (options) {
    if (options) {
      options.context && (telemetryInstance._currentContext = options.context)
      options.object && (telemetryInstance._currentObject = options.object)
      options.actor && (telemetryInstance._currentActor = options.actor)
      options.tags && (telemetryInstance._currentTags = options.tags)
      options.runningEnv && (telemetryInstance.runningEnv = options.runningEnv)
    }
  }

  /**
 * Which is used to get the value of 'context','actor','object'
 * @param  {string} key [ Name of object which we is need to get ]
 * @return {object}
 */
  instance.getUpdatedValue = function (key) {
    switch (key.toLowerCase()) {
    case 'context':
      return telemetryInstance._currentContext || {}
      break
    case 'object':
      return telemetryInstance._currentObject || {}
      break
    case 'actor':
      return telemetryInstance._currentActor || {}
      break
    case 'tags':
      return telemetryInstance._currentTags || []
      break
    }
  }

  /**
 * Which is used to support for lower end deviecs.
 * If any of the devices which is not supporting ECMAScript 6 version
 */
  instance.objectAssign = function () {
    Object.assign = function (target) {
      'use strict'
      if (target == null) {
        throw new TypeError('Cannot convert undefined or null to object')
      }

      target = Object(target)
      for (var index = 1; index < arguments.length; index++) {
        var source = arguments[index]
        if (source != null) {
          for (var key in source) {
            if (Object.prototype.hasOwnProperty.call(source, key)) {
              target[key] = source[key]
            }
          }
        }
      }
      return target
    }
  }

  instance.getFingerPrint = function (cb) {
    new Fingerprint2().get(function (result, components) {
      if (cb) cb(result, components)
    })
  }
  if (typeof Object.assign !== 'function') {
    instance.objectAssign()
  }

  return this.ektelemetry
})()

/**
* Name space which is being fallowed
* @type {[type]}
*/
Telemetry = $t = EkTelemetry

/**
* To support for the node backEnd, So any node developer can import this telemetry lib.
*/
if (typeof module !== 'undefined') {
  module.exports = Telemetry
}
