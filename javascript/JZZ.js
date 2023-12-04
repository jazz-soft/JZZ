(function(global, factory) {
  /* istanbul ignore next */
  if (typeof exports === 'object' && typeof module !== 'undefined') {
    module.exports = factory();
  }
  else if (typeof define === 'function' && define.amd) {
    define('JZZ', [], factory);
  }
  else {
    if (!global) global = window;
    if (global.JZZ && global.JZZ.MIDI) return;
    global.JZZ = factory();
  }
})(this, function() {

  var _scope = typeof window === 'undefined' ? global : window;
  var _version = '1.7.6';
  var i, j, k, m, n;

  /* istanbul ignore next */
  var _time = Date.now || function () { return new Date().getTime(); };
  var _startTime = _time();
  /* istanbul ignore next */
  var _now = typeof performance != 'undefined' && performance.now ?
    function() { return performance.now(); } : function() { return _time() - _startTime; };
  var _schedule = function(f) {
    setTimeout(f, 0);
  };
  function _nop() {}
  function _func(f) { return typeof f == 'function'; }

  // _R: common root for all async objects
  function _R() {
    this._orig = this;
    this._ready = false;
    this._queue = [];
    this._log = [];
  }
  _R.prototype._exec = function() {
    while (this._ready && this._queue.length) {
      var x = this._queue.shift();
      x[0].apply(this, x[1]);
    }
  };
  _R.prototype._push = function(func, arg) { this._queue.push([func, arg]); _R.prototype._exec.apply(this); };
  _R.prototype._slip = function(func, arg) { this._queue.unshift([func, arg]); };
  _R.prototype._pause = function() { this._ready = false; };
  _R.prototype._resume = function() { this._ready = true; _R.prototype._exec.apply(this); };
  _R.prototype._break = function(err) { this._orig._bad = true; this._orig._log.push(err || 'Unknown JZZ error'); };
  _R.prototype._repair = function() { this._orig._bad = false; };
  _R.prototype._crash = function(err) { this._break(err); this._resume(); };
  _R.prototype._err = function() { return this._log[this._log.length - 1]; };
  _R.prototype.log = function() { return _clone(this._log); };
  _R.prototype._dup = function() {
    var F = function() {};
    F.prototype = this._orig;
    var ret = new F();
    ret._ready = false;
    ret._queue = [];
    return ret;
  };
  _R.prototype._image = function() { return this._dup(); };
  _R.prototype._thenable = function() {
    if (this.then) return this;
    var self = this;
    var F = function() {}; F.prototype = self;
    var ret = new F();
    ret.then = function(good, bad) { self._push(_then, [good, bad]); return this; };
    return ret;
  };
  function _then(good, bad) {
    if (this._bad) {
      if (_func(bad)) bad.apply(this, [new Error(this._err())]);
    }
    else {
      if (_func(good)) good.apply(this, [this]);
    }
  }
  function _wait(obj, delay) {
    if (this._bad) obj._crash(this._err());
    else setTimeout(function() { obj._resume(); }, delay);
  }
  _R.prototype.wait = function(delay) {
    if (!delay) return this;
    var ret = this._image();
    this._push(_wait, [ret, delay]);
    return ret._thenable();
  };
  function _kick(obj) { if (this._bad) obj._break(this._err()); obj._resume(); }
  function _rechain(self, obj, name) {
    self[name] = function() {
      var arg = arguments;
      var ret = obj._image();
      this._push(_kick, [ret]);
      return ret[name].apply(ret, arg);
    };
  }
  function _and(q) {
    if (!this._bad) {
      if (_func(q)) q.apply(this); else console.log(q);
    }
  }
  _R.prototype.and = function(func) { this._push(_and, [func]); return this._thenable(); };
  function _or(q) {
    if (this._bad) {
      if (_func(q)) q.apply(this); else console.log(q);
    }
  }
  _R.prototype.or = function(func) { this._push(_or, [func]); return this._thenable(); };

  _R.prototype._info = {};
  _R.prototype.info = function() {
    var info = _clone(this._orig._info);
    if (typeof info.engine == 'undefined') info.engine = 'none';
    if (typeof info.sysex == 'undefined') info.sysex = true;
    return info;
  };
  _R.prototype.name = function() { return this.info().name; };

  function _close(obj) {
    if (this._bad) obj._crash(this._err());
    else {
      this._break('Closed');
      obj._resume();
    }
  }
  _R.prototype.close = function() {
    var ret = new _R();
    if (this._close) this._push(this._close, []);
    this._push(_close, [ret]);
    return ret._thenable();
  };

  function _tryAny(arr) {
    if (!arr.length) {
      this._break();
      return;
    }
    var func = arr.shift();
    if (arr.length) {
      var self = this;
      this._slip(_or, [ function() { _tryAny.apply(self, [arr]); } ]);
    }
    try {
      this._repair();
      func.apply(this);
    }
    catch (err) {
      this._break(err.toString());
    }
  }

  function _push(arr, obj) {
    for (var i = 0; i < arr.length; i++) if (arr[i] === obj) return;
    arr.push(obj);
  }
  function _pop(arr, obj) {
    for (var i = 0; i < arr.length; i++) if (arr[i] === obj) {
      arr.splice(i, 1);
      return;
    }
  }

  // _J: JZZ object
  function _J() {
    _R.apply(this);
  }
  _J.prototype = new _R();

  function _for(x, f) {
    for(var k in x) if (x.hasOwnProperty(k)) f.call(this, k);
  }
  function _clone(obj, key, val) {
    if (typeof key == 'undefined') return _clone(obj, [], []);
    if (obj instanceof Object) {
      for (var i = 0; i < key.length; i++) if (key[i] === obj) return val[i];
      var ret;
      if (obj instanceof Array) ret = []; else ret = {};
      key.push(obj); val.push(ret);
      _for(obj, function(k) { ret[k] = _clone(obj[k], key, val); });
      return ret;
    }
    return obj;
  }
  _J.prototype._info = { name: 'JZZ.js', ver: _version, version: _version, inputs: [], outputs: [] };

  var _outs = [];
  var _ins = [];
  var _outsW = [];
  var _insW = [];
  var _outsM = {};
  var _insM = {};

  function _postRefresh() {
    _jzz._info.engine = _engine._type;
    _jzz._info.version = _engine._version;
    _jzz._info.sysex = _engine._sysex;
    _jzz._info.inputs = [];
    _jzz._info.outputs = [];
    _outs = [];
    _ins = [];
    _engine._allOuts = {};
    _engine._allIns = {};
    var i, x;
    for (i = 0; i < _engine._outs.length; i++) {
      x = _engine._outs[i];
      if (_outsM[x.name]) continue;
      x.engine = _engine;
      _engine._allOuts[x.name] = x;
      _jzz._info.outputs.push({
        id: x.name,
        name: x.name,
        manufacturer: x.manufacturer,
        version: x.version,
        engine: _engine._type
      });
      _outs.push(x);
    }
    for (i = 0; i < _virtual._outs.length; i++) {
      x = _virtual._outs[i];
      if (_outsM[x.name]) continue;
      _jzz._info.outputs.push({
        id: x.name,
        name: x.name,
        manufacturer: x.manufacturer,
        version: x.version,
        engine: x.type
      });
      _outs.push(x);
    }
    for (i = 0; i < _engine._ins.length; i++) {
      x = _engine._ins[i];
      if (_insM[x.name]) continue;
      x.engine = _engine;
      _engine._allIns[x.name] = x;
      _jzz._info.inputs.push({
        id: x.name,
        name: x.name,
        manufacturer: x.manufacturer,
        version: x.version,
        engine: _engine._type
      });
      _ins.push(x);
    }
    for (i = 0; i < _virtual._ins.length; i++) {
      x = _virtual._ins[i];
      if (_insM[x.name]) continue;
      _jzz._info.inputs.push({
        id: x.name,
        name: x.name,
        manufacturer: x.manufacturer,
        version: x.version,
        engine: x.type
      });
      _ins.push(x);
    }
    if (_jzz._watcher && _jzz._watcher._handles.length) {
      var diff = _diff(_insW, _outsW, _jzz._info.inputs, _jzz._info.outputs);
       if (diff) {
        for (j = 0; j < diff.inputs.removed.length; j++) {
          x = _engine._inMap[diff.inputs.removed[j].name];
          if (x) x._closeAll();
        }
        for (j = 0; j < diff.outputs.removed.length; j++) {
          x = _engine._outMap[diff.outputs.removed[j].name];
          if (x) x._closeAll();
        }
        _fireW(diff);
      }
    }
    _insW = _jzz._info.inputs;
    _outsW = _jzz._info.outputs;
  }
  function _refresh() {
    if (!this._bad) _engine._refresh(this);
  }
  _J.prototype.refresh = function() {
    this._push(_refresh, []);
    return this._thenable();
  };

  function _filterList(q, arr) {
    var i, n;
    if (_func(q)) q = q(arr);
    if (!(q instanceof Array)) q = [q];
    var before = [];
    var after = [];
    var etc = arr.slice();
    var a = before;
    for (i = 0; i < q.length; i++) {
      if (typeof q[i] == 'undefined') a = after;
      else if (q[i] instanceof RegExp) for (n = 0; n < etc.length; n++) {
        if (q[i].test(etc[n].name)) {
          a.push(etc[n]);
          etc.splice(n, 1);
          n--;
        }
      }
      else {
        for (n = 0; n < etc.length; n++) if (q[i] + '' === n + '' || q[i] === etc[n].name || (q[i] instanceof Object && q[i].name === etc[n].name)) {
          a.push(etc[n]);
          etc.splice(n, 1);
          n--;
        }
      }
    }
    return a == before ? before : before.concat(etc).concat(after);
  }

  function _notFound(port, q) {
    var msg;
    if (q instanceof RegExp) msg = 'Port matching ' + q + ' not found';
    else if (q instanceof Object || typeof q == 'undefined') msg = 'Port not found';
    else msg = 'Port "' + q + '" not found';
    port._crash(msg);
  }
  function _openMidiOut(port, arg) {
    if (this._bad) port._crash(this._err());
    else {
      var arr = _filterList(arg, _outs);
      if (!arr.length) { _notFound(port, arg); return; }
      var pack = function(x) { return function() { x.engine._openOut(this, x.name); }; };
      for (var i = 0; i < arr.length; i++) arr[i] = pack(arr[i]);
      port._slip(_tryAny, [arr]);
      port._resume();
    }
  }
  _J.prototype.openMidiOut = function(arg) {
    var port = new _M();
    this._push(_refresh, []);
    this._push(_openMidiOut, [port, arg]);
    return port._thenable();
  };
  _J.prototype._openMidiOutNR = function(arg) {
    var port = new _M();
    this._push(_openMidiOut, [port, arg]);
    return port._thenable();
  };

  function _openMidiIn(port, arg) {
    if (this._bad) port._crash(this._err());
    else {
      var arr = _filterList(arg, _ins);
      if (!arr.length) { _notFound(port, arg); return; }
      var pack = function(x) { return function() { x.engine._openIn(this, x.name); }; };
      for (var i = 0; i < arr.length; i++) arr[i] = pack(arr[i]);
      port._slip(_tryAny, [arr]);
      port._resume();
    }
  }
  _J.prototype.openMidiIn = function(arg) {
    var port = new _M();
    this._push(_refresh, []);
    this._push(_openMidiIn, [port, arg]);
    return port._thenable();
  };
  _J.prototype._openMidiInNR = function(arg) {
    var port = new _M();
    this._push(_openMidiIn, [port, arg]);
    return port._thenable();
  };

  function _onChange(watcher, arg) {
    if (this._bad) watcher._crash();
    else {
      watcher._slip(_connectW, [arg]);
      watcher._resume();
    }
  }
  _J.prototype.onChange = function(arg) {
    if (!this._orig._watcher) this._orig._watcher = new _W();
    var watcher = this._orig._watcher._image();
    this._push(_onChange, [watcher, arg]);
    return watcher._thenable();
  };

  _J.prototype._close = function() {
    _engine._close();
  };

  // _M: MIDI-In/Out object
  function _M() {
    _R.apply(this);
    this._handles = [];
    this._outs = [];
  }
  _M.prototype = new _R();
  _M.prototype._filter = function(msg) {
    if (this._orig._mpe) {
      var out;
      var outs = 0;
      if (this._handles && this._handles.length) {
        outs = this._handles.length;
        out = this._handles[0];
      }
      if (this._outs && this._outs.length) {
        outs = this._outs.length;
        out = this._outs[0];
      }
      if (outs == 1 && !out._mpe) {
        msg = this._orig._mpe.filter(msg);
      }
    }
    return msg;
  };
  _M.prototype._receive = function(msg) { this._emit(this._filter(msg)); };
  function _receive(msg) { if (!this._bad) this._receive(msg); }
  _M.prototype.send = function() {
    this._push(_receive, [_midi.apply(null, arguments)]);
    return this._thenable();
  };
  _M.prototype.note = function(c, n, v, t) {
    this.noteOn(c, n, v);
    if (typeof this._ch == 'undefined' && typeof this._master == 'undefined') {
      if (t > 0) this.wait(t).noteOff(c, n);
    }
    else {
      if (v > 0) this.wait(v).noteOff(c);
    }
    return this._thenable();
  };
  function _midi(msg) { return msg.isMidi2 ? new UMP(msg) : MIDI.apply(null, arguments); }
  _M.prototype._emit = function(msg) {
    var i, m;
    for (i = 0; i < this._handles.length; i++) {
      m = _midi(msg);
      this._handles[i].apply(this, [m._stamp(this)]);
    }
    for (i = 0; i < this._outs.length; i++) {
      m = _midi(msg);
      if (!m._stamped(this._outs[i])) this._outs[i].send(m._stamp(this));
    }
  };
  function _emit(msg) { this._emit(msg); }
  _M.prototype.emit = function(msg) {
    this._push(_emit, [msg]);
    return this._thenable();
  };
  function _connect(arg) {
    if (_func(arg)) _push(this._orig._handles, arg);
    else _push(this._orig._outs, arg);
  }
  function _disconnect(arg) {
    if (typeof arg == 'undefined') {
      this._orig._handles = [];
      this._orig._outs = [];
    }
    else if (_func(arg)) _pop(this._orig._handles, arg);
    else _pop(this._orig._outs, arg);
  }
  _M.prototype.connect = function(arg) {
    this._push(_connect, [arg]);
    return this._thenable();
  };
  _M.prototype.disconnect = function(arg) {
    this._push(_disconnect, [arg]);
    return this._thenable();
  };
  _M.prototype.connected = function() {
    return this._orig._handles.length + this._orig._outs.length;
  };
  _M.prototype._image = function() {
    var dup = this._dup();
    dup._gr = this._gr;
    dup._ch = this._ch;
    dup._sxid = this._sxid;
    dup._master = this._master;
    dup._band = this._band;
    return dup;
  };
  _M.prototype._sxid = 0x7f;

  _M.prototype.sxId = function(id) {
    if (typeof id == 'undefined') id = _M.prototype._sxid;
    if (id == this._sxid) return this._thenable();
    id = _7b(id);
    var img = this._image();
    img._sxid = id;
    this._push(_kick, [img]);
    return img._thenable();
  };
  _M.prototype.ch = function(c) {
    if (c == this._ch || typeof c == 'undefined' && typeof this._ch == 'undefined') return this._thenable();
    var img = this._image();
    if (typeof c != 'undefined') c = _ch(c);
    img._ch = c;
    img._master = undefined;
    img._band = undefined;
    this._push(_kick, [img]);
    return img._thenable();
  };
  _M.prototype.MIDI1 = function() {
    var img = this._image();
    img._ch = undefined;
    img._sxid = _M.prototype._sxid;
    img._master = undefined;
    img._band = undefined;
    this._push(_kick, [img]);
    return img._thenable();
  };
  _M.prototype.MIDI2 = function() {
    var img = this._image();
    img._ch = undefined;
    img._sxid = _M.prototype._sxid;
    img._master = undefined;
    img._band = undefined;
    var m2 = new _M2(img);
    this._push(_kick, [m2]);
    return m2._thenable();
  };

  function _mpe(m, n) {
    if (!this._orig._mpe) this._orig._mpe = new MPE();
    this._orig._mpe.setup(m, n);
  }
  _M.prototype.mpe = function(m, n) {
    if (m == this._master && n == this._band || typeof m == 'undefined' && typeof this._master == 'undefined') return this._thenable();
    if (typeof m != 'undefined') MPE.validate(m, n);
    if (!n) return this.ch(m);
    var img = this._image();
    img._ch = undefined;
    img._master = m;
    img._band = n;
    this._push(_mpe, [m, n]);
    this._push(_kick, [img]);
    return img._thenable();
  };
  function _validateChannel(c) {
    if (c != parseInt(c) || c < 0 || c > 15)
      throw RangeError('Bad channel value (must not be less than 0 or more than 15): ' + c);
  }

  // _M2: MIDI 2.0 adaptor
  function _M2(sink) {
    _R.apply(this);
    this._sink = sink;
  }
  _M2.prototype = new _R();
  _M2.prototype._sxid = _M.prototype._sxid;
  _M2.prototype._receive = function(msg) { this._sink._receive(msg); };
  function _midi2(msg) { return msg.isMidi && !msg.isMidi2 ? new MIDI(msg) : UMP.apply(null, arguments); }
  _M2.prototype.send = function() {
    this._push(_receive, [_midi2.apply(null, arguments)]);
    return this._thenable();
  };
  _M2.prototype._image = _M.prototype._image;
  _M2.prototype.connect = function(arg) {
    this._sink.connect(arg);
    this._push(_kick, [this._sink]);
    return this._thenable();
  };
  _M2.prototype.disconnect = function(arg) {
    this._sink.disconnect(arg);
    this._push(_kick, [this._sink]);
    return this._thenable();
  };
  _M2.prototype.connected = function() { return this._sink.connected(); };
  _M2.prototype.sxId = _M.prototype.sxId;
  _M2.prototype.ch = _M.prototype.ch;
  _M2.prototype.gr = function(g) {
    if (g == this._gr || typeof g == 'undefined' && typeof this._gr == 'undefined') return this._thenable();
    var img = this._image();
    if (typeof g != 'undefined') g = _7b(g);
    img._gr = g;
    this._push(_kick, [img]);
    return img._thenable();
  };
  _M2.prototype.MIDI1 = function() {
    var img = this._sink._image();
    this._push(_kick, [img]);
    return img._thenable();
  };
  _M2.prototype.MIDI2 = function() {
    var img = this._image();
    img._gr = undefined;
    img._ch = undefined;
    img._sxid = _M.prototype._sxid;
    this._push(_kick, [img]);
    return img._thenable();
  };

  // _W: Watcher object ~ MIDIAccess.onstatechange
  function _W() {
    _R.apply(this);
    this._handles = [];
    _rechain(this, _jzz, 'refresh');
    _rechain(this, _jzz, 'openMidiOut');
    _rechain(this, _jzz, 'openMidiIn');
    _rechain(this, _jzz, 'onChange');
    _rechain(this, _jzz, 'close');
  }
  _W.prototype = new _R();
  function _connectW(arg) {
    if (_func(arg)) {
      if (!this._orig._handles.length) _engine._watch();
      _push(this._orig._handles, arg);
    }
  }
  function _disconnectW(arg) {
    if (typeof arg == 'undefined') this._orig._handles = [];
    else _pop(this._orig._handles, arg);
    if (!this._orig._handles.length) _engine._unwatch();
  }
  _W.prototype.connect = function(arg) {
    this._push(_connectW, [arg]);
    return this._thenable();
  };
  _W.prototype.disconnect = function(arg) {
    this._push(_disconnectW, [arg]);
    return this._thenable();
  };
  function _changed(x0, y0, x1, y1) {
    var i;
    if (x0.length != x1.length || y0.length != y1.length) return true;
    for (i = 0; i < x0.length; i++) if (x0[i].name != x1[i].name) return true;
    for (i = 0; i < y0.length; i++) if (y0[i].name != y1[i].name) return true;
    return false;
  }
  function _diff(x0, y0, x1, y1) {
    if (!_changed(x0, y0, x1, y1)) return;
    var ax = []; // added
    var ay = [];
    var rx = []; // removed
    var ry = [];
    var i;
    var h = {};
    for (i = 0; i < x0.length; i++) h[x0[i].name] = true;
    for (i = 0; i < x1.length; i++) if (!h[x1[i].name]) ax.push(x1[i]);
    h = {};
    for (i = 0; i < x1.length; i++) h[x1[i].name] = true;
    for (i = 0; i < x0.length; i++) if (!h[x0[i].name]) rx.push(x0[i]);
    h = {};
    for (i = 0; i < y0.length; i++) h[y0[i].name] = true;
    for (i = 0; i < y1.length; i++) if (!h[y1[i].name]) ay.push(y1[i]);
    h = {};
    for (i = 0; i < y1.length; i++) h[y1[i].name] = true;
    for (i = 0; i < y0.length; i++) if (!h[y0[i].name]) ry.push(y0[i]);
    return { inputs: { added: ax, removed: rx }, outputs: { added: ay, removed: ry } };
  }
  function _fireW(arg) {
    for (i = 0; i < _jzz._watcher._handles.length; i++) _jzz._watcher._handles[i].apply(_jzz, [arg]);
  }

  var _jzz;
  var _engine = { _outs: [], _ins: [] };
  var _virtual = { _outs: [], _ins: [] };

  // Node.js
  function _tryNODE() {
    if (typeof module != 'undefined' && module.exports) {
      var jazzmidi = require('jazz-midi');
      if (jazzmidi) {
        _initNode(jazzmidi);
        return;
      }
    }
    this._break();
  }
  // Jazz-Plugin
  function _tryJazzPlugin() {
    var div = document.createElement('div');
    div.style.visibility = 'hidden';
    document.body.appendChild(div);
    var obj = document.createElement('object');
    obj.style.visibility = 'hidden';
    obj.style.width = '0px'; obj.style.height = '0px';
    obj.classid = 'CLSID:1ACE1618-1C7D-4561-AEE1-34842AA85E90';
    obj.type = 'audio/x-jazz';
    document.body.appendChild(obj);
    /* istanbul ignore next */
    if (obj.isJazz) {
      _initJazzPlugin(obj);
      return;
    }
    this._break();
  }

  // Web MIDI API
  var _navigator;
  var _requestMIDIAccess;
  function _findMidiAccess() {
    if (typeof navigator !== 'undefined' && navigator.requestMIDIAccess) {
      _navigator = navigator;
      _requestMIDIAccess = navigator.requestMIDIAccess;
      try {
        if (_requestMIDIAccess.toString().indexOf('JZZ(') != -1) _requestMIDIAccess = undefined;
      }
      catch (err) {}
    }
  }
  function _tryWebMIDI() {
    _findMidiAccess();
    if (_requestMIDIAccess) {
      var self = this;
      var onGood = function(midi) {
        _initWebMIDI(midi);
        self._resume();
      };
      var onBad = function(msg) {
        self._crash(msg);
      };
      var opt = {};
      _requestMIDIAccess.call(_navigator, opt).then(onGood, onBad);
      this._pause();
      return;
    }
    this._break();
  }
  function _tryWebMIDIsysex() {
    _findMidiAccess();
    if (_requestMIDIAccess) {
      var self = this;
      var onGood = function(midi) {
        _initWebMIDI(midi, true);
        self._resume();
      };
      var onBad = function(msg) {
        self._crash(msg);
      };
      var opt = { sysex:true };
      _requestMIDIAccess.call(_navigator, opt).then(onGood, onBad);
      this._pause();
      return;
    }
    this._break();
  }

  // Web-extension
  function _tryCRX() {
    var self = this;
    var inst;
    var msg;
    function eventHandle(evt) {
      inst = true;
      var a = evt.detail;
      if (!a) {
        if (!msg) msg = document.getElementById('jazz-midi-msg');
        if (!msg) return;
        try { a = JSON.parse(msg.innerText); } catch (err) {}
        msg.innerText = '';
      }
      document.removeEventListener('jazz-midi-msg', eventHandle);
      if (a[0] === 'version') {
        _initCRX(msg, a[2]);
        self._resume();
      }
      else {
        self._crash();
      }
    }
    this._pause();
    try {
      document.addEventListener('jazz-midi-msg', eventHandle);
      document.dispatchEvent(new Event('jazz-midi'));
    }
    catch (err) {}
    setTimeout(function() { if (!inst) self._crash(); }, 50);
  }

  /* istanbul ignore next */
  function _zeroBreak() {
    this._pause();
    var self = this;
    _schedule(function() { self._crash(); });
  }

  function _filterEngines(opt) {
    var ret = [];
    var arr = _filterEngineNames(opt);
    for (var i = 0; i < arr.length; i++) {
      if (arr[i] == 'webmidi') {
        if (opt && opt.sysex === true) ret.push(_tryWebMIDIsysex);
        if (!opt || opt.sysex !== true || opt.degrade === true) ret.push(_tryWebMIDI);
      }
      else if (arr[i] == 'node') { ret.push(_tryNODE); ret.push(_zeroBreak); }
      else if (arr[i] == 'extension') ret.push(_tryCRX);
      else if (arr[i] == 'plugin') ret.push(_tryJazzPlugin);
    }
    ret.push(_initNONE);
    return ret;
  }

  function _filterEngineNames(opt) {
    var web = ['node', 'extension', 'plugin', 'webmidi'];
    if (!opt || !opt.engine) return web;
    var arr = opt.engine instanceof Array ? opt.engine : [opt.engine];
    var dup = {};
    var none;
    var etc;
    var head = [];
    var tail = [];
    var i;
    for (i = 0; i < arr.length; i++) {
      var name = arr[i].toString().toLowerCase();
      if (dup[name]) continue;
      dup[name] = true;
      if (name === 'none') none = true;
      if (name === 'etc' || typeof name == 'undefined') etc = true;
      if (etc) tail.push(name); else head.push(name);
      _pop(web, name);
    }
    if (etc || head.length || tail.length) none = false;
    return none ? [] : head.concat(etc ? web : tail);
  }

  function _initJZZ(opt) {
    _jzz = new _J();
    _jzz._options = opt;
    _jzz._push(_tryAny, [_filterEngines(opt)]);
    _jzz.refresh();
    _jzz._resume();
  }

  function _initNONE() {
    _engine._type = 'none';
    _engine._version = _version;
    _engine._sysex = true;
    _engine._outs = [];
    _engine._ins = [];
    _engine._refresh = function() { _postRefresh(); };
    _engine._watch = _nop;
    _engine._unwatch = _nop;
    _engine._close = _nop;
  }
  // common initialization for Jazz-Plugin and jazz-midi
  function _initEngineJP() {
    _engine._inArr = [];
    _engine._outArr = [];
    _engine._inMap = {};
    _engine._outMap = {};
    _engine._outsW = [];
    _engine._insW = [];
    _engine._version = _engine._main.version;
    _engine._sysex = true;
    var watcher;
    function _closeAll() {
      for (var i = 0; i < this.clients.length; i++) this._close(this.clients[i]);
    }
    _engine._refresh = function() {
      _engine._outs = [];
      _engine._ins = [];
      var i, x;
      for (i = 0; (x = _engine._main.MidiOutInfo(i)).length; i++) {
        _engine._outs.push({ type: _engine._type, name: x[0], manufacturer: x[1], version: x[2] });
      }
      for (i = 0; (x = _engine._main.MidiInInfo(i)).length; i++) {
        _engine._ins.push({ type: _engine._type, name: x[0], manufacturer: x[1], version: x[2] });
      }
      _postRefresh();
    };
    _engine._openOut = function(port, name) {
      var impl = _engine._outMap[name];
      if (!impl) {
        if (_engine._pool.length <= _engine._outArr.length) _engine._pool.push(_engine._newPlugin());
        impl = {
          name: name,
          clients: [],
          info: {
            name: name,
            manufacturer: _engine._allOuts[name].manufacturer,
            version: _engine._allOuts[name].version,
            type: 'MIDI-out',
            sysex: _engine._sysex,
            engine: _engine._type
          },
          _close: function(port) { _engine._closeOut(port); },
          _closeAll: _closeAll,
          _receive: function(a) { if (a.length) this.plugin.MidiOutRaw(a.slice()); }
        };
        var plugin = _engine._pool[_engine._outArr.length];
        impl.plugin = plugin;
        _engine._outArr.push(impl);
        _engine._outMap[name] = impl;
      }
      if (!impl.open) {
        var s = impl.plugin.MidiOutOpen(name);
        if (s !== name) {
          if (s) impl.plugin.MidiOutClose();
          port._break(); return;
        }
        impl.open = true;
      }
      port._orig._impl = impl;
      _push(impl.clients, port._orig);
      port._info = impl.info;
      port._receive = function(arg) { impl._receive(arg); };
      port._close = function() { impl._close(this); };
    };
    _engine._openIn = function(port, name) {
      var impl = _engine._inMap[name];
      if (!impl) {
        if (_engine._pool.length <= _engine._inArr.length) _engine._pool.push(_engine._newPlugin());
        impl = {
          name: name,
          clients: [],
          info: {
            name: name,
            manufacturer: _engine._allIns[name].manufacturer,
            version: _engine._allIns[name].version,
            type: 'MIDI-in',
            sysex: _engine._sysex,
            engine: _engine._type
          },
          _close: function(port) { _engine._closeIn(port); },
          _closeAll: _closeAll,
          handle: function(t, a) {
            for (var i = 0; i < this.clients.length; i++) {
              var msg = MIDI(a);
              this.clients[i]._emit(msg);
            }
          }
        };
        var makeHandle = function(x) { return function(t, a) { x.handle(t, a); }; };
        impl.onmidi = makeHandle(impl);
        var plugin = _engine._pool[_engine._inArr.length];
        impl.plugin = plugin;
        _engine._inArr.push(impl);
        _engine._inMap[name] = impl;
      }
      if (!impl.open) {
        var s = impl.plugin.MidiInOpen(name, impl.onmidi);
        if (s !== name) {
          if (s) impl.plugin.MidiInClose();
          port._break(); return;
        }
        impl.open = true;
      }
      port._orig._impl = impl;
      _push(impl.clients, port._orig);
      port._info = impl.info;
      port._close = function() { impl._close(this); };
    };
    _engine._closeOut = function(port) {
      var impl = port._impl;
      _pop(impl.clients, port._orig);
      if (!impl.clients.length && impl.open) {
        impl.open = false;
        impl.plugin.MidiOutClose();
      }
    };
    _engine._closeIn = function(port) {
      var impl = port._impl;
      _pop(impl.clients, port._orig);
      if (!impl.clients.length && impl.open) {
        impl.open = false;
        impl.plugin.MidiInClose();
      }
    };
    _engine._close = function() {
      for (var i = 0; i < _engine._inArr.length; i++) if (_engine._inArr[i].open) _engine._inArr[i].plugin.MidiInClose();
      _engine._unwatch();
    };
    _engine._watch = function() {
      if (!watcher) watcher = setInterval(function() { _engine._refresh(); }, 250);
    };
    _engine._unwatch = function() {
      if (watcher) clearInterval(watcher);
      watcher = undefined;
    };
  }

  function _initNode(obj) {
    _engine._type = 'node';
    _engine._main = obj;
    _engine._pool = [];
    _engine._newPlugin = function() { return new obj.MIDI(); };
    _initEngineJP();
  }
  /* istanbul ignore next */
  function _initJazzPlugin(obj) {
    _engine._type = 'plugin';
    _engine._main = obj;
    _engine._pool = [obj];
    _engine._newPlugin = function() {
      var plg = document.createElement('object');
      plg.style.visibility = 'hidden';
      plg.style.width = '0px'; obj.style.height = '0px';
      plg.classid = 'CLSID:1ACE1618-1C7D-4561-AEE1-34842AA85E90';
      plg.type = 'audio/x-jazz';
      document.body.appendChild(plg);
      return plg.isJazz ? plg : undefined;
    };
    _initEngineJP();
  }
  function _initWebMIDI(access, sysex) {
    _engine._type = 'webmidi';
    _engine._version = 43;
    _engine._sysex = !!sysex;
    _engine._access = access;
    _engine._inMap = {};
    _engine._outMap = {};
    _engine._outsW = [];
    _engine._insW = [];
    var watcher;
    function _closeAll() {
      for (var i = 0; i < this.clients.length; i++) this._close(this.clients[i]);
    }
    _engine._refresh = function() {
      _engine._outs = [];
      _engine._ins = [];
      _engine._access.outputs.forEach(function(port) {
        _engine._outs.push({type: _engine._type, name: port.name, manufacturer: port.manufacturer, version: port.version});
      });
      _engine._access.inputs.forEach(function(port) {
        _engine._ins.push({type: _engine._type, name: port.name, manufacturer: port.manufacturer, version: port.version});
      });
      _postRefresh();
    };
    _engine._openOut = function(port, name) {
      var impl = _engine._outMap[name];
      if (!impl) {
        impl = {
          name: name,
          clients: [],
          info: {
            name: name,
            manufacturer: _engine._allOuts[name].manufacturer,
            version: _engine._allOuts[name].version,
            type: 'MIDI-out',
            sysex: _engine._sysex,
            engine: _engine._type
          },
          _close: function(port) { _engine._closeOut(port); },
          _closeAll: _closeAll,
          _receive: function(a) { if (impl.dev && a.length) this.dev.send(a.slice()); }
        };
      }
      var found;
      _engine._access.outputs.forEach(function(dev) {
        if (dev.name === name) found = dev;
      });
      if (found) {
        impl.dev = found;
        _engine._outMap[name] = impl;
        port._orig._impl = impl;
        _push(impl.clients, port._orig);
        port._info = impl.info;
        port._receive = function(arg) { impl._receive(arg); };
        port._close = function() { impl._close(this); };
        if (impl.dev.open) {
          port._pause();
          impl.dev.open().then(function() {
            port._resume();
          }, function() {
            port._crash();
          });
        }
      }
      else port._break();
    };
    _engine._openIn = function(port, name) {
      var impl = _engine._inMap[name];
      if (!impl) {
        impl = {
          name: name,
          clients: [],
          info: {
            name: name,
            manufacturer: _engine._allIns[name].manufacturer,
            version: _engine._allIns[name].version,
            type: 'MIDI-in',
            sysex: _engine._sysex,
            engine: _engine._type
          },
          _close: function(port) { _engine._closeIn(port); },
          _closeAll: _closeAll,
          handle: function(evt) {
            for (var i = 0; i < this.clients.length; i++) {
              var msg = MIDI([].slice.call(evt.data));
              this.clients[i]._emit(msg);
            }
          }
        };
      }
      var found;
      _engine._access.inputs.forEach(function(dev) {
        if (dev.name === name) found = dev;
      });
      if (found) {
        impl.dev = found;
        var makeHandle = function(x) { return function(evt) { x.handle(evt); }; };
        impl.dev.onmidimessage = makeHandle(impl);
        _engine._inMap[name] = impl;
        port._orig._impl = impl;
        _push(impl.clients, port._orig);
        port._info = impl.info;
        port._close = function() { impl._close(this); };
        if (impl.dev.open) {
          port._pause();
          impl.dev.open().then(function() {
            port._resume();
          }, function() {
            port._crash();
          });
        }
      }
      else port._break();
    };
    _engine._closeOut = function(port) {
      var impl = port._impl;
      _pop(impl.clients, port._orig);
      if (!impl.clients.length) {
        if (impl.dev && impl.dev.close) impl.dev.close();
        impl.dev = undefined;
      }
    };
    _engine._closeIn = function(port) {
      var impl = port._impl;
      _pop(impl.clients, port._orig);
      if (!impl.clients.length) {
        if (impl.dev) {
          impl.dev.onmidimessage = null;
          if (impl.dev.close) impl.dev.close();
        }
        impl.dev = undefined;
      }
    };
    _engine._close = function() {
      _engine._unwatch();
    };
    _engine._watch = function() {
      _engine._access.onstatechange = function() {
        watcher = true;
        _schedule(function() {
          if (watcher) {
            _engine._refresh();
            watcher = false;
          }
        });
      };
    };
    _engine._unwatch = function() {
      _engine._access.onstatechange = undefined;
    };
  }
  function _initCRX(msg, ver) {
    _engine._type = 'extension';
    _engine._version = ver;
    _engine._sysex = true;
    _engine._pool = [];
    _engine._outs = [];
    _engine._ins = [];
    _engine._inArr = [];
    _engine._outArr = [];
    _engine._inMap = {};
    _engine._outMap = {};
    _engine._outsW = [];
    _engine._insW = [];
    _engine.refreshClients = [];
    _engine._msg = msg;
    _engine._newPlugin = function() {
      var plugin = { id: _engine._pool.length };
      _engine._pool.push(plugin);
      if (!plugin.id) plugin.ready = true;
      else document.dispatchEvent(new CustomEvent('jazz-midi', { detail: ['new'] }));
    };
    _engine._newPlugin();
    _engine._refresh = function(client) {
      _engine.refreshClients.push(client);
      client._pause();
      _schedule(function() {
        document.dispatchEvent(new CustomEvent('jazz-midi', { detail: ['refresh'] }));
      });
    };
    function _closeAll() {
      for (var i = 0; i < this.clients.length; i++) this._close(this.clients[i]);
    }
    _engine._openOut = function(port, name) {
      var impl = _engine._outMap[name];
      if (!impl) {
        if (_engine._pool.length <= _engine._outArr.length) _engine._newPlugin();
        var plugin = _engine._pool[_engine._outArr.length];
        impl = {
          name: name,
          clients: [],
          info: {
            name: name,
            manufacturer: _engine._allOuts[name].manufacturer,
            version: _engine._allOuts[name].version,
            type: 'MIDI-out',
            sysex: _engine._sysex,
            engine: _engine._type
          },
          _start: function() { document.dispatchEvent(new CustomEvent('jazz-midi', { detail: ['openout', plugin.id, name] })); },
          _close: function(port) { _engine._closeOut(port); },
          _closeAll: _closeAll,
          _receive: function(a) { if (a.length) { var v = a.slice(); v.splice(0, 0, 'play', plugin.id); document.dispatchEvent(new CustomEvent('jazz-midi', {detail: v})); } }
        };
        impl.plugin = plugin;
        plugin.output = impl;
        _engine._outArr.push(impl);
        _engine._outMap[name] = impl;
      }
      port._orig._impl = impl;
      _push(impl.clients, port._orig);
      port._info = impl.info;
      port._receive = function(arg) { impl._receive(arg); };
      port._close = function() { impl._close(this); };
      if (!impl.open) {
        port._pause();
        if (impl.plugin.ready) impl._start();
      }
    };
    _engine._openIn = function(port, name) {
      var impl = _engine._inMap[name];
      if (!impl) {
        if (_engine._pool.length <= _engine._inArr.length) _engine._newPlugin();
        var plugin = _engine._pool[_engine._inArr.length];
        impl = {
          name: name,
          clients: [],
          info: {
            name: name,
            manufacturer: _engine._allIns[name].manufacturer,
            version: _engine._allIns[name].version,
            type: 'MIDI-in',
            sysex: _engine._sysex,
            engine: _engine._type
          },
          _start: function() { document.dispatchEvent(new CustomEvent('jazz-midi', { detail: ['openin', plugin.id, name] })); },
          _close: function(port) { _engine._closeIn(port); },
          _closeAll: _closeAll
        };
        impl.plugin = plugin;
        plugin.input = impl;
        _engine._inArr.push(impl);
        _engine._inMap[name] = impl;
      }
      port._orig._impl = impl;
      _push(impl.clients, port._orig);
      port._info = impl.info;
      port._close = function() { impl._close(this); };
      if (!impl.open) {
        port._pause();
        if (impl.plugin.ready) impl._start();
      }
    };
    _engine._closeOut = function(port) {
      var impl = port._impl;
      _pop(impl.clients, port._orig);
      if (!impl.clients.length && impl.open) {
        impl.open = false;
        document.dispatchEvent(new CustomEvent('jazz-midi', { detail: ['closeout', impl.plugin.id] }));
      }
    };
    _engine._closeIn = function(port) {
      var impl = port._impl;
      _pop(impl.clients, port._orig);
      if (!impl.clients.length && impl.open) {
        impl.open = false;
        document.dispatchEvent(new CustomEvent('jazz-midi', { detail: ['closein', impl.plugin.id] }));
      }
    };
    _engine._close = function() {
      _engine._unwatch();
    };
    var watcher;
    _engine._watch = function() {
      _engine._insW = _engine._ins;
      _engine._outsW = _engine._outs;
      watcher = setInterval(function() {
        document.dispatchEvent(new CustomEvent('jazz-midi', {detail:['refresh']}));
      }, 250);
    };
    _engine._unwatch = function() {
      clearInterval(watcher);
      watcher = undefined;
    };
    document.addEventListener('jazz-midi-msg', function(evt) {
      var i, j, impl;
      var v = evt.detail ? [ evt.detail ] : undefined;
      if (!v) {
        v = _engine._msg.innerText.split('\n');
        _engine._msg.innerText = '';
        for (i = 0; i < v.length; i++) try { v[i] = JSON.parse(v[i]); } catch (err) { v[i] = []; }
      }
      for (i = 0; i < v.length; i++) {
        var a = v[i];
        if (!a.length) continue;
        if (a[0] === 'refresh') {
          if (a[1].ins) {
            for (j = 0; j < a[1].ins.length; j++) a[1].ins[j].type = _engine._type;
            _engine._ins = a[1].ins;
          }
          if (a[1].outs) {
            for (j = 0; j < a[1].outs.length; j++) a[1].outs[j].type = _engine._type;
            _engine._outs = a[1].outs;
          }
          _postRefresh();
          for (j = 0; j < _engine.refreshClients.length; j++) _engine.refreshClients[j]._resume();
          _engine.refreshClients = [];
        }
        else if (a[0] === 'version') {
          var plugin = _engine._pool[a[1]];
          if (plugin) {
            plugin.ready = true;
            if (plugin.input) plugin.input._start();
            if (plugin.output) plugin.output._start();
          }
        }
        else if (a[0] === 'openout') {
          impl = _engine._pool[a[1]].output;
          if (impl) {
            if (a[2] == impl.name) {
              impl.open = true;
              if (impl.clients) for (j = 0; j < impl.clients.length; j++) impl.clients[j]._resume();
            }
            else if (impl.clients) for (j = 0; j < impl.clients.length; j++) impl.clients[j]._crash();
          }
        }
        else if (a[0] === 'openin') {
          impl = _engine._pool[a[1]].input;
          if (impl) {
            if (a[2] == impl.name) {
              impl.open = true;
              if (impl.clients) for (j = 0; j < impl.clients.length; j++) impl.clients[j]._resume();
            }
            else if (impl.clients) for (j = 0; j < impl.clients.length; j++) impl.clients[j]._crash();
          }
        }
        else if (a[0] === 'midi') {
          impl = _engine._pool[a[1]].input;
          if (impl && impl.clients) {
            for (j = 0; j < impl.clients.length; j++) {
              var msg = MIDI(a.slice(3));
              impl.clients[j]._emit(msg);
            }
          }
        }
      }
    });
  }

  var JZZ = function(opt) {
    if (!_jzz) _initJZZ(opt);
    return _jzz._thenable();
  };
  JZZ.JZZ = JZZ;
  JZZ.version = _version;
  JZZ.info = function() { return _J.prototype.info(); };

  function Widget(arg) {
    var self = new _M();
    if (arg instanceof Object) _for(arg, function(k) { self[k] = arg[k]; });
    self._resume();
    return self;
  }
  JZZ.Widget = Widget;
  _J.prototype.Widget = JZZ.Widget;

  JZZ.addMidiIn = function(name, widget) {
    var info = _clone(widget._info || {});
    info.name = name;
    info.type = info.type || 'javascript';
    info.manufacturer = info.manufacturer || 'virtual';
    info.version = info.version || '0.0';
    var engine = {
      _info: function() { return info; },
      _openIn: function(port) {
        port._pause();
        port._info = _clone(info);
        port._close = function() { widget.disconnect(port); };
        widget.connect(port);
        port._resume();
      }
    };
    return JZZ.lib.registerMidiIn(name, engine);
  };
  _J.prototype.addMidiIn = JZZ.addMidiIn;
  JZZ.addMidiOut = function(name, widget) {
    var info = _clone(widget._info || {});
    info.name = name;
    info.type = info.type || 'javascript';
    info.manufacturer = info.manufacturer || 'virtual';
    info.version = info.version || '0.0';
    var engine = {
      _info: function() { return info; },
      _openOut: function(port) {
        port._pause();
        port._info = _clone(info);
        port._close = function() { port.disconnect(); };
        _connect.apply(port, [widget]);
        port._resume();
      }
    };
    return JZZ.lib.registerMidiOut(name, engine);
  };
  _J.prototype.addMidiOut = JZZ.addMidiOut;
  JZZ.maskMidiIn = function(name) { _insM[name] = true; };
  _J.prototype.maskMidiIn = JZZ.maskMidiIn;
  JZZ.unmaskMidiIn = function(name) { delete _insM[name]; };
  _J.prototype.unmaskMidiIn = JZZ.unmaskMidiIn;
  JZZ.maskMidiOut = function(name) { _outsM[name] = true; };
  _J.prototype.maskMidiOut = JZZ.maskMidiOut;
  JZZ.unmaskMidiOut = function(name) { delete _outsM[name]; };
  _J.prototype.unmaskMidiOut = JZZ.unmaskMidiOut;

  // JZZ.SMPTE

  function SMPTE() {
    var self = this instanceof SMPTE ? this : self = new SMPTE();
    SMPTE.prototype.reset.apply(self, arguments);
    return self;
  }
  SMPTE.prototype.reset = function(arg) {
    if (arg instanceof SMPTE) {
      this.setType(arg.getType());
      this.setHour(arg.getHour());
      this.setMinute(arg.getMinute());
      this.setSecond(arg.getSecond());
      this.setFrame(arg.getFrame());
      this.setQuarter(arg.getQuarter());
      return this;
    }
    var arr = arg instanceof Array ? arg : arguments;
    this.setType(arr[0]);
    this.setHour(arr[1]);
    this.setMinute(arr[2]);
    this.setSecond(arr[3]);
    this.setFrame(arr[4]);
    this.setQuarter(arr[5]);
    return this;
  };
  function _fixDropFrame() { if (this.type == 29.97 && !this.second && this.frame < 2 && this.minute % 10) this.frame = 2; }
  SMPTE.prototype.isFullFrame = function() { return this.quarter == 0 || this.quarter == 4; };
  SMPTE.prototype.getType = function() { return this.type; };
  SMPTE.prototype.getHour = function() { return this.hour; };
  SMPTE.prototype.getMinute = function() { return this.minute; };
  SMPTE.prototype.getSecond = function() { return this.second; };
  SMPTE.prototype.getFrame = function() { return this.frame; };
  SMPTE.prototype.getQuarter = function() { return this.quarter; };
  SMPTE.prototype.setType = function(x) {
    if (typeof x == 'undefined' || x == 24) this.type = 24;
    else if (x == 25) this.type = 25;
    else if (x == 29.97) { this.type = 29.97; _fixDropFrame.apply(this); }
    else if (x == 30) this.type = 30;
    else throw RangeError('Bad SMPTE frame rate: ' + x);
    if (this.frame >= this.type) this.frame = this.type - 1; // could not be more than 29
    return this;
  };
  SMPTE.prototype.setHour = function(x) {
    if (typeof x == 'undefined') x = 0;
    if (x != parseInt(x) || x < 0 || x >= 24) throw RangeError('Bad SMPTE hours value: ' + x);
    this.hour = x;
    return this;
  };
  SMPTE.prototype.setMinute = function(x) {
    if (typeof x == 'undefined') x = 0;
    if (x != parseInt(x) || x < 0 || x >= 60) throw RangeError('Bad SMPTE minutes value: ' + x);
    this.minute = x;
    _fixDropFrame.apply(this);
    return this;
  };
  SMPTE.prototype.setSecond = function(x) {
    if (typeof x == 'undefined') x = 0;
    if (x != parseInt(x) || x < 0 || x >= 60) throw RangeError('Bad SMPTE seconds value: ' + x);
    this.second = x;
    _fixDropFrame.apply(this);
    return this;
  };
  SMPTE.prototype.setFrame = function(x) {
    if (typeof x == 'undefined') x = 0;
    if (x != parseInt(x) || x < 0 || x >= this.type) throw RangeError('Bad SMPTE frame number: ' + x);
    this.frame = x;
    _fixDropFrame.apply(this);
    return this;
  };
  SMPTE.prototype.setQuarter = function(x) {
    if (typeof x == 'undefined') x = 0;
    if (x != parseInt(x) || x < 0 || x >= 8) throw RangeError('Bad SMPTE quarter frame: ' + x);
    this.quarter = x;
    return this;
  };
  SMPTE.prototype.incrFrame = function() {
    this.frame++;
    if (this.frame >= this.type) {
      this.frame = 0;
      this.second++;
      if (this.second >= 60) {
        this.second = 0;
        this.minute++;
        if (this.minute >= 60) {
          this.minute = 0;
          this.hour = this.hour >= 23 ? 0 : this.hour + 1;
        }
      }
    }
    _fixDropFrame.apply(this);
    return this;
  };
  SMPTE.prototype.decrFrame = function() {
    if (!this.second && this.frame == 2 && this.type == 29.97 && this.minute % 10) this.frame = 0; // drop-frame
    this.frame--;
    if (this.frame < 0) {
      this.frame = this.type == 29.97 ? 29 : this.type - 1;
      this.second--;
      if (this.second < 0) {
        this.second = 59;
        this.minute--;
        if (this.minute < 0) {
          this.minute = 59;
          this.hour = this.hour ? this.hour - 1 : 23;
        }
      }
    }
    return this;
  };
  SMPTE.prototype.incrQF = function() {
    this.backwards = false;
    this.quarter = (this.quarter + 1) & 7;
    if (this.quarter == 0 || this.quarter == 4) this.incrFrame();
    return this;
  };
  SMPTE.prototype.decrQF = function() {
    this.backwards = true;
    this.quarter = (this.quarter + 7) & 7;
    if (this.quarter == 3 || this.quarter == 7) this.decrFrame();
    return this;
  };
  function _825(a) { return [[24, 25, 29.97, 30][(a[7] >> 1) & 3], ((a[7] & 1) << 4) | a[6], (a[5] << 4) | a[4], (a[3] << 4) | a[2], (a[1] << 4) | a[0]]; }
  SMPTE.prototype.read = function(m) {
    if (!(m instanceof MIDI)) m = MIDI.apply(null, arguments);
    if (m[0] == 0xf0 && m[1] == 0x7f && m[3] == 1 && m[4] == 1 && m[9] == 0xf7) {
      this.type = [24, 25, 29.97, 30][(m[5] >> 5) & 3];
      this.hour = m[5] & 31;
      this.minute = m[6];
      this.second = m[7];
      this.frame = m[8];
      this.quarter = 0;
      this._ = undefined;
      this._b = undefined;
      this._f = undefined;
      return true;
    }
    if (m[0] == 0xf1 && typeof m[1] != 'undefined') {
      var q = m[1] >> 4;
      var n = m[1] & 15;
      if (q == 0) {
        if (this._ == 7) {
          if (this._f == 7) {
            this.reset(_825(this._a));
            this.incrFrame();
          }
          this.incrFrame();
        }
      }
      else if (q == 3) {
        if (this._ == 4) {
          this.decrFrame();
        }
      }
      else if (q == 4) {
        if (this._ == 3) {
          this.incrFrame();
        }
      }
      else if (q == 7) {
        if (this._ === 0) {
          if (this._b === 0) {
            this.reset(_825(this._a));
            this.decrFrame();
          }
          this.decrFrame();
        }
      }
      if (!this._a) this._a = [];
      this._a[q] = n;
      this._f = this._f === q - 1 || q == 0 ? q : undefined;
      this._b = this._b === q + 1 || q == 7 ? q : undefined;
      this._ = q;
      this.quarter = q;
      return true;
    }
    return false;
  };
  function _mtc(t) {
    if (!t.backwards && t.quarter >= 4) t.decrFrame(); // continue encoding previous frame
    else if (t.backwards && t.quarter < 4) t.incrFrame();
    var ret;
    switch (t.quarter >> 1) {
      case 0: ret = t.frame; break;
      case 1: ret = t.second; break;
      case 2: ret = t.minute; break;
      default: ret = t.hour;
    }
    if (t.quarter & 1) ret >>= 4;
    else ret &= 15;
    if (t.quarter == 7) {
      if (t.type == 25) ret |= 2;
      else if (t.type == 29.97) ret |= 4;
      else if (t.type == 30) ret |= 6;
    }
    // restore original t
    if (!t.backwards && t.quarter >= 4) t.incrFrame();
    else if (t.backwards && t.quarter < 4) t.decrFrame();
    return ret | (t.quarter << 4);
  }
  function _hrtype(t) {
    if (t.type == 25) return t.hour | 0x20;
    if (t.type == 29.97) return t.hour | 0x40;
    if (t.type == 30) return t.hour | 0x60;
    return t.hour;
  }
  function _dec(x) { return x < 10 ? '0' + x : x; }
  function _smptetxt(x) {
    var arr = [];
    for (var i = 0; i < x.length; i++) arr[i] = _dec(i ? x[i] : x[i] & 0x1f);
    return arr.join(':');
  }
  SMPTE.prototype.toString = function() { return _smptetxt([this.hour, this.minute, this.second, this.frame]); };
  JZZ.SMPTE = SMPTE;
  _J.prototype.SMPTE = SMPTE;

  // JZZ.MIDI

  function MIDI(arg) {
    var self = this instanceof MIDI ? this : self = new MIDI();
    var i;
    if (arg instanceof MIDI) {
      self._from = arg._from.slice();
      _for(arg, function(i) { if (i != '_from') self[i] = arg[i]; });
      return self;
    }
    else self._from = [];
    if (typeof arg == 'undefined') return self;
    var arr = arg instanceof Array ? arg : arguments;
    for (i = 0; i < arr.length; i++) {
      n = arr[i];
      if (i == 1) {
        if (self[0] >= 0x80 && self[0] <= 0xAF) n = MIDI.noteValue(n);
        if (self[0] >= 0xC0 && self[0] <= 0xCF) n = MIDI.programValue(n);
      }
      if (n != parseInt(n) || n < 0 || n > 255) _throw(arr[i]);
      self.push(n);
    }
    return self;
  }
  MIDI.prototype = [];
  MIDI.prototype.constructor = MIDI;
  MIDI.prototype.isMidi = function() { return 1; };
  var _noteNum = {};
  MIDI.noteValue = function(x) { return typeof x == 'undefined' ? undefined : _noteNum[x.toString().toLowerCase()]; };
  MIDI.programValue = function(x) { return x; };
  MIDI.octaveValue = function(x) {
    var n = _noteNum[x.toString().toLowerCase()];
    if (typeof n == 'undefined') n = _noteNum[x.toString().toLowerCase() + '1'];
    return typeof n == 'undefined' ? undefined : n % 12;
  };
  MIDI.freq = function(n, a) {
    if (typeof a == 'undefined') a = 440.0;
    _float(a);
    if (n != parseFloat(n)) n = _7bn(n);
    return (a * Math.pow(2, (n - 69.0) / 12.0));
  };
  function _float(x) { if (x != parseFloat(x)) throw TypeError('Not a number: ' + x); }
  MIDI.shift = function(f, f0) {
    if (typeof f0 == 'undefined') f0 = 440;
    _float(f);
    _float(f0);
    return Math.log2(f / f0) * 12;
  };
  MIDI.midi = function(f, f0) {
    if (f != parseFloat(f)) return _7bn(f);
    return MIDI.shift(f, f0) + 69;
  };
  MIDI.to7b = function(x) {
    _float(x);
    return x <= 0 ? 0 : x >= 1 ? 0x7f : Math.floor(x * 0x80);
  };
  MIDI.to14b = function(x) {
    _float(x);
    return x <= 0 ? 0 : x >= 1 ? 0x3fff : Math.floor(x * 0x4000);
  };
  MIDI.to21b = function(x) {
    if (typeof x == 'undefined') return 0x1fffff;
    _float(x);
    if (x <= 0) return 0;
    x = (Math.floor(x) << 14) + MIDI.to14b(x - Math.floor(x));
    return x < 0x1fffff ? x : 0x1ffffe;
  };
  function _MIDI() {}
  _MIDI.prototype = MIDI;
  MIDI._sxid = 0x7f;
  MIDI.sxId = function(id) {
    if (typeof id == 'undefined') id = MIDI._sxid;
    if (id == this._sxid) return this;
    id = _7b(id);
    var ret = new _MIDI();
    ret._ch = this._ch;
    ret._sxid = id;
    return ret;
  };
  MIDI.ch = function(c) {
    if (c == this._ch || typeof c == 'undefined' && typeof this._ch == 'undefined') return this;
    var ret = new _MIDI();
    if (typeof c != 'undefined') c = _ch(c);
    ret._ch = c;
    ret._sxid = this._sxid;
    return ret;
  };

  var _noteMap = { c:0, d:2, e:4, f:5, g:7, a:9, b:11, h:11 };
  _for(_noteMap, function(k) {
    for (n = 0; n < 12; n++) {
      m = _noteMap[k] + n * 12;
      if (m > 127) break;
      _noteNum[k + n] = m; _noteNum[k + '♮' + n] = m;
      if (m > 0) {
        _noteNum[k + 'b' + n] = m - 1; _noteNum[k + '♭' + n] = m - 1;
        _noteNum[k + 'bb' + n] = m - 2; _noteNum[k + '♭♭' + n] = m - 2; _noteNum[k + '𝄫' + n] = m - 2;
      }
      if (m < 127) {
        _noteNum[k + '#' + n] = m + 1; _noteNum[k + '♯' + n] = m + 1;
        _noteNum[k + '##' + n] = m + 2; _noteNum[k + '♯♯' + n] = m + 2; _noteNum[k + '𝄪' + n] = m + 2;
      }
    }
  });
  for (n = 0; n < 128; n++) _noteNum[n] = n;
  function _throw(x) { throw RangeError('Bad MIDI value: ' + x); }
  function _bad(x) { throw TypeError('Invalid value: ' + x); }
  function _oor(x) { throw RangeError('Out of range: ' + x); }
  function _ch(c) { _validateChannel(c); return parseInt(c); }
  function _4b(n) { if (n != parseInt(n) || n < 0 || n > 0xf) throw RangeError('Expected a 4-bit value: ' + n); return parseInt(n); }
  function _7b(n, m) { if (n != parseInt(n) || n < 0 || n > 0x7f) _throw(typeof m == 'undefined' ? n : m); return parseInt(n); }
  function _8b(n) { if (n != parseInt(n) || n < 0 || n > 0xff) _throw(n); return parseInt(n); }
  function _14b(n) { if (n != parseInt(n) || n < 0 || n > 0x3fff) _throw(n); return parseInt(n); }
  function _16b(n) { if (n != parseInt(n) || n < 0 || n > 0xffff) throw RangeError('Expected a 16-bit value: ' + n); return parseInt(n); }
  function _20b(n) { if (n != parseInt(n) || n < 0 || n > 0xfffff) throw RangeError('Expected a 20-bit value: ' + n); return parseInt(n); }
  function _21b(n) { if (n != parseInt(n) || n < 0 || n > 0x1fffff) _throw(n); return parseInt(n); }
  function _32b(n) { if (n != parseInt(n) || n < 0 || n > 0xffffffff) _throw(n); return parseInt(n); }
  function _7bn(n) { return _7b(MIDI.noteValue(n), n); }
  function _lsb(n) { return _14b(n) & 0x7f; }
  function _msb(n) { return _14b(n) >> 7; }
  function _8bs(s) { s = '' + s; for (var i = 0; i < s.length; i++) if (s.charCodeAt(i) > 255) _throw(s[i]); return s; }
  function _to777(n) { return [n >> 14, (n >> 7) & 0x7f, n & 0x7f]; }
  function _01(x, y) {
    if (x != parseFloat(x)) _bad(typeof y == 'undefined' ? x : y);
    if (x < 0 || x > 1) _oor(typeof y == 'undefined' ? x : y);
    return parseFloat(x);
 }
  function _rt(b) { return typeof b != 'undefined' && !b ? 0x7E : 0x7F; }
  function _ntu(x) {
    var k, m;
    var kkk = [];
    var vvv = {};
    _for(x, function(k) {
      m = _21b(x[k]);
      k = _7bn(k);
      if (k in vvv) throw RangeError('Duplicate MIDI value: ' + k);
      kkk.push(k);
      vvv[k] = m;
    });
    kkk.sort();
    var out = [kkk.length];
    for (k = 0; k < kkk.length; k++) out = out.concat([kkk[k]], _to777(vvv[kkk[k]]));
    return out;
  }
  function _f2ntu(x) {
    var out = {};
    _for (x, function(k) { out[k] = MIDI.to21b(x[k] == parseFloat(x[k]) ? x[k] : _7bn(x[k])); });
    return out;
  }
  function _hz2ntu(x) {
    var out = {};
    _for (x, function(k) { out[k] = MIDI.to21b(MIDI.midi(x[k])); });
    return out;
  }
  function _12x7(a) {
    var out = [];
    if (!(a instanceof Array) || a.length != 12) throw TypeError('Expected an array of size 12');
    for (var i = 0; i < 12; i++) out.push(_7b(a[i]));
    return out;
  }
  function _12x14(a) {
    var out = [];
    if (!(a instanceof Array) || a.length != 12) throw TypeError('Expected an array of size 12');
    for (var i = 0; i < 12; i++) {
      out.push(_msb(a[i]));
      out.push(_lsb(a[i]));
    }
    return out;
  }
  var _helperMPE = {
    noteOff: function(c, n, v) { if (typeof v == 'undefined') v = 64; return [0x80 + _ch(c), _7bn(n), _7b(v)]; },
    noteOn: function(c, n, v) { if (typeof v == 'undefined') v = 127; return [0x90 + _ch(c), _7bn(n), _7b(v)]; },
    aftertouch: function(c, n, v) { return [0xA0 + _ch(c), _7bn(n), _7b(v)]; }
  };
  var _helperCH = {
    control: function(c, n, v) { return [0xB0 + _ch(c), _7b(n), _7b(v)]; },
    program: function(c, n) { return [0xC0 + _ch(c), _7b(MIDI.programValue(n), n)]; },
    pressure: function(c, n) { return [0xD0 + _ch(c), _7b(n)]; },
    pitchBend: function(c, n, l) { return typeof l == 'undefined' ? [0xE0 + _ch(c), _lsb(n), _msb(n)] : [0xE0 + _ch(c), _7b(l), _7b(n)]; },
    pitchBendF: function(c, x) { return _helperCH.pitchBend(c, MIDI.to14b((x + 1) / 2)); },
    bankMSB: function(c, n) { return [0xB0 + _ch(c), 0x00, _7b(n)]; },
    bankLSB: function(c, n) { return [0xB0 + _ch(c), 0x20, _7b(n)]; },
    modMSB: function(c, n) { return [0xB0 + _ch(c), 0x01, _7b(n)]; },
    modLSB: function(c, n) { return [0xB0 + _ch(c), 0x21, _7b(n)]; },
    breathMSB: function(c, n) { return [0xB0 + _ch(c), 0x02, _7b(n)]; },
    breathLSB: function(c, n) { return [0xB0 + _ch(c), 0x22, _7b(n)]; },
    footMSB: function(c, n) { return [0xB0 + _ch(c), 0x04, _7b(n)]; },
    footLSB: function(c, n) { return [0xB0 + _ch(c), 0x24, _7b(n)]; },
    portamentoMSB: function(c, n) { return [0xB0 + _ch(c), 0x05, _7b(n)]; },
    portamentoLSB: function(c, n) { return [0xB0 + _ch(c), 0x25, _7b(n)]; },
    dataMSB: function(c, n) { return [0xB0 + _ch(c), 0x06, _7b(n)]; },
    dataLSB: function(c, n) { return [0xB0 + _ch(c), 0x26, _7b(n)]; },
    volumeMSB: function(c, n) { return [0xB0 + _ch(c), 0x07, _7b(n)]; },
    volumeLSB: function(c, n) { return [0xB0 + _ch(c), 0x27, _7b(n)]; },
    balanceMSB: function(c, n) { return [0xB0 + _ch(c), 0x08, _7b(n)]; },
    balanceLSB: function(c, n) { return [0xB0 + _ch(c), 0x28, _7b(n)]; },
    panMSB: function(c, n) { return [0xB0 + _ch(c), 0x0A, _7b(n)]; },
    panLSB: function(c, n) { return [0xB0 + _ch(c), 0x2A, _7b(n)]; },
    expressionMSB: function(c, n) { return [0xB0 + _ch(c), 0x0B, _7b(n)]; },
    expressionLSB: function(c, n) { return [0xB0 + _ch(c), 0x2B, _7b(n)]; },
    damper: function(c, b) { if (typeof b == 'undefined') b = true; return [0xB0 + _ch(c), 0x40, b ? 127 : 0]; },
    portamento: function(c, b) { if (typeof b == 'undefined') b = true; return [0xB0 + _ch(c), 0x41, b ? 127 : 0]; },
    sostenuto: function(c, b) { if (typeof b == 'undefined') b = true; return [0xB0 + _ch(c), 0x42, b ? 127 : 0]; },
    soft: function(c, b) { if (typeof b == 'undefined') b = true; return [0xB0 + _ch(c), 0x43, b ? 127 : 0]; },
    legato: function(c, b) { if (typeof b == 'undefined') b = true; return [0xB0 + _ch(c), 0x44, b ? 127 : 0]; },
    hold2: function(c, b) { if (typeof b == 'undefined') b = true; return [0xB0 + _ch(c), 0x45, b ? 127 : 0]; },
    soundVariation: function(c, n) { return [0xB0 + _ch(c), 0x46, _7bn(n)]; },
    filterResonance: function(c, n) { return [0xB0 + _ch(c), 0x47, _7bn(n)]; },
    releaseTime: function(c, n) { return [0xB0 + _ch(c), 0x48, _7bn(n)]; },
    attackTime: function(c, n) { return [0xB0 + _ch(c), 0x49, _7bn(n)]; },
    brightness: function(c, n) { return [0xB0 + _ch(c), 0x4A, _7bn(n)]; },
    decayTime: function(c, n) { return [0xB0 + _ch(c), 0x4B, _7bn(n)]; },
    vibratoRate: function(c, n) { return [0xB0 + _ch(c), 0x4C, _7bn(n)]; },
    vibratoDepth: function(c, n) { return [0xB0 + _ch(c), 0x4D, _7bn(n)]; },
    vibratoDelay: function(c, n) { return [0xB0 + _ch(c), 0x4E, _7bn(n)]; },
    ptc: function(c, n) { return [0xB0 + _ch(c), 0x54, _7bn(n)]; },
    dataIncr: function(c) { return [0xB0 + _ch(c), 0x60, 0]; },
    dataDecr: function(c) { return [0xB0 + _ch(c), 0x61, 0]; },
    nrpnLSB: function(c, n) { return [0xB0 + _ch(c), 0x62, _7b(n)]; },
    nrpnMSB: function(c, n) { return [0xB0 + _ch(c), 0x63, _7b(n)]; },
    rpnLSB: function(c, n) { return [0xB0 + _ch(c), 0x64, _7b(n)]; },
    rpnMSB: function(c, n) { return [0xB0 + _ch(c), 0x65, _7b(n)]; },
    allSoundOff: function(c) { return [0xB0 + _ch(c), 0x78, 0]; },
    resetAllControllers: function(c) { return [0xB0 + _ch(c), 0x79, 0]; },
    localControl: function(c, b) { if (typeof b == 'undefined') b = true; return [0xB0 + _ch(c), 0x7a, b ? 127 : 0]; },
    allNotesOff: function(c) { return [0xB0 + _ch(c), 0x7b, 0]; },
    omni: function(c, b) { if (typeof b == 'undefined') b = true; return [0xB0 + _ch(c), b ? 0x7d : 0x7c, 0]; },
    mono: function(c, n) { if (typeof n == 'undefined') n = 1; return [0xB0 + _ch(c), 0x7e, _7b(n)]; },
    poly: function(c) { return [0xB0 + _ch(c), 0x7f, 0]; }
  };
  function _splitMasterTuning(a, b, c, d) {
    if (typeof b != 'undefined') return [_7b(a), _7b(b), _7b(c), _7b(d)];
    if (a != parseInt(a) || a < 0 || a > 0xffff) _bad(a);
    a = parseInt(a);
    return [(a >> 12) & 0xf, (a >> 8) & 0xf, (a >> 4) & 0xf, a & 0xf];
  }
  function _gsxg16b(x) { // -1 <= x <= 1
    _float(x);
    x = Math.round(x * 0x10000 + 0x4000);
    return x < 0 ? 0 : x > 0xffff ? 0xffff : x;
  }
  var _helperNC = { // no channel
    mtc: function(t) { return [0xF1, _mtc(t)]; },
    songPosition: function(n, l) { return typeof l == 'undefined' ? [0xF2, _lsb(n), _msb(n)] : [0xF2, _7b(l), _7b(n)]; },
    songSelect: function(n) { return [0xF3, _7b(n)]; },
    tune: function() { return [0xF6]; },
    clock: function() { return [0xF8]; },
    start: function() { return [0xFA]; },
    continue: function() { return [0xFB]; },
    stop: function() { return [0xFC]; },
    active: function() { return [0xFE]; },
    reset: function() { return [0xFF]; }
  };
  var _helperSX = { // SysEx
    sxIdRequest: function() { return [0xF0, 0x7E, this._sxid, 0x06, 0x01, 0xF7]; },
    sxTuningDumpRequest: function(n, k) { return typeof k == 'undefined' ?
      [0xF0, 0x7E, this._sxid, 0x08, 0x00, _7b(n), 0xF7] : [0xF0, 0x7E, this._sxid, 0x08, 0x03, _7b(n), _7b(k), 0xF7]; },
    sxFullFrame: function(t) { return [0xF0, 0x7F, this._sxid, 0x01, 0x01, _hrtype(t), t.getMinute(), t.getSecond(), t.getFrame(), 0xF7]; },
    sxMasterVolume: function(n, l) { return typeof l == 'undefined' ?
      [0xF0, 0x7F, this._sxid, 0x04, 0x01, _lsb(n), _msb(n), 0xF7] : [0xF0, 0x7F, this._sxid, 0x04, 0x01, _7b(l), _7b(n), 0xF7]; },
    sxMasterVolumeF: function(x) { return _helperSX.sxMasterVolume.call(this, MIDI.to14b(_01(x))); },
    sxMasterFineTuning: function(n, l) { return typeof l == 'undefined' ?
      [0xF0, 0x7F, this._sxid, 0x04, 0x03, _lsb(n), _msb(n), 0xF7] : [0xF0, 0x7F, this._sxid, 0x04, 0x03, _7b(l), _7b(n), 0xF7]; },
    sxMasterFineTuningF: function(x) { return _helperSX.sxMasterFineTuning.call(this, MIDI.to14b(_01((x % 1 + 1) / 2, x))); },
    sxMasterCoarseTuning: function(n) { return [0xF0, 0x7F, this._sxid, 0x04, 0x04, 0x00, _7b(n), 0xF7]; },
    sxMasterCoarseTuningF: function(x) { return _helperSX.sxMasterCoarseTuning.call(this, 0x40 + (x - x % 1)); },
    sxNoteTuning: function(a, b, c, d) { return b == parseInt(b) ?
      [0xF0, _rt(d), this._sxid, 0x08, 0x07, _7b(a), _7b(b)].concat(_ntu(c), [0xF7]) :
      [0xF0, 0x7F, this._sxid, 0x08, 0x02, _7b(a)].concat(_ntu(b), [0xF7]); },
    sxNoteTuningF: function(a, b, c, d) { return b == parseInt(b) ?
      _helperSX.sxNoteTuning.call(this, a, b, _f2ntu(c), d) : _helperSX.sxNoteTuning.call(this, a, _f2ntu(b)); },
    sxNoteTuningHZ: function(a, b, c, d) { return b == parseInt(b) ?
      _helperSX.sxNoteTuning.call(this, a, b, _hz2ntu(c), d) : _helperSX.sxNoteTuning.call(this, a, _hz2ntu(b)); },
    sxScaleTuning1: function(a, b, c) { return a == parseInt(a) ?
      [0xF0, _rt(c), this._sxid, 0x08, 0x08].concat(_to777(_16b(a)), _12x7(b), [0xF7]) :
      _helperSX.sxScaleTuning1.call(this, 0xffff, a, b); },
    sxScaleTuning1F: function(a, b, c) { if (a != parseInt(a)) return _helperSX.sxScaleTuning1F.call(this, 0xffff, a, b);
      var v = []; for (var i = 0; i < b.length; i++) {
        if (b[i] < -0.64 || b[i] > 0.63) throw RangeError('Out of range: ' + b[i]);
        v.push(Math.floor(b[i] * 100 + 64)); }
      return _helperSX.sxScaleTuning1.call(this, a, v, c); },
    sxScaleTuning2: function(a, b, c) { return a == parseInt(a) ?
      [0xF0, _rt(c), this._sxid, 0x08, 0x09].concat(_to777(_16b(a)), _12x14(b), [0xF7]) :
      _helperSX.sxScaleTuning2.call(this, 0xffff, a, b); },
    sxScaleTuning2F: function(a, b, c) { if (a != parseInt(a)) return _helperSX.sxScaleTuning2F.call(this, 0xffff, a, b);
      var v = []; for (var i = 0; i < b.length; i++) {
        var x = (b[i] + 1) / 2;
        if (x < -1 || x > 1) throw RangeError('Out of range: ' + b[i]);
        v.push(MIDI.to14b((b[i] + 1) / 2)); }
      return _helperSX.sxScaleTuning2.call(this, a, v, c); },
    sxGM: function(gm) { if (typeof gm == 'undefined') gm = 1; return [0xF0, 0x7E, this._sxid, 0x09, gm ? gm == 2 ? 3 : 1 : 2, 0xf7]; },
    sxGS: function(arg) { var arr = typeof arg == 'undefined' ? [0x40, 0, 0x7F, 0] : arg instanceof Array ? arg : arguments;
      var c = 0; var a = [0xf0, 0x41, this._sxid, 0x42, 0x12];
      for (var i = 0; i < arr.length; i++) { var x = _7b(arr[i]); a.push(x); c += x; }
      c %= 128; a.push(c ? 128 - c : 0); a.push(0xf7); return a; },
    sxXG: function(arg) { var arr = typeof arg == 'undefined' ? [0, 0, 0x7E, 0] : arg instanceof Array ? arg : arguments;
      var sxid = this._sxid == 0x7f ? 0 : this._sxid;
      if (sxid > 15) _throw('Bad Yamaha device number: ' + sxid);
      var a = [0xf0, 0x43, 16 + sxid, 0x4c];
      for (var i = 0; i < arr.length; i++) a.push(_7b(arr[i])); a.push(0xf7); return a; },
    sxMidiSoft: function(n, s) {
      var a = [0xf0, 0x00, 0x20, 0x24, 0x00, _7b(n || 0)];
      s = typeof s == 'undefined' ? '' : '' + s;
      for (var i = 0; i < s.length; i++) a.push(_7b(s.charCodeAt(i)));
      a.push(0xf7); return a; },
    gsMasterVolume: function(n) { return _helperSX.sxGS.call(this, [0x40, 0, 4, _7b(n)]); },
    gsMasterVolumeF: function(x) { return _helperSX.gsMasterVolume.call(this, MIDI.to7b(_01(x))); },
    gsMasterFineTuning: function(a, b, c, d) { a = _splitMasterTuning(a, b, c, d); return _helperSX.sxGS.call(this, [0x40, 0, 0, a[0], a[1], a[2], a[3]]); },
    gsMasterFineTuningF: function(x) { return _helperSX.gsMasterFineTuning.call(this, _gsxg16b(x % 1)); },
    gsMasterCoarseTuning: function(n) { return _helperSX.sxGS.call(this, [0x40, 0, 5, _7b(n)]); },
    gsMasterCoarseTuningF: function(x) { return _helperSX.gsMasterCoarseTuning.call(this, 0x40 + (x - x % 1)); },
    gsOctaveTuning: function(c, n, x) { return _helperSX.sxGS.call(this, [0x40, 0x10 + [1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 11, 12, 13, 14, 15][_ch(c)], 0x40 + MIDI.octaveValue(n), _7b(x)]); },
    gsOctaveTuningF: function(c, n, x) { if (x < -0.64 || x > 0.63) throw RangeError('Out of range: ' + x);
      return _helperSX.gsOctaveTuning.call(this, c, n, Math.floor(x * 100 + 64)); },
    xgMasterVolume: function(n) { return _helperSX.sxXG.call(this, [0, 0, 4, _7b(n)]); },
    xgMasterVolumeF: function(x) { return _helperSX.xgMasterVolume.call(this, MIDI.to7b(_01(x))); },
    xgMasterFineTuning: function(a, b, c, d) { a = _splitMasterTuning(a, b, c, d); return _helperSX.sxXG.call(this, [0, 0, 0, a[0], a[1], a[2], a[3]]); },
    xgMasterFineTuningF: function(x) { return _helperSX.xgMasterFineTuning.call(this, _gsxg16b(x % 1)); },
    xgMasterCoarseTuning: function(n) { return _helperSX.sxXG.call(this, [0, 0, 6, _7b(n)]); },
    xgMasterCoarseTuningF: function(x) { return _helperSX.xgMasterCoarseTuning.call(this, 0x40 + (x - x % 1)); },
    xgOctaveTuning: function(c, n, x) { return _helperSX.sxXG.call(this, [8, _ch(c), 0x41 + MIDI.octaveValue(n), _7b(x)]); },
    xgOctaveTuningF: function(c, n, x) { if (x < -0.64 || x > 0.63) throw RangeError('Out of range: ' + x);
      return _helperSX.xgOctaveTuning.call(this, c, n, Math.floor(x * 100 + 64)); }
  };
  _helperSX.sxScaleTuning = _helperSX.sxScaleTuning2;
  _helperSX.sxScaleTuningF = _helperSX.sxScaleTuning2F;
  _helperSX.sxMasterTranspose = _helperSX.sxMasterCoarseTuning;
  _helperSX.sxMasterTransposeF = _helperSX.sxMasterCoarseTuningF;
  _helperSX.gsMasterTranspose = _helperSX.gsMasterCoarseTuning;
  _helperSX.gsMasterTransposeF = _helperSX.gsMasterCoarseTuningF;
  _helperSX.xgMasterTranspose = _helperSX.xgMasterCoarseTuning;
  _helperSX.xgMasterTransposeF = _helperSX.xgMasterCoarseTuningF;
  var _helperGCH = { // compound messages
    bank: function(c, m, l) { return typeof l == 'undefined' ?
      [_helperCH.bankMSB(c, _msb(m)), _helperCH.bankLSB(c, _lsb(m))] : [_helperCH.bankMSB(c, m), _helperCH.bankLSB(c, l)]; },
    modF: function(c, x) { return _helperGCH.mod(c, MIDI.to14b(x)); },
    mod: function(c, m, l) { return typeof l == 'undefined' ?
      [_helperCH.modMSB(c, _msb(m)), _helperCH.modLSB(c, _lsb(m))] : [_helperCH.modMSB(c, m), _helperCH.modLSB(c, l)]; },
    breathF: function(c, x) { return _helperGCH.breath(c, MIDI.to14b(x)); },
    breath: function(c, m, l) { return typeof l == 'undefined' ?
      [_helperCH.breathMSB(c, _msb(m)), _helperCH.breathLSB(c, _lsb(m))] : [_helperCH.breathMSB(c, m), _helperCH.breathLSB(c, l)]; },
    footF: function(c, x) { return _helperGCH.foot(c, MIDI.to14b(x)); },
    foot: function(c, m, l) { return typeof l == 'undefined' ?
      [_helperCH.footMSB(c, _msb(m)), _helperCH.footLSB(c, _lsb(m))] : [_helperCH.footMSB(c, m), _helperCH.footLSB(c, l)]; },
    portamentoTimeF: function(c, x) { return _helperGCH.portamentoTime(c, MIDI.to14b(x)); },
    portamentoTime: function(c, m, l) { return typeof l == 'undefined' ?
      [_helperCH.portamentoMSB(c, _msb(m)), _helperCH.portamentoLSB(c, _lsb(m))] : [_helperCH.portamentoMSB(c, m), _helperCH.portamentoLSB(c, l)]; },
    dataF: function(c, x) { return _helperGCH.data(c, MIDI.to14b(x)); },
    data: function(c, m, l) { return typeof l == 'undefined' ?
      [_helperCH.dataMSB(c, _msb(m)), _helperCH.dataLSB(c, _lsb(m))] : [_helperCH.dataMSB(c, m), _helperCH.dataLSB(c, l)]; },
    volumeF: function(c, x) { return _helperGCH.volume(c, MIDI.to14b(x)); },
    volume: function(c, m, l) { return typeof l == 'undefined' ?
      [_helperCH.volumeMSB(c, _msb(m)), _helperCH.volumeLSB(c, _lsb(m))] : [_helperCH.volumeMSB(c, m), _helperCH.volumeLSB(c, l)]; },
    balanceF: function(c, x) { return _helperGCH.balance(c, MIDI.to14b((x + 1) / 2)); },
    balance: function(c, m, l) { return typeof l == 'undefined' ?
      [_helperCH.balanceMSB(c, _msb(m)), _helperCH.balanceLSB(c, _lsb(m))] : [_helperCH.balanceMSB(c, m), _helperCH.balanceLSB(c, l)]; },
    panF: function(c, x) { return _helperGCH.pan(c, MIDI.to14b((x + 1) / 2)); },
    pan: function(c, m, l) { return typeof l == 'undefined' ?
      [_helperCH.panMSB(c, _msb(m)), _helperCH.panLSB(c, _lsb(m))] : [_helperCH.panMSB(c, m), _helperCH.panLSB(c, l)]; },
    expressionF: function(c, x) { return _helperGCH.expression(c, MIDI.to14b(x)); },
    expression: function(c, m, l) { return typeof l == 'undefined' ?
      [_helperCH.expressionMSB(c, _msb(m)), _helperCH.expressionLSB(c, _lsb(m))] : [_helperCH.expressionMSB(c, m), _helperCH.expressionLSB(c, l)]; },
    nrpn: function(c, m, l) { return typeof l == 'undefined' ?
      [_helperCH.nrpnMSB(c, _msb(m)), _helperCH.nrpnLSB(c, _lsb(m))] : [_helperCH.nrpnMSB(c, m), _helperCH.nrpnLSB(c, l)]; },
    rpn: function(c, m, l) { return typeof l == 'undefined' ?
      [_helperCH.rpnMSB(c, _msb(m)), _helperCH.rpnLSB(c, _lsb(m))] : [_helperCH.rpnMSB(c, m), _helperCH.rpnLSB(c, l)]; },
    rpnPitchBendRange: function(c, m, l) { return _helperGCH.rpn(c, 0, 0).concat(_helperGCH.data(c, m, l)); },
    rpnPitchBendRangeF: function(c, x) { return _helperGCH.rpnPitchBendRange(c, _7b(x - x % 1), Math.floor((x % 1) * 100)); },
    rpnFineTuning: function(c, m, l) { return _helperGCH.rpn(c, 0, 1).concat(_helperGCH.data(c, m, l)); },
    rpnFineTuningF: function(c, x) { return _helperGCH.rpn(c, 0, 1).concat(_helperGCH.dataF(c, (x % 1 + 1) / 2)); },
    rpnCoarseTuning: function(c, m) { return _helperGCH.rpn(c, 0, 2).concat([_helperCH.dataMSB(c, m)]); },
    rpnCoarseTuningF: function(c, x) { return _helperGCH.rpn(c, 0, 2).concat([_helperCH.dataMSB(c, 0x40 + (x - x % 1))]); },
    rpnTuning: function(c, n, m, l) { return _helperGCH.rpnCoarseTuning(c, n).concat(_helperGCH.rpnFineTuning(c, m, l)); },
    rpnTuningF: function(c, x) { return _helperGCH.rpnCoarseTuningF(c, x).concat(_helperGCH.rpnFineTuningF(c, x)); },
    rpnTuningA: function(c, a) { return _helperGCH.rpnTuningF(c, MIDI.shift(a)); },
    rpnSelectTuningProgram: function(c, n) { return _helperGCH.rpn(c, 0, 3).concat([_helperCH.dataMSB(c, n)]); },
    rpnSelectTuningBank: function(c, n) { return _helperGCH.rpn(c, 0, 4).concat([_helperCH.dataMSB(c, n)]); },
    rpnSelectTuning: function(c, n, k) { return typeof k == 'undefined' ?
      _helperGCH.rpnSelectTuningProgram(c, n) : _helperGCH.rpnSelectTuningBank(c, n).concat(_helperGCH.rpnSelectTuningProgram(c, k)); },
    rpnModulationDepthRange: function(c, m, l) { return _helperGCH.rpn(c, 0, 5).concat(_helperGCH.data(c, m, l)); },
    rpnModulationDepthRangeF: function(c, x) { return _helperGCH.rpnModulationDepthRange(c, _7b(x - x % 1), Math.floor((x % 1) * 128)); },
    rpnNull: function(c) { return _helperGCH.rpn(c, 0x7f, 0x7f); },
    mode1: function(c) { return [ _helperCH.omni(c, true), _helperCH.poly(c) ]; },
    mode2: function(c) { return [ _helperCH.omni(c, true), _helperCH.mono(c) ]; },
    mode3: function(c) { return [ _helperCH.omni(c, false), _helperCH.poly(c) ]; },
    mode4: function(c) { return [ _helperCH.omni(c, false), _helperCH.mono(c) ]; }
  };
  var _helperSXX = { // compound messages no channel
    sxMasterTuning: function(n, m, l) { return [_helperSX.sxMasterCoarseTuning.call(this, n), _helperSX.sxMasterFineTuning.call(this, m, l)]; },
    sxMasterTuningF: function(x) { return [_helperSX.sxMasterCoarseTuningF.call(this, x), _helperSX.sxMasterFineTuningF.call(this, x)]; },
    gsMasterTuningF: function(x) { return [_helperSX.gsMasterCoarseTuningF.call(this, x), _helperSX.gsMasterFineTuningF.call(this, x)]; },
    xgMasterTuningF: function(x) { return [_helperSX.xgMasterCoarseTuningF.call(this, x), _helperSX.xgMasterFineTuningF.call(this, x)]; },
    sxMasterTuningA: function(a) { return _helperSXX.sxMasterTuningF.call(this, MIDI.shift(a)); },
    gsMasterTuningA: function(a) { return _helperSXX.gsMasterTuningF.call(this, MIDI.shift(a)); },
    xgMasterTuningA: function(a) { return _helperSXX.xgMasterTuningF.call(this, MIDI.shift(a)); },
    gsScaleTuning: function(c, a) { var out = []; if (a.length != 12) throw RangeError('Wrong input size: ' + a.length);
      for (var i = 0; i < 12; i++) out.push(_helperSX.gsOctaveTuning.call(this, c, i, a[i])); return out; },
    gsScaleTuningF: function(c, a) { var out = []; if (a.length != 12) throw RangeError('Wrong input size: ' + a.length);
      for (var i = 0; i < 12; i++) out.push(_helperSX.gsOctaveTuningF.call(this, c, i, a[i])); return out; },
    xgScaleTuning: function(c, a) { var out = []; if (a.length != 12) throw RangeError('Wrong input size: ' + a.length);
      for (var i = 0; i < 12; i++) out.push(_helperSX.xgOctaveTuning.call(this, c, i, a[i])); return out; },
    xgScaleTuningF: function(c, a) { var out = []; if (a.length != 12) throw RangeError('Wrong input size: ' + a.length);
      for (var i = 0; i < 12; i++) out.push(_helperSX.xgOctaveTuningF.call(this, c, i, a[i])); return out; }
  };
  function _smf(ff, dd) {
    var midi = new MIDI();
    midi.ff = _8b(ff);
    midi.dd = typeof dd == 'undefined' ? '' : _8bs(dd);
    return midi;
  }
  var _helperSMF = { // Standard MIDI File events
    smf: function(arg) {
      if (arg instanceof MIDI) return new MIDI(arg);
      var arr = arg instanceof Array ? arg : arguments;
      var ff = _8b(arr[0]);
      var dd = '';
      if (arr.length == 2) dd = _2s(arr[1]);
      else if (arr.length > 2) dd = _2s(Array.prototype.slice.call(arr, 1));
      return _smf(ff, dd);
    },
    smfSeqNumber: function(dd) {
      if (dd == parseInt(dd)) {
        if (dd < 0 || dd > 0xffff) throw RangeError('Sequence number out of range: ' + dd);
        dd = String.fromCharCode(dd >> 8) + String.fromCharCode(dd & 0xff);
      }
      else {
        dd = '' + dd;
        if (dd.length == 0) dd = '\x00\x00';
        else if (dd.length == 1) dd = '\x00' + dd;
        else if (dd.length > 2) throw RangeError('Sequence number out of range' + _smftxt(dd));
      }
      return _smf(0, dd);
    },
    smfText: function(dd) { return _smf(1, JZZ.lib.toUTF8(dd)); },
    smfCopyright: function(dd) { return _smf(2, JZZ.lib.toUTF8(dd)); },
    smfSeqName: function(dd) { return _smf(3, JZZ.lib.toUTF8(dd)); },
    smfInstrName: function(dd) { return _smf(4, JZZ.lib.toUTF8(dd)); },
    smfLyric: function(dd) { return _smf(5, JZZ.lib.toUTF8(dd)); },
    smfMarker: function(dd) { return _smf(6, JZZ.lib.toUTF8(dd)); },
    smfCuePoint: function(dd) { return _smf(7, JZZ.lib.toUTF8(dd)); },
    smfProgName: function(dd) { return _smf(8, JZZ.lib.toUTF8(dd)); },
    smfDevName: function(dd) { return _smf(9, JZZ.lib.toUTF8(dd)); },
    smfChannelPrefix: function(dd) {
      if (dd == parseInt(dd)) {
        _validateChannel(dd);
        dd = String.fromCharCode(dd);
      }
      else {
        dd = '' + dd;
        if (dd.length == 0) dd = '\x00';
        else if (dd.length > 1 || dd.charCodeAt(0) > 15) throw RangeError('Channel number out of range' + _smftxt(dd));
      }
      return _smf(32, dd);
    },
    smfMidiPort: function(dd) {
      if (dd == parseInt(dd)) {
        if (dd < 0 || dd > 127) throw RangeError('Port number out of range: ' + dd);
        dd = String.fromCharCode(dd);
      }
      else {
        dd = '' + dd;
        if (dd.length == 0) dd = '\x00';
        else if (dd.length > 1 || dd.charCodeAt(0) > 127) throw RangeError('Port number out of range' + _smftxt(dd));
      }
      return _smf(33, dd);
    },
    smfEndOfTrack: function(dd) {
      if (_2s(dd) != '') throw RangeError('Unexpected data' + _smftxt(_2s(dd)));
      return _smf(47);
    },
    smfTempo: function(dd) { // microseconds per quarter note
      if (('' + dd).length == 3) return _smf(81, dd);
      if (dd == parseInt(dd) && dd > 0 && dd <= 0xffffff) {
        return _smf(81, String.fromCharCode(dd >> 16) + String.fromCharCode((dd >> 8) & 0xff) + String.fromCharCode(dd & 0xff));
      }
      throw RangeError('Out of range' + _smftxt(_2s(dd)));
    },
    smfBPM: function(bpm) { return _helperSMF.smfTempo(Math.round(60000000.0 / bpm)); },
    smfSMPTE: function(dd) {
      if (dd instanceof SMPTE) return _smf(84, String.fromCharCode(dd.hour) + String.fromCharCode(dd.minute) + String.fromCharCode(dd.second) + String.fromCharCode(dd.frame) + String.fromCharCode((dd.quarter % 4) * 25));
      var s = '' + dd;
      if (s.length == 5) {
        return _smf(84, dd);
      }
      var arr = dd instanceof Array ? dd : Array.prototype.slice.call(arguments);
      arr.splice(0, 0, 30);
      return _helperSMF.smfSMPTE(new SMPTE(arr));
    },
    smfTimeSignature: function(a, b, c, d) {
      var nn, dd, cc, bb;
      var m = ('' + a ).match(/^\s*(\d+)\s*\/\s*(\d+)\s*$/);
      if (m) {
        nn = parseInt(m[1]);
        dd = parseInt(m[2]);
        if (nn > 0 && nn < 0x100 && dd > 0 && !(dd & (dd - 1))) {
          cc = dd; dd = 0;
          for (cc >>= 1; cc; cc >>= 1) dd++;
          cc = b == parseInt(b) ? b : 24;
          bb = c == parseInt(c) ? c : 8;
          return _smf(88, String.fromCharCode(nn) + String.fromCharCode(dd) + String.fromCharCode(cc) + String.fromCharCode(bb));
        }
        else if (('' + a ).length == 4) return _smf(88, a);
      }
      else if (a == parseInt(a) && b == parseInt(b)) {
        if (a > 0 && a < 0x100 && b > 0 && !(b & (b - 1))) {
          nn = a;
          dd = 0;
          cc = b;
          for (cc >>= 1; cc; cc >>= 1) dd++;
          cc = c == parseInt(c) ? c : 24;
          bb = d == parseInt(d) ? d : 8;
          return _smf(88, String.fromCharCode(nn) + String.fromCharCode(dd) + String.fromCharCode(cc) + String.fromCharCode(bb));
        }
        else if (('' + a ).length == 4) return _smf(88, a);
        a = a + '/' + b;
      }
      else if (('' + a ).length == 4) return _smf(88, a);
      throw RangeError('Wrong time signature' + _smftxt(_2s('' + a)));
    },
    smfKeySignature: function(dd) {
      dd = '' + dd;
      var m = dd.match(/^\s*([A-H][b#]?)\s*(|maj|major|dur|m|min|minor|moll)\s*$/i);
      if (m) {
        var sf = {
          CB: 0, GB: 1, DB: 2, AB: 3, EB: 4, BB: 5, F: 6, C: 7, G: 8, D: 9, A: 10,
          E:11, B: 12, H: 12, 'F#': 13, 'C#': 14, 'G#': 15, 'D#': 16, 'A#': 17
        }[m[1].toUpperCase()];
        var mi = { '': 0, MAJ: 0, MAJOR: 0, DUR: 0, M: 1, MIN: 1, MINOR: 1, MOLL: 1}[m[2].toUpperCase()];
        if (typeof sf != 'undefined' && typeof mi != 'undefined') {
          if (mi) sf -= 3;
          sf -= 7;
          if (sf >= -7 && sf < 0) dd = String.fromCharCode(256 + sf) + String.fromCharCode(mi);
          else if (sf >= 0 && sf <= 7) dd = String.fromCharCode(sf) + String.fromCharCode(mi);
        }
      }
      if (dd.length == 2 && dd.charCodeAt(1) <= 1 && (dd.charCodeAt(0) <= 7 || dd.charCodeAt(0) <= 255 && dd.charCodeAt(0) >= 249)) return _smf(89, dd);
      throw RangeError('Incorrect key signature' + _smftxt(dd));
    },
    smfSequencer: function(dd) { return _smf(127, _2s(dd)); }
  };

  var _helpers = {};
  function _copyHelperNC(name, func) {
    MIDI[name] = function() { return new MIDI(func.apply(this, arguments)); };
    _helpers[name] = function() { return this.send(func.apply(this, arguments)); };
  }
  function _copyHelperSMF(name, func) {
    MIDI[name] = function() { return func.apply(this, arguments); };
    _helpers[name] = function() { return this.send(func.apply(this, arguments)); };
  }
  function _copyHelperGNC(name, func) {
    MIDI[name] = function() {
      var i;
      var g = [];
      var a = func.apply(this, arguments);
      for (i = 0; i < a.length; i++) g.push(new MIDI(a[i]));
      return g;
    };
    _helpers[name] = function() {
      var a = func.apply(this, arguments);
      var g = this;
      for (var i = 0; i < a.length; i++) g = g.send(a[i]);
      return g;
    };
  }
  function _copyHelperMPE(name, func) {
    MIDI[name] = function() {
      return new MIDI(func.apply(this, typeof this._ch == 'undefined' ? arguments : [this._ch].concat(Array.prototype.slice.call(arguments))));
    };
    _helpers[name] = function() {
      if (typeof this._master != 'undefined') {
        var msg = new MIDI(func.apply(this, [this._master].concat(Array.prototype.slice.call(arguments))));
        msg._mpe = msg[1];
        return this.send(msg);
      }
      return this.send(func.apply(this, typeof this._ch == 'undefined' ? arguments : [this._ch].concat(Array.prototype.slice.call(arguments))));
    };
  }
  function _copyHelperCH(name, func) {
    MIDI[name] = function() {
      return new MIDI(func.apply(this, typeof this._ch == 'undefined' ? arguments : [this._ch].concat(Array.prototype.slice.call(arguments))));
    };
    _helpers[name] = function() {
      if (typeof this._master != 'undefined') {
        var chan;
        var args = Array.prototype.slice.call(arguments);
        if (args.length < func.length) args = [this._master].concat(args);
        else {
          chan = _7bn(args[0]);
          args[0] = this._master;
        }
        var msg = new MIDI(func.apply(this, args));
        msg._mpe = chan;
        return this.send(msg);
      }
      return this.send(func.apply(this, typeof this._ch == 'undefined' ? arguments : [this._ch].concat(Array.prototype.slice.call(arguments))));
    };
  }
  function _copyHelperGCH(name, func) {
    MIDI[name] = function() {
      var i;
      var g = [];
      var a = func.apply(this, typeof this._ch == 'undefined' ? arguments : [this._ch].concat(Array.prototype.slice.call(arguments)));
      for (i = 0; i < a.length; i++) g.push(new MIDI(a[i]));
      return g;
    };
    _helpers[name] = function() {
      var i;
      var a;
      var g;
      if (typeof this._master != 'undefined') {
        var chan;
        var args = Array.prototype.slice.call(arguments);
        if (args.length < func.length) args = [this._master].concat(args);
        else {
          chan = _7bn(args[0]);
          args[0] = this._master;
        }
        a = func.apply(this, args);
        g = this;
        for (i = 0; i < a.length; i++) {
          var msg = MIDI(a[i]);
          msg._mpe = chan;
          g = g.send(msg);
        }
        return g;
      }
      a = func.apply(this, typeof this._ch == 'undefined' ? arguments : [this._ch].concat(Array.prototype.slice.call(arguments)));
      g = this;
      for (i = 0; i < a.length; i++) g = g.send(a[i]);
      return g;
    };
  }

  _for(_helperNC, function(n) { _copyHelperNC(n, _helperNC[n]); });
  _for(_helperSX, function(n) { _copyHelperNC(n, _helperSX[n]); });
  _for(_helperSMF, function(n) { _copyHelperSMF(n, _helperSMF[n]); });
  _for(_helperSXX, function(n) { _copyHelperGNC(n, _helperSXX[n]); });
  _for(_helperMPE, function(n) { _copyHelperMPE(n, _helperMPE[n]); });
  _for(_helperCH, function(n) { _copyHelperCH(n, _helperCH[n]); });
  _for(_helperGCH, function(n) { _copyHelperGCH(n, _helperGCH[n]); });

  function _copyMidiHelpers(M) {
    _for(_helpers, function(n) { M.prototype[n] = _helpers[n]; });
  }
  _copyMidiHelpers(_M);

  var _channelMap = { a:10, b:11, c:12, d:13, e:14, f:15, A:10, B:11, C:12, D:13, E:14, F:15 };
  for (k = 0; k < 16; k++) _channelMap[k] = k;
  MIDI.prototype.getChannel = function() {
    if (this.ff == 0x20 && this.dd.length == 1 && this.dd.charCodeAt(0) < 16) return this.dd.charCodeAt(0);
    var c = this[0];
    if (typeof c == 'undefined' || c < 0x80 || c > 0xef) return;
    return c & 15;
  };
  MIDI.prototype.setChannel = function(x) {
    x = _channelMap[x];
    if (typeof x == 'undefined') return this;
    if (this.ff == 0x20) this.dd = String.fromCharCode(x);
    else {
      var c = this[0];
      if (typeof c != 'undefined' && c >= 0x80 && c <= 0xef) this[0] = (c & 0xf0) | x;
    }
    return this;
  };
  MIDI.prototype.getNote = function() {
    var c = this[0];
    if (typeof c == 'undefined' || c < 0x80 || c > 0xaf) return;
    return this[1];
  };
  MIDI.prototype.setNote = function(x) {
    var c = this[0];
    if (typeof c == 'undefined' || c < 0x80 || c > 0xaf) return this;
    x = MIDI.noteValue(x);
    if (typeof x != 'undefined') this[1] = x;
    return this;
  };
  MIDI.prototype.getVelocity = function() {
    var c = this[0];
    if (typeof c == 'undefined' || c < 0x80 || c > 0x9f) return;
    return this[2];
  };
  MIDI.prototype.setVelocity = function(x) {
    var c = this[0];
    if (typeof c == 'undefined' || c < 0x80 || c > 0x9f) return this;
    x = parseInt(x);
    if (x >= 0 && x < 128) this[2] = x;
    return this;
  };
  MIDI.prototype.getSysExId = function() {
    if (this[0] == 0xf0) return this[2];
  };
  MIDI.prototype.setSysExId = function(x) {
    if (this[0] == 0xf0 && this.length > 2) {
      x = parseInt(x);
      if (x >= 0 && x < 128) this[2] = x;
    }
    return this;
  };
  MIDI.prototype.getData = function() {
    if (typeof this.dd != 'undefined') return this.dd.toString();
  };
  MIDI.prototype.setData = function(dd) {
    this.dd = _2s(dd);
    return this;
  };
  function _is_yamaha_smf(ff, dd) { return ff == 0x7f && typeof dd != 'undefined' && dd.charCodeAt(0) == 0x43 && dd.charCodeAt(1) == 0x7b; }
  function _is_yamaha_chord(ff, dd) { return _is_yamaha_smf(ff, dd) && dd.charCodeAt(2) == 1; }
  function _yamaha_chord(a, b) {
    if (a >= 0 && a <= 0x7f && b >= 0 && b <= 0x7f) {
      var c = a & 0xf;
      var d = a >> 4;
      if (c > 0 && c < 8 && d < 7) c = ['C', 'D', 'E', 'F', 'G', 'A', 'B'][c - 1] + ['bbb', 'bb', 'b', '', '#', '##', '###'][d];
      else return '-';
      if (b > 34) return c + '?';
      else return c + [
        '', '6', 'Maj7', 'Maj7(#11)', '(9)', 'Maj7(9)', '6(9)', 'aug', 'm', 'm6', 'm7', 'm7b5',
        'm(9)', 'm7(9)', 'm7(11)', 'm+7', 'm+7(9)', 'dim', 'dim7', '7', '7sus4', '7b5', '7(9)',
        '7(#11)', '7(13)', '7(b9)', '7(b13)', '7(#9)', 'Maj7aug', '7aug', '1+8', '1+5', 'sus4', '1+2+5', 'cc'][b];
    }
    return '-';
  }
  MIDI.prototype.getText = function() {
    if (typeof this.dd != 'undefined') {
      if (_is_yamaha_chord(this.ff, this.dd)) return _yamaha_chord(this.dd.charCodeAt(3), this.dd.charCodeAt(4));
      else return JZZ.lib.fromUTF8(this.dd);
    }
    if (this.isMidiSoft()) {
      var s = [];
      for (var i = 6; i < this.length - 1; i++) s.push(String.fromCharCode(this[i]));
      return s.join('');
    }
  };
  MIDI.prototype.setText = function(dd) {
    this.dd = JZZ.lib.toUTF8(dd);
    return this;
  };
  MIDI.prototype.getTempo = function() {
    if (this.ff == 0x51 && typeof this.dd != 'undefined') {
      return this.dd.charCodeAt(0) * 65536 + this.dd.charCodeAt(1) * 256 + this.dd.charCodeAt(2);
    }
  };
  MIDI.prototype.getBPM = function() {
    var ms = this.getTempo();
    if (ms) return 60000000 / ms;
  };
  MIDI.prototype.getTimeSignature = function() {
    if (this.ff == 0x58 && typeof this.dd != 'undefined') {
       return [this.dd.charCodeAt(0), 1 << this.dd.charCodeAt(1)];
    }
  };
  MIDI.prototype.getTimeSignature4 = function() {
    if (this.ff == 0x58 && typeof this.dd != 'undefined') {
       var a = [this.dd.charCodeAt(0), 1 << this.dd.charCodeAt(1)];
       if (this.dd.length == 4) a.push(this.dd.charCodeAt(2), this.dd.charCodeAt(3));
       return a;
    }
  };
  MIDI.prototype.getKeySignature = function() {
    if (this.ff == 0x59 && typeof this.dd != 'undefined') {
      var sf = this.dd.charCodeAt(0);
      var mi = this.dd.charCodeAt(1);
      if (sf & 0x80) sf = sf - 0x100;
      if (sf >= -7 && sf <= 7 && mi >= 0 && mi <= 1) {
        return [sf,
          ['Cb', 'Gb', 'Db', 'Ab', 'Eb', 'Bb', 'F', 'C', 'G', 'D', 'A', 'E', 'B', 'F#', 'C#', 'G#', 'D#', 'A#'][mi ? sf + 10 : sf + 7],
          !!mi
        ];
      }
    }
  };

  MIDI.prototype.isNoteOn = function() {
    var c = this[0];
    if (typeof c == 'undefined' || c < 0x90 || c > 0x9f) return false;
    return this[2] > 0 ? true : false;
  };
  MIDI.prototype.isNoteOff = function() {
    var c = this[0];
    if (typeof c == 'undefined' || c < 0x80 || c > 0x9f) return false;
    if (c < 0x90) return true;
    return this[2] == 0 ? true : false;
  };
  MIDI.prototype.isSysEx = function() {
    return this[0] == 0xf0;
  };
  MIDI.prototype.isFullSysEx = function() {
    return this[0] == 0xf0 && this[this.length - 1] == 0xf7;
  };
  MIDI.prototype.isMidiSoft = function() {
    return this.isFullSysEx() && this[1] == 0 && this[2] == 0x20 && this[3] == 0x24 && this[4] == 0;
  };
  MIDI.prototype.isSMF = function() {
    return this.ff >= 0 && this.ff <= 0x7f;
  };
  MIDI.prototype.isEOT = function() {
    return this.ff == 0x2f;
  };
  MIDI.prototype.isText = function() {
    return this.ff == 1;
  };
  MIDI.prototype.isCopyright = function() {
    return this.ff == 2;
  };
  MIDI.prototype.isSeqName = function() {
    return this.ff == 3;
  };
  MIDI.prototype.isInstrName = function() {
    return this.ff == 4;
  };
  MIDI.prototype.isLyric = function() {
    return this.ff == 5;
  };
  MIDI.prototype.isMarker = function() {
    return this.ff == 6;
  };
  MIDI.prototype.isCuePoint = function() {
    return this.ff == 7;
  };
  MIDI.prototype.isProgName = function() {
    return this.ff == 8;
  };
  MIDI.prototype.isDevName = function() {
    return this.ff == 9;
  };
  MIDI.prototype.isTempo = function() {
    return this.ff == 0x51;
  };
  MIDI.prototype.isTimeSignature = function() {
    return this.ff == 0x58;
  };
  MIDI.prototype.isKeySignature = function() {
    return this.ff == 0x59;
  };
  MIDI.prototype.isGmReset = function() {
    return this.match([0xf0, 0x7e, [0, 0], 0x09, [0, 0], 0xf7]);
  };
  MIDI.prototype.isGsReset = function() {
    return this.match([0xf0, 0x41, [0, 0], 0x42, 0x12, 0x40, 0, 0x7f, 0, 0x41, 0xf7]);
  };
  MIDI.prototype.isXgReset = function() {
    return this.match([0xf0, 0x43, [0x10, 0xf0], 0x4c, 0, 0, 0x7e, 0, 0xf7]);
  };
  MIDI.prototype.match = function(a) {
    var i, m;
    for (i = 0; i < a.length; i++) {
      m = a[i][1];
      if (typeof m == 'undefined') {
        if (this[i] != a[i]) return false;
      }
      else {
        if ((this[i] & m) != (a[i][0] & m)) return false;
      }
    }
    return true;
  };

  function _s2a(x) {
    var a = [];
    for (var i = 0; i < x.length; i++) {
      a[i] = x.charCodeAt(i);
    }
    return a;
  }
  function _a2s(x) {
    var a = '';
    for (var i = 0; i < x.length; i++) {
      a += String.fromCharCode(x[i]);
    }
    return a;
  }
  function _2s(x) {
    return x instanceof Array ? _a2s(x) : typeof x == 'undefined' ? '' : '' + x;
  }
  function _s2n(x) {
    var n = 0;
    for (var i = 0; i < x.length; i++) n = (n << 8) + x.charCodeAt(i);
    return n;
  }

  function __hex(x) { return (x < 16 ? '0' : '') + x.toString(16); }
  function _hex(x) {
    var a = [];
    for (var i = 0; i < x.length; i++) a.push(__hex(x[i]));
    return a.join(' ');
  }
  function _hexx(x) {
    var a = [];
    for (var i = 0; i < x.length; i++) {
      if (i && i % 4 == 0) a.push(' ');
      a.push(__hex(x[i]));
    }
    return a.join('');
  }
  function _toLine(s) {
    var out = '';
    for (var i = 0; i < s.length; i++) {
      if (s[i] == '\n') out += '\\n';
      else if (s[i] == '\r') out += '\\r';
      else if (s[i] == '\t') out += '\\t';
      else if (s.charCodeAt(i) < 32) out += '\\x' + __hex(s.charCodeAt(i));
      else out += s[i];
    }
    return out;
  }
  function _smfhex(dd) {
    return dd.length ? ': ' + _hex(_s2a(dd)) : '';
  }
  function _smftxt(dd) {
    return dd.length ? ': ' + _toLine(JZZ.lib.fromUTF8(dd)) : '';
  }
  MIDI.prototype.label = function(s) {
    this.lbl = this.lbl ? this.lbl + ', ' + s : s;
    return this;
  };
  MIDI.prototype.toString = function() {
    return this.lbl ? this._str() + ' (' + this.lbl + ')' : this._str();
  };
  MIDI.prototype._str = function() {
    var s, t;
    if (!this.length) {
      if (typeof this.ff == 'undefined') return 'empty';
      s = 'ff' + __hex(this.ff);
    }
    else s = _hex(this);
    t = this._string();
    return t ? s + ' -- ' + t : s;
  };
  MIDI.prototype._string = function() {
    var s = '';
    var ss;
    if (!this.length) {
      if (this.ff == 0) s += 'Sequence Number: ' + _s2n(this.dd);
      else if (this.ff > 0 && this.ff < 10) s += ['', 'Text', 'Copyright', 'Sequence Name', 'Instrument Name', 'Lyric', 'Marker', 'Cue Point', 'Program Name', 'Device Name'][this.ff] + _smftxt(this.dd);
      else if (this.ff == 32) s += 'Channel Prefix' + _smfhex(this.dd);
      else if (this.ff == 33) s += 'MIDI Port' + _smfhex(this.dd);
      else if (this.ff == 47) s += 'End of Track' + _smfhex(this.dd);
      else if (this.ff == 81) {
        var bpm = Math.round(this.getBPM() * 100) / 100;
        s += 'Tempo: ' + bpm + ' bpm';
      }
      else if (this.ff == 84) s += 'SMPTE Offset: ' + _smptetxt(_s2a(this.dd));
      else if (this.ff == 88) {
        var d = 1 << this.dd.charCodeAt(1);
        s += 'Time Signature: ' + this.dd.charCodeAt(0) + '/' + d;
        s += ' ' + this.dd.charCodeAt(2) + ' ' + this.dd.charCodeAt(3);
      }
      else if (this.ff == 89) {
        s += 'Key Signature: ';
        var ks = this.getKeySignature();
        if (ks) {
          s += ks[1];
          if (ks[2]) s += ' min';
        }
        else s+= 'invalid';
      }
      else if (this.ff == 127) {
        if (this.dd.charCodeAt(0) == 0x43) {
          if (this.dd.charCodeAt(1) == 0x7b) {
            s += '[XF:' + __hex(this.dd.charCodeAt(2)) + ']';
            ss = { 0: 'Version', 1: 'Chord', 2: 'Rehearsal Mark', 3: 'Phrase Mark', 4: 'Max Phrase Mark',
              5: 'Fingering Number', 12: 'Guide Track Flag', 16: 'Guitar Info', 18: 'Chord Voicing',
              127: 'XG Song Data Number' }[this.dd.charCodeAt(2)];
            s += ss ? ' ' + ss : '';
            s += ': ';
            if (this.dd.charCodeAt(2) == 0) {
              return s + this.dd.substr(3, 4) + ' ' + _hex(_s2a(this.dd.substr(7)));
            }
            if (this.dd.charCodeAt(2) == 1) {
              return s + this.getText();
            }
            return s + _hex(_s2a(this.dd.substr(3)));
          }
        }
        s += 'Sequencer Specific' + _smfhex(this.dd);
      }
      else s += 'SMF' + _smfhex(this.dd);
      return s;
    }
    ss = {
      241: 'MIDI Time Code',
      242: 'Song Position',
      243: 'Song Select',
      244: 'Undefined',
      245: 'Undefined',
      246: 'Tune request',
      248: 'Timing clock',
      249: 'Undefined',
      250: 'Start',
      251: 'Continue',
      252: 'Stop',
      253: 'Undefined',
      254: 'Active Sensing',
      255: 'Reset'
    }[this[0]];
    if (ss) return ss;
    if (this.isMidiSoft()) {
      ss = _toLine(this.getText());
      if (ss) ss = ' ' + ss;
      return '[K:' + __hex(this[5]) + ']' + ss;
    }
    var c = this[0] >> 4;
    ss = {8: 'Note Off', 10: 'Aftertouch', 12: 'Program Change', 13: 'Channel Aftertouch', 14: 'Pitch Wheel'}[c];
    if (ss) return ss;
    if (c == 9) return this[2] ? 'Note On' : 'Note Off';
    if (c != 11) return s;
    ss = {
      0: 'Bank Select MSB',
      1: 'Modulation Wheel MSB',
      2: 'Breath Controller MSB',
      4: 'Foot Controller MSB',
      5: 'Portamento Time MSB',
      6: 'Data Entry MSB',
      7: 'Channel Volume MSB',
      8: 'Balance MSB',
      10: 'Pan MSB',
      11: 'Expression Controller MSB',
      12: 'Effect Control 1 MSB',
      13: 'Effect Control 2 MSB',
      16: 'General Purpose Controller 1 MSB',
      17: 'General Purpose Controller 2 MSB',
      18: 'General Purpose Controller 3 MSB',
      19: 'General Purpose Controller 4 MSB',
      31: 'Karaoke',
      32: 'Bank Select LSB',
      33: 'Modulation Wheel LSB',
      34: 'Breath Controller LSB',
      36: 'Foot Controller LSB',
      37: 'Portamento Time LSB',
      38: 'Data Entry LSB',
      39: 'Channel Volume LSB',
      40: 'Balance LSB',
      42: 'Pan LSB',
      43: 'Expression Controller LSB',
      44: 'Effect control 1 LSB',
      45: 'Effect control 2 LSB',
      48: 'General Purpose Controller 1 LSB',
      49: 'General Purpose Controller 2 LSB',
      50: 'General Purpose Controller 3 LSB',
      51: 'General Purpose Controller 4 LSB',
      64: 'Damper Pedal',
      65: 'Portamento',
      66: 'Sostenuto',
      67: 'Soft Pedal',
      68: 'Legato',
      69: 'Hold 2',
      70: 'Sound Variation',
      71: 'Filter Resonance',
      72: 'Release Time',
      73: 'Attack Time',
      74: 'Brightness',
      75: 'Decay Time',
      76: 'Vibrato Rate',
      77: 'Vibrato Depth',
      78: 'Vibrato Delay',
      79: 'Sound Controller 10',
      80: 'General Purpose Controller 5',
      81: 'General Purpose Controller 6',
      82: 'General Purpose Controller 7',
      83: 'General Purpose Controller 8',
      84: 'Portamento Control',
      88: 'High Resolution Velocity Prefix',
      91: 'Effects 1 Depth',
      92: 'Effects 2 Depth',
      93: 'Effects 3 Depth',
      94: 'Effects 4 Depth',
      95: 'Effects 5 Depth',
      96: 'Data Increment',
      97: 'Data Decrement',
      98: 'Non-Registered Parameter Number LSB',
      99: 'Non-Registered Parameter Number MSB',
      100: 'Registered Parameter Number LSB',
      101: 'Registered Parameter Number MSB',
      120: 'All Sound Off',
      121: 'Reset All Controllers',
      122: 'Local Control On/Off',
      123: 'All Notes Off',
      124: 'Omni Mode Off',
      125: 'Omni Mode On',
      126: 'Mono Mode On',
      127: 'Poly Mode On'
    }[this[1]];
    if (this[1] >= 64 && this[1] <= 69) ss += this[2] < 64 ? ' Off' : ' On';
    if (!ss) ss = 'Undefined';
    return ss;
  };
  MIDI.prototype._stamp = function(obj) { this._from.push(obj._orig ? obj._orig : obj); return this; };
  MIDI.prototype._unstamp = function(obj) {
    if (typeof obj == 'undefined') this._from = [];
    else {
      if (obj._orig) obj = obj._orig;
      var i = this._from.indexOf(obj);
      if (i > -1) this._from.splice(i, 1);
    }
    return this;
  };
  MIDI.prototype._stamped = function(obj) {
    if (obj._orig) obj = obj._orig;
    for (var i = 0; i < this._from.length; i++) if (this._from[i] == obj) return true;
    return false;
  };

  JZZ.MIDI = MIDI;
  _J.prototype.MIDI = MIDI;

  function _clear_ctxt() {
    var i;
    this._cc = [];
    for (i = 0; i < 16; i++) this._cc[i] = {};
  }
  function _rpn_txt(msb, lsb) {
    var a = typeof msb == 'undefined' ? '??' : __hex(msb);
    var b = typeof lsb == 'undefined' ? '??' : __hex(lsb);
    var c = {
      '0000': 'Pitch Bend Sensitivity',
      '0001': 'Channel Fine Tune',
      '0002': 'Channel Coarse Tune',
      '0003': 'Select Tuning Program',
      '0004': 'Select Tuning Bank',
      '0005': 'Vibrato Depth Range',
      '7f7f': 'NONE'
    }[a + '' + b];
    return 'RPN ' + a + ' ' + b + (c ? ': ' + c : '');
  }
  function _nrpn_txt(msb, lsb) {
    var a = typeof msb == 'undefined' ? '??' : __hex(msb);
    var b = typeof lsb == 'undefined' ? '??' : __hex(lsb);
    return 'NRPN ' + a + ' ' + b;
  }
  function _read_ctxt(msg) {
    if (!msg.length || msg[0] < 0x80) return msg;
    if (msg[0] == 0xff) { this._clear(); return msg; }
    var ch = msg[0] & 15;
    var st = msg[0] >> 4;
    var s;
    if (st == 12) {
      msg._bm = this._cc[ch].bm;
      msg._bl = this._cc[ch].bl;
      if (JZZ.MIDI.programName) msg.label(JZZ.MIDI.programName(msg[1], msg._bm, msg._bl));
    }
    else if (st == 11) {
      switch (msg[1]) {
        case 0: this._cc[ch].bm = msg[2]; break;
        case 32: this._cc[ch].bl = msg[2]; break;
        case 98: this._cc[ch].nl = msg[2]; this._cc[ch].rn = 'n'; break;
        case 99: this._cc[ch].nm = msg[2]; this._cc[ch].rn = 'n'; break;
        case 100: this._cc[ch].rl = msg[2]; this._cc[ch].rn = 'r'; break;
        case 101: this._cc[ch].rm = msg[2]; this._cc[ch].rn = 'r'; break;
        case 6: case 38: case 96: case 97:
          if (this._cc[ch].rn == 'r') {
            msg._rm = this._cc[ch].rm;
            msg._rl = this._cc[ch].rl;
            msg.label(_rpn_txt(this._cc[ch].rm, this._cc[ch].rl));
          }
          if (this._cc[ch].rn == 'n') {
            msg._nm = this._cc[ch].rm;
            msg._nl = this._cc[ch].nl;
            msg.label(_nrpn_txt(this._cc[ch].nm, this._cc[ch].nl));
          }
          break;
      }
    }
    else if (msg.isFullSysEx()) {
      if (msg[1] == 0x7f) {
        if (msg[3] == 4) {
          s = { 1: 'Master Volume', 2: 'Master Balance', 3: 'Master Fine Tuning', 4: 'Master Coarse Tuning' }[msg[4]];
          if (s) msg.label(s);
        }
        else if (msg[3] == 8) {
          s = { 2: 'Note Tuning', 7: 'Note Tuning, Bank', 8: 'Scale Tuning, 1 byte format', 9: 'Scale Tuning, 2 byte format' }[msg[4]];
          if (s) msg.label(s);
        }
      }
      else if (msg[1] == 0x7e) {
        if (msg[3] == 6) {
          if (msg[4] == 1) msg.label('Device ID Request');
          else if (msg[4] == 2) {
            msg.label('Device ID Response');
          }
        }
        else if (msg[3] == 8) {
          s = {
            0: 'Bulk Tuning Dump Request', 1: 'Bulk Tuning Dump', 3: 'Bulk Tuning Dump Request, Bank', 4: 'Bulk Tuning Dump, Bank',
            5: 'Scale Tuning Dump, 1 byte format', 6: 'Scale Tuning Dump, 2 byte format',
            7: 'Note Tuning, Bank', 8: 'Scale Tuning, 1 byte format', 9: 'Scale Tuning, 2 byte format'
          }[msg[4]];
          if (s) msg.label(s);
        }
        else if (msg[3] == 9) {
          if (msg[4] == 1) { msg.label('GM1 System On'); this._clear(); this._gm = '1'; }
          else if (msg[4] == 2) { msg.label('GM System Off'); this._clear(); this._gm = '0'; }
          else if (msg[4] == 3) { msg.label('GM2 System On'); this._clear(); this._gm = '2'; }
        }
      }
      else if (msg[1] == 0x43) {
        if ((msg[2] & 0xf0) == 0x10 && msg[3] == 0x4c) {
          if (msg[4] == 0 && msg[5] == 0 && msg[6] == 0x7e && msg[7] == 0) {
            msg.label('XG System On'); this._clear(); this._gm = 'Y';
          }
          else if (msg[4] == 0 && msg[5] == 0 && msg[6] == 0) msg.label('XG Master Tuning');
          else if (msg[4] == 0 && msg[5] == 0 && msg[6] == 4) msg.label('XG Master Volume');
          else if (msg[4] == 0 && msg[5] == 0 && msg[6] == 6) msg.label('XG Master Transpose');
          else if (msg[4] == 8 && msg[5] < 16 && msg[6] >= 0x41 && msg[6] <= 0x4c) msg.label('XG Scale Tuning');
          else  msg.label('XG Parameter');
        }
      }
      else if (msg[1] == 0x41) {
        if (msg[3] == 0x42 && msg[4] == 0x12) {
          if (msg[5] == 0x40) {
            if (msg[6] == 0) {
              if (msg[7] == 0x7f && msg[8] == 0 && msg[9] == 0x41) {
                msg.label('GS Reset'); this._clear(); this._gm = 'R';
              }
              else if (msg[7] == 0) msg.label('GS Master Tuning');
              else if (msg[7] == 4) msg.label('GS Master Volume');
              else if (msg[7] == 5) msg.label('GS Master Transpose');
              else msg.label('GS Parameter');
            }
            else if ((msg[6] & 0xf0) == 0x10 && msg[7] == 0x15) msg.label('GS Drum Part Change');
            else if ((msg[6] & 0xf0) == 0x10 && msg[7] >= 0x40 && msg[7] <= 0x4b) msg.label('GS Scale Tuning');
            else msg.label('GS Parameter');
          }
          if (msg[5] == 0x41) msg.label('GS Parameter');
        }
      }
    }
    return msg;
  }
  function Context() {
    var self = new _M();
    self._clear = _clear_ctxt;
    self._read = _read_ctxt;
    self._receive = function(msg) { this._emit(this._read(msg)); };
    self._clear();
    self._resume();
    return self;
  }
  JZZ.Context = Context;
  _J.prototype.Context = Context;

  function MPE() {
    var self = this instanceof MPE ? this : self = new MPE();
    self.reset();
    if (arguments.length) MPE.prototype.setup.apply(self, arguments);
    return self;
  }
  MPE.validate = function(arg) {
    var a = arg instanceof Array ? arg : arguments;
    if (a[0] != parseInt(a[0]) || a[0] < 0 || a[0] > 14) throw RangeError('Bad master channel value: ' + a[0]);
    if (a[1] != parseInt(a[1]) || a[1] < 0 || a[0] + a[1] > 15) throw RangeError('Bad zone size value: ' + a[1]);
  };
  MPE.prototype.reset = function() { for (var n = 0; n < 16; n++) this[n] = { band: 0, master: n }; };
  MPE.prototype.setup = function(m, n) {
    MPE.validate(m, n);
    var k;
    var last = m + n;
    if (this[m].master == m && this[m].band == n) return;
    if (!n && !this[m].band) return;
    if (this[m].band) {
      k = m + this[m].band;
      if (last < k) last = k;
    }
    else if (this[m].master == m - 1) {
      k = m - 1;
      k = k + this[k].band;
      if (last < k) last = k;
      this[m - 1] = { band: 0, master: m - 1 };
    }
    else if (this[m].master != m) {
      k = this[m].master;
      k = k + this[k].band;
      if (last < k) last = k;
      this[this[m].master].band = m - this[m].master - 1;
    }
    this[m].master = m;
    this[m].band = n;
    for (k = m + 1; k <= m + n; k++) {
      if (this[k].band && last < k + this[k].band) last = k + this[k].band;
      this[k] = { band: 0, master: m };
    }
    for (; k <= last; k++) this[k] = { band: 0, master: k };
  };
  MPE.prototype.filter = function(msg) {
    var c = msg.getChannel();
    if (!this[c] || !this[this[c].master].band) return msg;
    var m = this[c].master;
    var n = this[m].band;
    var i, j, k;
    if (typeof msg._mpe != 'undefined') {
      k = 256;
      for (i = m + 1; i <= m + n; i++) {
        if (!this[i].notes) {
          if (k > 0) { c = i; k = 0; }
        }
        else {
          if (k > this[i].notes.length) { c = i; k = this[i].notes.length; }
          for (j = 0; j < this[i].notes.length; j++) {
            if (this[i].notes[j] == msg._mpe) { c = i; k = -1; break; }
          }
        }
      }
      msg.setChannel(c);
      msg._mpe = undefined;
    }
    if (c == m) return msg; // bad mpe
    if (msg.isNoteOn()) {
      if (!this[c].notes) this[c].notes = [];
      _push(this[c].notes, msg.getNote());
    }
    else if (msg.isNoteOff()) {
      if (this[c].notes) _pop(this[c].notes, msg.getNote());
    }
    return msg;
  };
  JZZ.MPE = MPE;

  // JZZ.UMP

  function UMP(arg) {
    var self = this instanceof UMP ? this : self = new UMP();
    var i;
    if (arg instanceof UMP) {
      self._from = arg._from.slice();
      _for(arg, function(i) { if (i != '_from') self[i] = arg[i]; });
      return self;
    }
    else self._from = [];
    if (typeof arg == 'undefined') arg = [0, 0, 0, 0];
    var arr = arg instanceof Array ? arg : arguments;
    self.length = 0;
    for (i = 0; i < arr.length; i++) {
      n = arr[i];
      if (n != parseInt(n) || n < 0 || n > 255) _throw(arr[i]);
      self.push(n);
    }
    if (self.length != [4, 4, 4, 8, 8, 16, 4, 4, 8, 8, 8, 12, 12, 16, 16, 16][self[0] >> 4]) throw RangeError('Wrong UMP size');
    return self;
  }
  UMP.prototype = [];
  UMP.prototype.constructor = UMP;
  UMP.prototype.isMidi = function() { return 2; };
  UMP.prototype.isMidi2 = true;
  UMP.prototype.dump = function() {
    var i;
    var s = '';
    for (i = 0; i < this.length; i++) s += String.fromCharCode(this[i]);
    return s;
  };

  function _UMP() {}
  _UMP.prototype = UMP;
  UMP._sxid = 0x7f;
  UMP.sxId = function(id) {
    if (typeof id == 'undefined') id = UMP._sxid;
    if (id == this._sxid) return this;
    id = _7b(id);
    var ret = new _UMP();
    ret._ch = this._ch;
    ret._gr = this._gr;
    ret._sxid = id;
    return ret;
  };
  UMP.ch = function(c) {
    if (c == this._ch || typeof c == 'undefined' && typeof this._ch == 'undefined') return this;
    var ret = new _UMP();
    if (typeof c != 'undefined') c = _ch(c);
    ret._ch = c;
    ret._gr = this._gr;
    ret._sxid = this._sxid;
    return ret;
  };
  UMP.gr = function(g) {
    if (g == this._gr || typeof g == 'undefined' && typeof this._gr == 'undefined') return this;
    var ret = new _UMP();
    if (typeof g != 'undefined') g = _4b(g);
    ret._ch = this._ch;
    ret._gr = g;
    ret._sxid = this._sxid;
    return ret;
  };
  UMP.prototype.getGroup = function() {
    if (!this[0]) return;
    var m = this[0] >> 4;
    if (m == 1 || m == 2 || m == 3 || m == 4 || m == 5 || m == 13) return this[0] & 15;
  };
  var _zeros = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  function _32a(a, b, c, d) {
    if (typeof b != 'undefined') return [_8b(a), _8b(b), _8b(c), _8b(d)];
    a = _32b(a);
    return [(a >> 24) & 255, (a >> 16) & 255, (a >> 8) & 255, a & 255];
  }
  var _helperNN = {
    noop: function() { return [0, 0, 0, 0]; },
    umpClock: function(n) { n = _16b(n); return [0, 0x10, n >> 8, n & 0xff]; },
    umpTimestamp: function(n) { n = _16b(n); return [0, 0x20, n >> 8, n & 0xff]; },
    umpTicksPQN: function(n) { n = _16b(n); return [0, 0x30, n >> 8, n & 0xff]; },
    umpDelta: function(n) { n = n || 0; n = _20b(n); return [0, 0x40 + (n >> 16), (n >> 8) & 0xff, n & 0xff]; },
    umpStartClip: function() { return [0xf0, 0x20, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]; },
    umpEndClip: function() { return [0xf0, 0x21, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]; }
  };
  var _helperGN = {
    umpTempo: function(g, n) { return [0xd0 + _4b(g), 0x10, 0, 0].concat(_32a(n), [0, 0, 0, 0, 0, 0, 0, 0]); },
    umpBPM: function(g, n) { return _helperGN.umpTempo(g, Math.round(6000000000 / n)); },
    umpTimeSignature: function(g, a, b) {
      var nn, cc, dd;
      var m = ('' + a ).match(/^\s*(\d+)\s*\/\s*(\d+)\s*$/);
      if (m) {
        nn = parseInt(m[1]);
        cc = parseInt(m[2]);
      }
      else if (a == parseInt(a) && b == parseInt(b)) {
        nn = parseInt(a);
        cc = parseInt(b);
      }
      if (nn > 0 && nn < 0x100 && cc > 0 && !(cc & (cc - 1))) {
        dd = 0;
        for (cc >>= 1; cc; cc >>= 1) dd++;
        cc = Math.round(nn * 32 / (1 << dd));
        if (cc < 0x100) return [0xd0 + _4b(g), 0x10, 0, 1, nn, dd, cc, 0, 0, 0, 0, 0, 0, 0, 0, 0];
      }
      throw RangeError('Wrong time signature ' + a + (typeof b == 'undefined' ? '' : '/' + b));
    }
  };
  var _helperGNX = {
    umpMetadata: function(g, t) { return _helperGCX.umpCustomText(g, 0, 1, 1, 0, t); },
    umpProjectName: function(g, t) { return _helperGCX.umpCustomText(g, 0, 1, 1, 1, t); },
    umpCompositionName: function(g, t) { return _helperGCX.umpCustomText(g, 0, 1, 1, 2, t); },
    umpClipName: function(g, t) { return _helperGCX.umpCustomText(g, 0, 1, 1, 3, t); },
    umpCopyright: function(g, t) { return _helperGCX.umpCustomText(g, 0, 1, 1, 4, t); },
    umpComposerName: function(g, t) { return _helperGCX.umpCustomText(g, 0, 1, 1, 5, t); },
    umpLyricistName: function(g, t) { return _helperGCX.umpCustomText(g, 0, 1, 1, 6, t); },
    umpArrangerName: function(g, t) { return _helperGCX.umpCustomText(g, 0, 1, 1, 7, t); },
    umpPublisherName: function(g, t) { return _helperGCX.umpCustomText(g, 0, 1, 1, 8, t); },
    umpPerformerName: function(g, t) { return _helperGCX.umpCustomText(g, 0, 1, 1, 9, t); },
    umpAccPerformerName: function(g, t) { return _helperGCX.umpCustomText(g, 0, 1, 1, 10, t); },
    umpRecordingDate: function(g, t) { return _helperGCX.umpCustomText(g, 0, 1, 1, 11, t); },
    umpRecordingLocation: function(g, t) { return _helperGCX.umpCustomText(g, 0, 1, 1, 12, t); },
    umpText: function(g, t) { return _helperGCX.umpCustomText(g, 0, 1, 2, 0, t); },
    umpLyrics: function(g, t) { return _helperGCX.umpCustomText(g, 0, 1, 2, 1, t); },
    umpLyricsLanguage: function(g, t) { return _helperGCX.umpCustomText(g, 0, 1, 2, 2, t); },
    umpRuby: function(g, t) { return _helperGCX.umpCustomText(g, 0, 1, 2, 3, t); },
    umpRubyLanguage: function(g, t) { return _helperGCX.umpCustomText(g, 0, 1, 2, 4, t); }
  };
  var _noctrl = [0, 6, 32, 38, 98, 99, 100, 101];
  var _helperGC = {
    umpNoteOn: function(g, c, n, v, t, a) {
      if (typeof v == 'undefined')  v = 0xffff;
      t = t || 0; a = a || 0;
      v = _16b(v); a = _16b(a);
      return [0x40 + _4b(g), 0x90 + _ch(c), _7bn(n), _8b(t), v >> 8, v & 255, a >> 8, a & 255];
    },
    umpNoteOff: function(g, c, n, v, t, a) {
      v = v || 0; t = t || 0; a = a || 0;
      v = _16b(v); a = _16b(a);
      return [0x40 + _4b(g), 0x80 + _ch(c), _7bn(n), _8b(t), v >> 8, v & 255, a >> 8, a & 255];
    },
    umpAftertouch: function(g, c, n, x, y, z, w) {
      return [0x40 + _4b(g), 0xa0 + _ch(c), _7bn(n), 0].concat(_32a(x, y, z, w));
    },
    umpControl: function(g, c, n, x, y, z, w) {
      if (_noctrl.includes(n)) _throw(n);
      return [0x40 + _4b(g), 0xb0 + _ch(c), _7b(n), 0].concat(_32a(x, y, z, w));
    },
    umpPressure: function(g, c, x, y, z, w) {
      return [0x40 + _4b(g), 0xd0 + _ch(c), 0, 0].concat(_32a(x, y, z, w));
    },
    umpProgram: function(g, c, n, msb, lsb) {
      return typeof msb == 'undefined' && typeof lsb == 'undefined' ?
        [0x40 + _4b(g), 0xc0 + _ch(c), 0, 0, _7bn(n), 0, 0, 0] :
        [0x40 + _4b(g), 0xc0 + _ch(c), 0, 1, _7bn(n), 0, _7bn(msb), _7bn(lsb)];
    },
    umpRPN: function(g, c, b, n, x, y, z, w) {
      return [0x40 + _4b(g), 0x20 + _ch(c), _7b(b), _7b(n)].concat(_32a(x, y, z, w));
    },
    umpNRPN: function(g, c, b, n, x, y, z, w) {
      return [0x40 + _4b(g), 0x30 + _ch(c), _7b(b), _7b(n)].concat(_32a(x, y, z, w));
    }
  };
  var _helperGCX = {
    umpCustomText: function(g, c, d, b, s, t) {
      var i;
      var a = [];
      t = JZZ.lib.toUTF8('' + t);
      for (i = 0; i < t.length; i++) a.push(t.charCodeAt(i));
      a = _slice(a, 12);
      for (i = 0; i < a.length; i++) a[i] = [0xd0 + _4b(g), _umpseqstat(a.length, i) * 64 + (d ? 16 : 0) + _ch(c), b, s].concat(a[i], _zeros).slice(0, 16);
      return a;
    },
    umpCMetadata: function(g, c, t) { return _helperGCX.umpCustomText(g, c, 0, 1, 0, t); },
    umpCProjectName: function(g, c, t) { return _helperGCX.umpCustomText(g, c, 0, 1, 1, t); },
    umpCCompositionName: function(g, c, t) { return _helperGCX.umpCustomText(g, c, 0, 1, 2, t); },
    umpCClipName: function(g, c, t) { return _helperGCX.umpCustomText(g, c, 0, 1, 3, t); },
    umpCCopyright: function(g, c, t) { return _helperGCX.umpCustomText(g, c, 0, 1, 4, t); },
    umpCComposerName: function(g, c, t) { return _helperGCX.umpCustomText(g, c, 0, 1, 5, t); },
    umpCLyricistName: function(g, c, t) { return _helperGCX.umpCustomText(g, c, 0, 1, 6, t); },
    umpCArrangerName: function(g, c, t) { return _helperGCX.umpCustomText(g, c, 0, 1, 7, t); },
    umpCPublisherName: function(g, c, t) { return _helperGCX.umpCustomText(g, c, 0, 1, 8, t); },
    umpCPerformerName: function(g, c, t) { return _helperGCX.umpCustomText(g, c, 0, 1, 9, t); },
    umpCAccPerformerName: function(g, c, t) { return _helperGCX.umpCustomText(g, c, 0, 1, 10, t); },
    umpCRecordingDate: function(g, c, t) { return _helperGCX.umpCustomText(g, c, 0, 1, 11, t); },
    umpCRecordingLocation: function(g, c, t) { return _helperGCX.umpCustomText(g, c, 0, 1, 12, t); },
    umpCText: function(g, c, t) { return _helperGCX.umpCustomText(g, c, 0, 2, 0, t); },
    umpCLyrics: function(g, c, t) { return _helperGCX.umpCustomText(g, c, 0, 2, 1, t); },
    umpCLyricsLanguage: function(g, c, t) { return _helperGCX.umpCustomText(g, c, 0, 2, 2, t); },
    umpCRuby: function(g, c, t) { return _helperGCX.umpCustomText(g, c, 0, 2, 3, t); },
    umpCRubyLanguage: function(g, c, t) { return _helperGCX.umpCustomText(g, c, 0, 2, 4, t); }
  };

  var _helpersUmp = {};
  function _copyHelperNN(name, func) {
    UMP[name] = function() { return new UMP(func.apply(this, arguments));};
    _helpersUmp[name] = function() { return this.send(func.apply(this, arguments)); };
  }
  function _copyHelperGN(name, func) {
    UMP[name] = function() {
      var args = Array.prototype.slice.call(arguments);
      if (typeof this._gr != 'undefined') args = [this._gr].concat(args);
      return new UMP(func.apply(this, args));
    };
    _helpersUmp[name] = function() {
      var args = Array.prototype.slice.call(arguments);
      if (typeof this._gr != 'undefined') args = [this._gr].concat(args);
      return this.send(func.apply(this, args));
    };
  }
  function _copyHelperGNX(name, func) {
    UMP[name] = function() {
      var args = Array.prototype.slice.call(arguments);
      if (typeof this._gr != 'undefined') args = [this._gr].concat(args);
      var a = func.apply(this, args);
      for (var i = 0; i < a.length; i++) a[i] = new UMP(a[i]);
      return a;
    };
    _helpersUmp[name] = function() {
      var args = Array.prototype.slice.call(arguments);
      if (typeof this._gr != 'undefined') args = [this._gr].concat(args);
      var a = func.apply(this, args);
      for (var i = 0; i < a.length; i++) this.send(a[i]);
      return this;
    };
  }
  function _copyHelperGC(name, func) {
    UMP[name] = function() {
      var args = Array.prototype.slice.call(arguments);
      if (typeof this._gr != 'undefined') args = [this._gr].concat(args);
      if (typeof this._ch != 'undefined') args = [args[0]].concat([this._ch]).concat(args.slice(1));
      return new UMP(func.apply(this, args));
    };
    _helpersUmp[name] = function() {
      var args = Array.prototype.slice.call(arguments);
      if (typeof this._gr != 'undefined') args = [this._gr].concat(args);
      if (typeof this._ch != 'undefined') args = [args[0]].concat([this._ch]).concat(args.slice(1));
      return this.send(func.apply(this, args));
    };
  }
  function _copyHelperGCX(name, func) {
    UMP[name] = function() {
      var args = Array.prototype.slice.call(arguments);
      if (typeof this._gr != 'undefined') args = [this._gr].concat(args);
      if (typeof this._ch != 'undefined') args = [args[0]].concat([this._ch]).concat(args.slice(1));
      var a = func.apply(this, args);
      for (var i = 0; i < a.length; i++) a[i] = new UMP(a[i]);
      return a;
    };
    _helpersUmp[name] = function() {
      var args = Array.prototype.slice.call(arguments);
      if (typeof this._gr != 'undefined') args = [this._gr].concat(args);
      if (typeof this._ch != 'undefined') args = [args[0]].concat([this._ch]).concat(args.slice(1));
      var a = func.apply(this, args);
      for (var i = 0; i < a.length; i++) this.send(a[i]);
      return this;
    };
  }
  function _umpseqstat(n, i) { return n == 1 ? 0 : i == 0 ? 0x1 : i == n - 1 ? 0x3 : 0x2; }
  function _slice(m, n) {
    var a = [];
    for (var x = m; x.length; x = x.slice(n)) a.push(x.slice(0, n));
    return a.length ? a : [[]];
  }
  function _sliceSX(gr, m) {
    var a = _slice(m.slice(1, m.length - 1), 6);
    for (var i = 0; i < a.length; i++) a[i] = new UMP([0x30 + gr, _umpseqstat(a.length, i) * 16 + a[i].length].concat(a[i], _zeros).slice(0, 8));
    return a;
  }
  function _copyHelperSX(name, func) {
    UMP[name] = function() {
      var args = Array.prototype.slice.call(arguments);
      if (typeof this._gr != 'undefined') args = [this._gr].concat(args);
      return _sliceSX(_4b(args[0]), func.apply(this, args.slice(1)));
    };
    _helpersUmp[name] = function() {
      var args = Array.prototype.slice.call(arguments);
      if (typeof this._gr != 'undefined') args = [this._gr].concat(args);
      var a = _sliceSX(_4b(args[0]), func.apply(this, args.slice(1)));
      var g = this;
      for (var i = 0; i < a.length; i++) g = g.send(a[i]);
      return g;
    };
  }
  function _copyHelperSXX(name, func) {
    UMP[name] = function() {
      var args = Array.prototype.slice.call(arguments);
      if (typeof this._gr != 'undefined') args = [this._gr].concat(args);
      var m = func.apply(this, args.slice(1));
      var a = [];
      for (var i = 0; i < m.length; i++) a = a.concat(_sliceSX(_4b(args[0]), m[i]));
      return a;
    };
    _helpersUmp[name] = function() {
      var args = Array.prototype.slice.call(arguments);
      if (typeof this._gr != 'undefined') args = [this._gr].concat(args);
      var m = func.apply(this, args.slice(1));
      var g = this;
      for (var i = 0; i < m.length; i++) {
        var a = _sliceSX(_4b(args[0]), m[i]);
        for (var j = 0; j < a.length; j++) g = g.send(a[j]);
      }
      return g;
    };
  }
  function _copyHelperM1N(name, func) {
    UMP[name] = function() {
      var args = Array.prototype.slice.call(arguments);
      if (typeof this._gr != 'undefined') args = [this._gr].concat(args);
      return new UMP([0x10 + _4b(args[0])].concat(func.apply(this, args.slice(1)), _zeros).slice(0, 4));
    };
    _helpersUmp[name] = function() {
      var args = Array.prototype.slice.call(arguments);
      if (typeof this._gr != 'undefined') args = [this._gr].concat(args);
      return this.send([0x10 + _4b(args[0])].concat(func.apply(this, args.slice(1)), _zeros).slice(0, 4));
    };
  }
  function _copyHelperM1C(name, func) {
    UMP[name] = function() {
      var args = Array.prototype.slice.call(arguments);
      if (typeof this._gr != 'undefined') args = [this._gr].concat(args);
      if (typeof this._ch != 'undefined') args = [args[0]].concat([this._ch]).concat(args.slice(1));
      return new UMP([0x20 + _4b(args[0])].concat(func.apply(this, args.slice(1)), _zeros).slice(0, 4));
    };
    _helpersUmp[name] = function() {
      var args = Array.prototype.slice.call(arguments);
      if (typeof this._gr != 'undefined') args = [this._gr].concat(args);
      if (typeof this._ch != 'undefined') args = [args[0]].concat([this._ch]).concat(args.slice(1));
      return this.send([0x20 + _4b(args[0])].concat(func.apply(this, args.slice(1)), _zeros).slice(0, 4));
    };
  }
  function _copyHelperM1CX(name, func) {
    UMP[name] = function() {
      var args = Array.prototype.slice.call(arguments);
      if (typeof this._gr != 'undefined') args = [this._gr].concat(args);
      if (typeof this._ch != 'undefined') args = [args[0]].concat([this._ch]).concat(args.slice(1));
      var a = func.apply(this, args.slice(1));
      for (var i = 0; i < a.length; i++) a[i] = new UMP([0x20 + _4b(args[0])].concat(a[i], _zeros).slice(0, 4));
      return a;
    };
    _helpersUmp[name] = function() {
      var args = Array.prototype.slice.call(arguments);
      if (typeof this._gr != 'undefined') args = [this._gr].concat(args);
      if (typeof this._ch != 'undefined') args = [args[0]].concat([this._ch]).concat(args.slice(1));
      var a = func.apply(this, args.slice(1));
      var g = this;
      for (var i = 0; i < a.length; i++) g = g.send([0x20 + _4b(args[0])].concat(a[i], _zeros).slice(0, 4));
      return g;
    };
  }
  _for(_helperNN, function(n) { _copyHelperNN(n, _helperNN[n]); });
  _for(_helperGN, function(n) { _copyHelperGN(n, _helperGN[n]); });
  _for(_helperGNX, function(n) { _copyHelperGNX(n, _helperGNX[n]); });
  _for(_helperGC, function(n) { _copyHelperGC(n, _helperGC[n]); });
  _for(_helperGCX, function(n) { _copyHelperGCX(n, _helperGCX[n]); });
  _for(_helperNC, function(n) { _copyHelperM1N(n, _helperNC[n]); });
  _for(_helperMPE, function(n) { _copyHelperM1C(n, _helperMPE[n]); });
  _for(_helperCH, function(n) { _copyHelperM1C(n, _helperCH[n]); });
  _for(_helperGCH, function(n) { _copyHelperM1CX(n, _helperGCH[n]); });
  _for(_helperSX, function(n) { _copyHelperSX(n, _helperSX[n]); });
  _for(_helperSXX, function(n) { _copyHelperSXX(n, _helperSXX[n]); });

  function _copyUmpHelpers(M) {
    _for(_helpersUmp, function(n) { M.prototype[n] = _helpersUmp[n]; });
  }
  _copyUmpHelpers(_M2);

  UMP.prototype.getTempo = function() {
    if (this.isTempo()) return (this[4] << 24) + (this[5] << 16) + (this[6] << 8) + this[7];
  };
  UMP.prototype.getBPM = function() {
    var n = this.getTempo();
    if (n) return Math.round(6000000000 / n);
  };
  UMP.prototype.getTimeSignature = function() {
    if (this.isTimeSignature()) return [this[4], 1 << this[5]];
  };
  UMP.prototype.getTicksPQN = function() {
    if (this.isTicksPQN()) return (this[2] << 8) + this[3];
  };
  UMP.prototype.getDelta = function() {
    if (this.isDelta()) return ((this[1] & 15) << 16) + (this[2] << 8) + this[3];
  };

  UMP.prototype.isTempo = function() {
    return (this[0] >> 4) == 13 && (this[1] >> 4) == 1 &&  this[2] == 0 &&  this[3] == 0;
  };
  UMP.prototype.isTimeSignature = function() {
    return (this[0] >> 4) == 13 && (this[1] >> 4) == 1 &&  this[2] == 0 &&  this[3] == 1;
  };
  UMP.prototype.isTicksPQN = function() { return this[0] == 0 && (this[1] >> 4) == 3; };
  UMP.prototype.isDelta = function() { return this[0] == 0 && (this[1] >> 4) == 4; };
  UMP.prototype.isStartClip = function() { return this.match([0xf0, 0x20, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]); };
  UMP.prototype.isEndClip = function() { return this.match([0xf0, 0x21, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]); };
  UMP.prototype.isNoteOn = function() {
    var c = (this[0] || 0) >> 4;
    var d = (this[1] || 0) >> 4;
    if (c == 4) return d == 9;
    else if (c == 2) return d == 9 && !!this[3];
    return false;
  };
  UMP.prototype.isNoteOff = function() {
    var c = (this[0] || 0) >> 4;
    var d = (this[1] || 0) >> 4;
    if (c == 4) return d == 8;
    else if (c == 2) return d == 8 || (d == 9 && !this[3]);
    return false;
  };
  UMP.prototype.toString = MIDI.prototype.toString;
  UMP.prototype._str = function() {
    var t = this._string();
    return t ? _hexx(this) + ' -- ' + t : _hexx(this);
  };
  UMP.prototype._string = function() {
    var n, s;
    var t = this[0] >> 4;
    if (t == 1 || t == 2) return new MIDI(this.slice(1))._string();
    else if (t == 0) {
      n = this[1] >> 4;
      s = ['NOOP', 'JR Clock', 'JR Timestamp', 'Ticks Per Quarter Note', 'Delta Ticks'][n];
    }
    else if (t == 3) {
      s = 'SysEx';
    }
    else if (t == 4) {
      n = this[1] >> 4;
      s = {
        0: 'Registered Per-Note Controller',
        1: 'Assignable Per-Note Controller',
        2: 'Registered Controller',
        3: 'Assignable Controller',
        4: 'Relative Registered Controller',
        5: 'Relative Assignable Controller',
        6: 'Per-Note Pitch Bend',
        8: 'Note Off',
        9: 'Note On',
        10: 'Poly Pressure',
        11: 'Control Change',
        12: 'Program Change',
        13: 'Channel Pressure',
        14: 'Pitch Bend',
        15: 'Per-Note Management'
      }[n];
    }
    else if (t == 5) {
      s = 'Data';
    }
    else if (t == 13) {
      n = this[2];
      if (n == 0) {
        n = this[3];
        s = {
          0: 'Tempo ',
          1: 'Time Signature ',
          2: 'Metronome',
          5: 'Key Signature',
          6: 'Chord Name'
        }[n];
        if (n == 0) s += this.getBPM() + ' BPM';
        else if (n == 1) s += this.getTimeSignature().join('/');
      }
      else if (n == 1) {
        n = this[3];
        s = {
          0: 'Metadata',
          1: 'Project Name',
          2: 'Composition Name',
          3: 'Clip Name',
          4: 'Copyright',
          5: 'Composer Name',
          6: 'Lyricist Name',
          7: 'Arranger Name',
          8: 'Publisher Name',
          9: 'Primary Performer Name',
          10: 'Accompanying Performer Name',
          11: 'Recording Date',
          12: 'Recording Location'
        }[n] || 'Unknown Text';
      }
      else if (n == 2) {
        n = this[3];
        s = {
          0: 'Text',
          1: 'Lyrics',
          2: 'Lyrics Language',
          3: 'Ruby',
          4: 'Ruby Language',
        }[n] || 'Unknown Text';
      }
    }
    if (t == 15) {
      s = { 0x20: 'Start of Clip', 0x21: 'End of Clip' }[this[1]];
    }
    return s;
  };

  UMP.prototype._stamp = MIDI.prototype._stamp;
  UMP.prototype._unstamp = MIDI.prototype._unstamp;
  UMP.prototype._stamped = MIDI.prototype._stamped;
  UMP.prototype.match = MIDI.prototype.match;

  JZZ.UMP = UMP;
  _J.prototype.UMP = UMP;
  JZZ.MIDI2 = UMP;
  _J.prototype.MIDI2 = UMP;

  function _16_7(a, b) {
    var n = a * 0x100 + b;
    return n ? (n >> 9) || 1 : 0;
  }
  function _32_7(a, b, c, d) {
    var n = a * 0x1000000 + b * 0x10000 + c * 0x100 + d;
    return n ? ((n >> 25) & 127) || 1 : 0;
  }
  function _grp(m, g) { m.gr = g; return m; }
  function _m2m1(msg) {
    if (msg.isMidi2) {
      var n, c;
      var t = msg[0] >> 4;
      var g = msg[0] & 15;
      if (t == 1 || t == 2) {
        this._emit(_grp(new MIDI(msg.slice(1)), g));
      }
      else if (t == 3) {
        c = msg[1] >> 4;
        n = msg[1] & 15;
        if (c == 0) {
          this._emit(_grp(new MIDI([0xf0].concat(msg.slice(2, 2 + n), [0xf7])), g));
          this._sx[g] = undefined;
        }
        else if (c == 1) {
          this._sx[g] = msg.slice(2, 2 + n);
        }
        else if (c == 2) {
          if (this._sx[g]) this._sx[g] = this._sx[g].concat(msg.slice(2, 2 + n));
        }
        else if (c == 3) {
          if (this._sx[g]) this._emit(_grp(new MIDI([0xf0].concat(this._sx[g], msg.slice(2, 2 + n), [0xf7])), g));
          this._sx[g] = undefined;
        }
      }
      else if (t == 4) {
        n = msg[1] >> 4;
        c = msg[1] & 15;
        if (n == 2 || n == 3) {
          this._emit(_grp(new MIDI([0xb0 + c, n == 2 ? 101 : 99, msg[2]]), g));
          this._emit(_grp(new MIDI([0xb0 + c, n == 2 ? 100 : 98, msg[3]]), g));
          this._emit(_grp(new MIDI([0xb0 + c, 6, msg[4] >> 1]), g));
          this._emit(_grp(new MIDI([0xb0 + c, 38, (msg[4] & 1) * 64 + (msg[4] >> 2)]), g));
        }
        else if (n == 8 || n == 9) {
          this._emit(_grp(new MIDI([msg[1], msg[2], _16_7(msg[4], msg[5])]), g));
        }
        if (n == 10) {
          this._emit(_grp(new MIDI([msg[1], msg[2], _32_7(msg[4], msg[5], msg[6], msg[7])]), g));
        }
        if (n == 11) {
          if (_noctrl.includes(msg[2])) return;
          this._emit(_grp(new MIDI([msg[1], msg[2], _32_7(msg[4], msg[5], msg[6], msg[7])]), g));
        }
        if (n == 13) {
          this._emit(_grp(new MIDI([msg[1], _32_7(msg[4], msg[5], msg[6], msg[7])]), g));
        }
        else if (n == 12) {
          if (msg[3]) {
            this._emit(_grp(new MIDI([0xb0 + c, 0, msg[6]]), g));
            this._emit(_grp(new MIDI([0xb0 + c, 32, msg[7]]), g));
          }
          this._emit(_grp(new MIDI([msg[1], msg[4]]), g));
        }
      }
    }
    else this._emit(msg);
  }
  function M2M1() {
    var self = new _M();
    self._sx = [];
    self._receive = _m2m1;
    self._resume();
    return self.MIDI2();
  }
  JZZ.M2M1 = M2M1;
  _J.prototype.M2M1 = JZZ.M2M1;

  function _m1m2(msg) {
    if (!msg.isMidi2) {
      var gr = msg.gr >= 0 && msg.gr <= 15 ? msg.gr : 0;
      if (msg[0] >= 0x80 && msg[0] < 0xf0) {
        this._emit(JZZ.MIDI2([0x20 + gr].concat(msg.slice(), _zeros).slice(0, 4)));
      }
      else if (msg[0] > 0xf0 && msg[0] <= 0xff && msg[0] != 0xf7) {
        this._emit(JZZ.MIDI2([0x10 + gr].concat(msg.slice(), _zeros).slice(0, 4)));
      }
      else if (msg.isFullSysEx()) {
        var a = _sliceSX(gr, msg.slice());
        for (var i = 0; i < a.length; i++) this._emit(JZZ.MIDI2(a[i]));
      }
    }
    else this._emit(msg);
  }
  function M1M2() {
    var self = new _M();
    self._receive = _m1m2;
    self._resume();
    return self;
  }
  JZZ.M1M2 = M1M2;
  _J.prototype.M1M2 = JZZ.M1M2;

  JZZ.lib = {};
  JZZ.lib.now = _now;
  JZZ.lib.schedule = _schedule;
  var _sch_list = [];
  var _sch_worker;
  var _sch_count = 0;
  try {
    var _blob = URL.createObjectURL(new Blob(['(', function() {
      function tick() {
        postMessage({});
        setTimeout(tick, 0);
      }
      tick();
    }.toString(), ')()'], { type: 'application/javascript' }));
    var _sch_tick = function() {
      var n = _sch_list.length;
      // cannot use i < _sch_list.length !
      for (var i = 0; i < n; i++) _sch_list.shift()();
      _sch_count++;
      if (_sch_count > 20 && _sch_worker) {
        _sch_worker.terminate();
        _sch_worker = undefined;
      }
    };
    var _sch = function(x) {
      _sch_list.push(x);
      _sch_count = 0;
      if (!_sch_worker) {
        _sch_worker = new Worker(_blob);
        _sch_worker.onmessage = _sch_tick;
      }
    };
    _sch(function() { JZZ.lib.schedule = _sch; });
  }
  catch (e) {}

  JZZ.lib.openMidiOut = function(name, engine) {
    var port = new _M();
    engine._openOut(port);
    port._info = engine._info(name);
    return port;
  };
  JZZ.lib.openMidiIn = function(name, engine) {
    var port = new _M();
    engine._openIn(port);
    port._info = engine._info(name);
    return port;
  };
  JZZ.lib.registerMidiOut = function(name, engine) {
    var x = engine._info(name);
    for (var i = 0; i < _virtual._outs.length; i++) if (_virtual._outs[i].name == x.name) return false;
    x.engine = engine;
    _virtual._outs.push(x);
    if (_jzz) {
      _postRefresh();
      if (_jzz._bad) { _jzz._repair(); _jzz._resume(); }
    }
    return true;
  };
  JZZ.lib.registerMidiIn = function(name, engine) {
    var x = engine._info(name);
    for (var i = 0; i < _virtual._ins.length; i++) if (_virtual._ins[i].name == x.name) return false;
    x.engine = engine;
    _virtual._ins.push(x);
    if (_jzz) {
      _postRefresh();
      if (_jzz._bad) { _jzz._repair(); _jzz._resume(); }
    }
    return true;
  };
  var _ac;
  function _initAudioContext() {
    if (!_ac && typeof window !== 'undefined') {
      var AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        _ac = new AudioContext();
        if (_ac && !_ac.createGain) _ac.createGain = _ac.createGainNode;
        var _activateAudioContext = function() {
          if (_ac.state != 'running') {
            _ac.resume();
            var osc = _ac.createOscillator();
            var gain = _ac.createGain();
            try { gain.gain.value = 0; } catch (err) {}
            gain.gain.setTargetAtTime(0, _ac.currentTime, 0.01);
            osc.connect(gain);
            gain.connect(_ac.destination);
            if (!osc.start) osc.start = osc.noteOn;
            if (!osc.stop) osc.stop = osc.noteOff;
            osc.start(0.1); osc.stop(0.11);
          }
          else if (typeof document != 'undefined') {
            document.removeEventListener('touchstart', _activateAudioContext);
            document.removeEventListener('touchend', _activateAudioContext);
            document.removeEventListener('mousedown', _activateAudioContext);
            document.removeEventListener('keydown', _activateAudioContext);
          }
        };
        if (typeof document != 'undefined') {
          document.addEventListener('touchstart', _activateAudioContext);
          document.addEventListener('touchend', _activateAudioContext);
          document.addEventListener('mousedown', _activateAudioContext);
          document.addEventListener('keydown', _activateAudioContext);
        }
        _activateAudioContext();
      }
    }
  }
  JZZ.lib.copyMidiHelpers = _copyMidiHelpers;
  JZZ.lib.copyMidi2Helpers = _copyUmpHelpers;
  JZZ.lib.copyUmpHelpers = _copyUmpHelpers;
  JZZ.lib.getAudioContext = function() { _initAudioContext(); return _ac; };
  var _b64 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
  JZZ.lib.fromBase64 = function(input) {
    var output = '';
    var chr1, chr2, chr3;
    var enc1, enc2, enc3, enc4;
    var i = 0;
    input = input.replace(/[^A-Za-z0-9+/=]/g, '');
    while (i < input.length) {
      enc1 = _b64.indexOf(input.charAt(i++));
      enc2 = _b64.indexOf(input.charAt(i++));
      enc3 = _b64.indexOf(input.charAt(i++));
      enc4 = _b64.indexOf(input.charAt(i++));
      chr1 = (enc1 << 2) | (enc2 >> 4);
      chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
      chr3 = ((enc3 & 3) << 6) | enc4;
      output = output + String.fromCharCode(chr1);
      if (enc3 != 64) {
        output = output + String.fromCharCode(chr2);
      }
      if (enc4 != 64) {
        output = output + String.fromCharCode(chr3);
      }
    }
    return output;
  };
  JZZ.lib.toBase64 = function(data) {
    var o1, o2, o3, h1, h2, h3, h4, bits, i = 0, ac = 0, enc = '', arr = [];
    if (!data) return data;
    do {
      o1 = data.charCodeAt(i++);
      o2 = data.charCodeAt(i++);
      o3 = data.charCodeAt(i++);
      bits = o1 << 16 | o2 << 8 | o3;
      h1 = bits >> 18 & 0x3f;
      h2 = bits >> 12 & 0x3f;
      h3 = bits >> 6 & 0x3f;
      h4 = bits & 0x3f;
      arr[ac++] = _b64.charAt(h1) + _b64.charAt(h2) + _b64.charAt(h3) + _b64.charAt(h4);
    } while(i < data.length);
    enc = arr.join('');
    var r = data.length % 3;
    return (r ? enc.slice(0, r - 3) + '==='.slice(r) : enc);
  };
  JZZ.lib.fromUTF8 = function(data) {
    data = typeof data == 'undefined' ? '' : '' + data;
    var out = '';
    var i, n, m;
    for (i = 0; i < data.length; i++) {
      n = data.charCodeAt(i);
      if (n > 0xff) return data;
      if (n < 0x80) out += data[i];
      else if ((n & 0xe0) == 0xc0) {
        n = (n & 0x1f) << 6;
        i++; if (i >= data.length) return data;
        m = data.charCodeAt(i);
        if ((m & 0xc0) != 0x80) return data;
        n += (m & 0x3f);
        out += String.fromCharCode(n);
      }
      else if ((n & 0xf0) == 0xe0) {
        n = (n & 0x0f) << 12;
        i++; if (i >= data.length) return data;
        m = data.charCodeAt(i);
        if ((m & 0xc0) != 0x80) return data;
        n += (m & 0x3f) << 6;
        i++; if (i >= data.length) return data;
        m = data.charCodeAt(i);
        if ((m & 0xc0) != 0x80) return data;
        n += (m & 0x3f);
        out += String.fromCharCode(n);
      }
      else if ((n & 0xf8) == 0xf0) {
        n = (n & 0x07) << 18;
        i++; if (i >= data.length) return data;
        m = data.charCodeAt(i);
        if ((m & 0xc0) != 0x80) return data;
        n += (m & 0x3f) << 12;
        i++; if (i >= data.length) return data;
        m = data.charCodeAt(i);
        if ((m & 0xc0) != 0x80) return data;
        n += (m & 0x3f) << 6;
        i++; if (i >= data.length) return data;
        m = data.charCodeAt(i);
        if ((m & 0xc0) != 0x80) return data;
        n += (m & 0x3f);
        if (n > 0x10ffff) return data;
        n -= 0x10000;
        out += String.fromCharCode(0xd800 + (n >> 10));
        out += String.fromCharCode(0xdc00 + (n & 0x3ff));
      }
    }
    return out;
  };
  JZZ.lib.toUTF8 = function(data) {
    data = typeof data == 'undefined' ? '' : '' + data;
    var out = '';
    var i, n;
    for (i = 0; i < data.length; i++) {
      n = data.charCodeAt(i);
      if (n < 0x80) out += data[i];
      else if (n < 0x800) {
        out += String.fromCharCode(0xc0 + (n >> 6));
        out += String.fromCharCode(0x80 + (n & 0x3f));
      }
      else if (n < 0x10000) {
        out += String.fromCharCode(0xe0 + (n >> 12));
        out += String.fromCharCode(0x80 + ((n >> 6) & 0x3f));
        out += String.fromCharCode(0x80 + (n & 0x3f));
      }
      /* istanbul ignore next */
      else {
        out += String.fromCharCode(0xf0 + (n >> 18));
        out += String.fromCharCode(0x80 + ((n >> 12) & 0x3f));
        out += String.fromCharCode(0x80 + ((n >> 6) & 0x3f));
        out += String.fromCharCode(0x80 + (n & 0x3f));
      }
    }
    return out;
  };

  // Web MIDI API
  var _wma = [];
  var _outputMap = {};
  var _inputMap = {};

  var Promise = _scope.Promise;
  /* istanbul ignore next */
  if (typeof Promise !== 'function') {
    Promise = function(executor) {
      this.executor = executor;
    };
    Promise.prototype.then = function(resolve, reject) {
      if (typeof resolve !== 'function') {
        resolve = _nop;
      }
      if (typeof reject !== 'function') {
        reject = _nop;
      }
      this.executor(resolve, reject);
    };
  }
  function DOMException(name, message, code) {
    this.name = name;
    this.message = message;
    this.code = code;
  }

  function MIDIConnectionEvent(port, target) {
    this.bubbles = false;
    this.cancelBubble = false;
    this.cancelable = false;
    this.currentTarget = target;
    this.defaultPrevented = false;
    this.eventPhase = 0;
    this.path = [];
    this.port = port;
    this.returnValue = true;
    this.srcElement = target;
    this.target = target;
    this.timeStamp = _now();
    this.type = 'statechange';
  }

  function MIDIMessageEvent(port, data) {
    this.bubbles = false;
    this.cancelBubble = false;
    this.cancelable = false;
    this.currentTarget = port;
    this.data = data;
    this.defaultPrevented = false;
    this.eventPhase = 0;
    this.path = [];
    this.receivedTime = _now();
    this.returnValue = true;
    this.srcElement = port;
    this.target = port;
    this.timeStamp = this.receivedTime;
    this.type = 'midimessage';
  }

  function _statechange(p, a) {
    if (p) {
      if (p.onstatechange) p.onstatechange(new MIDIConnectionEvent(p, p));
      if (a.onstatechange) a.onstatechange(new MIDIConnectionEvent(p, a));
    }
  }

  function MIDIInput(a, p) {
    var self = this;
    var _open = false;
    var _ochng = null;
    var _onmsg = null;
    this.type = 'input';
    this.id = p.id;
    this.name = p.name;
    this.manufacturer = p.man;
    this.version = p.ver;
    Object.defineProperty(this, 'state', { get: function() { return p.connected ? 'connected' : 'disconnected'; }, enumerable: true });
    Object.defineProperty(this, 'connection', { get: function() {
      return _open ? p.proxy ? 'open' : 'pending' : 'closed';
    }, enumerable: true });
    Object.defineProperty(this, 'onmidimessage', {
      get: function() { return _onmsg; },
      set: function(value) {
        if (_func(value)) {
          _onmsg = value;
          if (!_open) self.open().then(_nop, _nop);
        }
        else _onmsg = null;
      },
      enumerable: true
    });
    Object.defineProperty(this, 'onstatechange', {
      get: function() { return _ochng; },
      set: function(value) {
        if (_func(value)) _ochng = value;
        else _ochng = null;
      },
      enumerable: true
    });
    this.open = function() {
      return new Promise(function(resolve, reject) {
        if (_open) resolve(self);
        else {
          p.open().then(function() {
            if (!_open) {
              _open = true;
              _statechange(self, a);
            }
            resolve(self);
          }, function() {
            reject(new DOMException('InvalidAccessError', 'Port is not available', 15));
          });
        }
      });
    };
    this.close = function() {
      return new Promise(function(resolve/*, reject*/) {
        if (_open) {
          _open = false;
          p.close();
          _statechange(self, a);
        }
        resolve(self);
      });
    };
    Object.freeze(this);
  }

  function _split(q) {
    var i, k;
    while (q.length) {
      for (i = 0; i < q.length; i++) if (q[i] == parseInt(q[i]) && q[i] >= 0x80 && q[i] <= 0xff && q[i] != 0xf7) break;
      q.splice(0, i);
      if (!q.length) return;
      if (q[0] == 0xf0) {
        for (i = 1; i < q.length; i++) if (q[i] == 0xf7) break;
        if (i == q.length) return;
        return q.splice(0, i + 1);
      }
      else {
        k = _datalen(q[0]) + 1;
        if (k > q.length) return;
        for (i = 1; i < k; i++) if (q[i] != parseInt(q[i]) || q[i] < 0 || q[i] >= 0x80) break;
        if (i == k) return q.splice(0, i);
        else q.splice(0, i);
      }
    }
  }

  function _InputProxy(id, name, man, ver) {
    var self = this;
    this.id = id;
    this.name = name;
    this.man = man;
    this.ver = ver;
    this.connected = true;
    this.ports = [];
    this.pending = [];
    this.proxy = undefined;
    this.queue = [];
    this.onmidi = function(msg) {
      var m;
      self.queue = self.queue.concat(msg.slice());
      for (m = _split(self.queue); m; m = _split(self.queue)) {
        for (i = 0; i < self.ports.length; i++) {
          if (self.ports[i][0].onmidimessage && (m[0] != 0xf0 || self.ports[i][1])) {
            self.ports[i][0].onmidimessage(new MIDIMessageEvent(self, new Uint8Array(m)));
          }
        }
      }
    };
  }
  _InputProxy.prototype.open = function() {
    var self = this;
    return new Promise(function(resolve, reject) {
      var i;
      if (self.proxy || !self.connected) resolve();
      else {
        self.pending.push([resolve, reject]);
        if (self.pending.length == 1) {
          JZZ().openMidiIn(self.name).or(function() {
            for (i = 0; i < self.pending.length; i++) self.pending[i][1]();
            self.pending = [];
          }).and(function() {
            self.proxy = this;
            self.proxy.connect(self.onmidi);
            for (i = 0; i < self.pending.length; i++) self.pending[i][0]();
            self.pending = [];
          });
        }
      }
    });
  };
  _InputProxy.prototype.close = function() {
    var i;
    if (this.proxy) {
      for (i = 0; i < this.ports.length; i++) if (this.ports[i].connection == 'open') return;
      this.proxy.close();
      this.proxy = undefined;
    }
  };
  _InputProxy.prototype.disconnect = function() {
    this.connected = false;
    if (this.proxy) {
      this.proxy.close();
      this.proxy = undefined;
    }
  };
  _InputProxy.prototype.reconnect = function() {
    var self = this;
    var i, p;
    var a = [];
    this.connected = true;
    for (i = 0; i < _wma.length; i++) {
      p = _wma[i].inputs.get(this.id);
      if (p.connection == 'closed') _statechange(p, _wma[i]);
      else a.push([p, _wma[i]]);
    }
    if (a.length) {
      JZZ()._openMidiInNR(self.name).or(function() {
        for (i = 0; i < a.length; i++) a[i][0].close();
      }).and(function() {
        self.proxy = this;
        self.proxy.connect(self.onmidi);
        for (i = 0; i < a.length; i++) _statechange(a[i][0], a[i][1]);
      });
    }
  };

  function _datalen(x) {
    if (x >= 0x80 && x <= 0xbf || x >= 0xe0 && x <= 0xef || x == 0xf2) return 2;
    if (x >= 0xc0 && x <= 0xdf || x == 0xf1 || x == 0xf3) return 1;
    return 0;
  }

  var _epr = "Failed to execute 'send' on 'MIDIOutput': ";

  function _validate(arr, sysex) {
    var i, k;
    var msg;
    var data = [];
    for (i = 0; i < arr.length; i++) {
      if (arr[i] != parseInt(arr[i]) || arr[i] < 0 || arr[i] > 255) throw TypeError(_epr + arr[i] + ' is not a UInt8 value.');
    }
    k = 0;
    for (i = 0; i < arr.length; i++) {
      if (!k) {
        if (arr[i] < 0x80) throw TypeError(_epr + 'Running status is not allowed at index ' + i + ' (' + arr[i] + ').');
        if (arr[i] == 0xf7) throw TypeError(_epr + 'Unexpected end of system exclusive message at index ' + i + ' (' + arr[i] + ').');
        msg = [arr[i]];
        data.push(msg);
        if (arr[i] == 0xf0) {
          if (!sysex) throw new DOMException('InvalidAccessError', _epr + 'System exclusive messag is not allowed at index ' + i + ' (' + arr[i] + ').', 15);
          k = -1;
          for (; i < arr.length; i++) {
            msg.push(arr[i]);
            if (arr[i] == 0xf7) {
              k = 0;
              break;
            }
          }
        }
        else {
          k = _datalen(arr[i]);
        }
      }
      else {
        if (arr[i] > 0x7f) throw TypeError(_epr + 'Unexpected status byte at index ' + i + ' (' + arr[i] + ').');
        msg.push(arr[i]);
        k--;
      }
    }
    if (k) throw TypeError(_epr + 'Message is incomplete');
    return [data];
  }

  function MIDIOutput(a, p) {
    var self = this;
    var _open = false;
    var _ochng = null;
    this.type = 'output';
    this.id = p.id;
    this.name = p.name;
    this.manufacturer = p.man;
    this.version = p.ver;
    Object.defineProperty(this, 'state', { get: function() { return p.connected ? 'connected' : 'disconnected'; }, enumerable: true });
    Object.defineProperty(this, 'connection', { get: function() {
      return _open ? p.proxy ? 'open' : 'pending' : 'closed';
    }, enumerable: true });
    Object.defineProperty(this, 'onstatechange', {
      get: function() { return _ochng; },
      set: function(value) {
        if (_func(value)) _ochng = value;
        else _ochng = null;
      },
      enumerable: true
    });
    this.open = function() {
      return new Promise(function(resolve, reject) {
        if (_open) resolve(self);
        else {
          p.open().then(function() {
            if (!_open) {
              _open = true;
              _statechange(self, a);
            }
            resolve(self);
          }, function() {
            reject(new DOMException('InvalidAccessError', 'Port is not available', 15));
          });
        }
      });
    };
    this.close = function() {
      return new Promise(function(resolve/*, reject*/) {
        if (_open) {
          _open = false;
          self.clear();
          p.close();
          _statechange(self, a);
        }
        resolve(self);
      });
    };
    this.clear = function() {
    };
    this.send = function(data, timestamp) {
      _validate(data, a.sysexEnabled);
      if (!p.connected) throw new DOMException('InvalidStateError', 'Port is not connected', 11);
      if (_open) {
        var now = _now();
        if (timestamp > now) setTimeout(function() { p.proxy.send(data); }, timestamp - now);
        else p.proxy.send(data);
      }
      else this.open().then(function() { self.send(data, timestamp); }, _nop);
    };
    Object.freeze(this);
  }

  function _OutputProxy(id, name, man, ver) {
    this.id = id;
    this.name = name;
    this.man = man;
    this.ver = ver;
    this.connected = true;
    this.ports = [];
    this.pending = [];
    this.proxy = undefined;
  }
  _OutputProxy.prototype.open = function() {
    var self = this;
    return new Promise(function(resolve, reject) {
      var i;
      if (self.proxy || !self.connected) resolve();
      else {
        self.pending.push([resolve, reject]);
        if (self.pending.length == 1) {
          JZZ().openMidiOut(self.name).or(function() {
            for (i = 0; i < self.pending.length; i++) self.pending[i][1]();
            self.pending = [];
          }).and(function() {
            self.proxy = this;
            for (i = 0; i < self.pending.length; i++) self.pending[i][0]();
            self.pending = [];
          });
        }
      }
    });
  };
  _OutputProxy.prototype.close = function() {
    var i;
    if (this.proxy) {
      for (i = 0; i < this.ports.length; i++) if (this.ports[i].connection == 'open') return;
      this.proxy.close();
      this.proxy = undefined;
    }
  };
  _OutputProxy.prototype.disconnect = function() {
    this.connected = false;
    if (this.proxy) {
      this.proxy.close();
      this.proxy = undefined;
    }
  };
  _OutputProxy.prototype.reconnect = function() {
    var self = this;
    var i, p;
    var a = [];
    this.connected = true;
    for (i = 0; i < _wma.length; i++) {
      p = _wma[i].outputs.get(this.id);
      if (p.connection == 'closed') _statechange(p, _wma[i]);
      else a.push([p, _wma[i]]);
    }
    if (a.length) {
      JZZ()._openMidiOutNR(self.name).or(function() {
        for (i = 0; i < a.length; i++) a[i][0].close();
      }).and(function() {
        self.proxy = this;
        for (i = 0; i < a.length; i++) _statechange(a[i][0], a[i][1]);
      });
    }
  };

  function _Maplike(data) {
    this.has = function(id) {
      return data.hasOwnProperty(id) && data[id].connected;
    };
    this.keys = function() {
      try { // some old browsers may have no Map object
        var m = new Map();
        for (var id in data) if (this.has(id)) m.set(id, this.get(id));
        return m.keys();
      } catch (e) {}
    };
    this.values = function() {
      try {
        var m = new Map();
        for (var id in data) if (this.has(id)) m.set(id, this.get(id));
        return m.values();
      } catch (e) {}
    };
    this.entries = function() {
      try {
        var m = new Map();
        for (var id in data) if (this.has(id)) m.set(id, this.get(id));
        return m.entries();
      } catch (e) {}
    };
    this.forEach = function(fun, self) {
      if (typeof self == 'undefined') self = this;
      for (var id in data) if (this.has(id)) fun.call(self, this.get(id), id, this);
    };
    Object.defineProperty(this, 'size', {
      get: function() {
        var len = 0;
        for (var id in data) if (this.has(id)) len++;
        return len;
      },
      enumerable: true
    });
  }

  function MIDIInputMap(_access, _inputs) {
    this.get = function(id) {
      if (_inputMap.hasOwnProperty(id) && _inputMap[id].connected) {
        if (!_inputs[id]) {
          _inputs[id] = new MIDIInput(_access, _inputMap[id]);
          _inputMap[id].ports.push([_inputs[id], _access.sysexEnabled]);
        }
        return _inputs[id];
      }
    };
    Object.freeze(this);
  }
  MIDIInputMap.prototype = new _Maplike(_inputMap);
  MIDIInputMap.prototype.constructor = MIDIInputMap;

  function MIDIOutputMap(_access, _outputs) {
    this.get = function(id) {
      if (_outputMap.hasOwnProperty(id) && _outputMap[id].connected) {
        if (!_outputs[id]) {
          _outputs[id] = new MIDIOutput(_access, _outputMap[id]);
          _outputMap[id].ports.push([_outputs[id], _access.sysexEnabled]);
        }
        return _outputs[id];
      }
    };
    Object.freeze(this);
  }
  MIDIOutputMap.prototype = new _Maplike(_outputMap);
  MIDIOutputMap.prototype.constructor = MIDIOutputMap;

  function _wm_watch(x) {
    var i, k, p, a;
    for (i = 0; i < x.inputs.added.length; i++) {
      p = x.inputs.added[i];
      if (!_inputMap.hasOwnProperty(p.id)) _inputMap[p.id] = new _InputProxy(p.id, p.name, p.manufacturer, p.version);
      _inputMap[p.id].reconnect();
    }
    for (i = 0; i < x.outputs.added.length; i++) {
      p = x.outputs.added[i];
      if (!_outputMap.hasOwnProperty(p.id)) _outputMap[p.id] = new _OutputProxy(p.id, p.name, p.manufacturer, p.version);
      _outputMap[p.id].reconnect();
    }
    for (i = 0; i < x.inputs.removed.length; i++) {
      p = x.inputs.removed[i];
      if (_inputMap.hasOwnProperty(p.id)) {
        a = [];
        for (k = 0; k < _wma.length; k++) a.push([_wma[k].inputs.get(p.id), _wma[k]]);
        _inputMap[p.id].disconnect();
        for (k = 0; k < a.length; k++) _statechange(a[k][0], a[k][1]);
      }
    }
    for (i = 0; i < x.outputs.removed.length; i++) {
      p = x.outputs.removed[i];
      if (_outputMap.hasOwnProperty(p.id)) {
        a = [];
        for (k = 0; k < _wma.length; k++) a.push([_wma[k].outputs.get(p.id), _wma[k]]);
        _outputMap[p.id].disconnect();
        for (k = 0; k < a.length; k++) _statechange(a[k][0], a[k][1]);
      }
    }
  }

  function MIDIAccess(sysex) {
    var _inputs = {};
    var _outputs = {};
    var _onstatechange = null;
    var self = this;
    this.sysexEnabled = sysex;
    this.inputs = new MIDIInputMap(self, _inputs);
    this.outputs = new MIDIOutputMap(self, _outputs);
    Object.defineProperty(this, 'onstatechange', {
      get: function() { return _onstatechange; },
      set: function(f) { _onstatechange = _func(f) ? f : null; },
      enumerable: true
    });
    Object.freeze(this);
    var i;
    var p;
    var info = _jzz._info;
    for (i = 0; i < info.inputs.length; i++) {
      p = info.inputs[i];
      if (!_inputMap.hasOwnProperty(p.id)) _inputMap[p.id] = new _InputProxy(p.id, p.name, p.manufacturer, p.version);
    }
    for (i = 0; i < info.outputs.length; i++) {
      p = info.outputs[i];
      if (!_outputMap.hasOwnProperty(p.id)) _outputMap[p.id] = new _OutputProxy(p.id, p.name, p.manufacturer, p.version);
    }
    if (!_wma.length) JZZ().onChange(_wm_watch);
    _wma.push(this);
  }

  JZZ.requestMIDIAccess = function(opt) {
    return new Promise(function(resolve, reject) {
      JZZ.JZZ(opt).or(function() {
      }).and(function() {
        var sysex = !!(opt && opt.sysex);
        if (sysex && !this.info().sysex) reject(new DOMException('SecurityError', 'Sysex is not allowed', 18));
        else {
          var wma = new MIDIAccess(sysex);
          resolve(wma);
        }
      });
    });
  };
  if (typeof navigator !== 'undefined' && !navigator.requestMIDIAccess) navigator.requestMIDIAccess = JZZ.requestMIDIAccess;
  JZZ.close = function() { if (_engine._close) _engine._close(); };

  return JZZ;
});
