(function() {

  var _version = '0.1.6';

  // _R: common root for all async objects
  function _R() {
    this._orig = this;
    this._ready = false;
    this._queue = [];
    this._err = [];
  };
  _R.prototype._exec = function() {
    while (this._ready && this._queue.length) {
      var x = this._queue.shift();
      if (this._orig._bad) {
        if (this._orig._hope && x[0] == _or) {
          this._orig._hope = false;
          x[0].apply(this, x[1]);
        }
        else {
          this._queue = [];
          this._orig._hope = false;
        }
      }
      else if (x[0] != _or) {
        x[0].apply(this, x[1]);
      }
    }
  }
  _R.prototype._push = function(func, arg) { this._queue.push([func, arg]); _R.prototype._exec.apply(this);}
  _R.prototype._slip = function(func, arg) { this._queue.unshift([func, arg]);}
  _R.prototype._pause = function() { this._ready = false;}
  _R.prototype._resume = function() { this._ready = true; _R.prototype._exec.apply(this);}
  _R.prototype._break = function(err) { this._orig._bad = true; this._orig._hope = true; if (err) this._orig._err.push(err);}
  _R.prototype._repair = function() { this._orig._bad = false;}
  _R.prototype._crash = function(err) { this._break(err); this._resume();}
  _R.prototype.err = function() { return _clone(this._err);}

  function _wait(obj, delay) { setTimeout(function(){obj._resume();}, delay);}
  _R.prototype.wait = function(delay) {
    if (!delay) return this;
    function F(){}; F.prototype = this._orig;
    var ret = new F();
    ret._ready = false;
    ret._queue = [];
    this._push(_wait, [ret, delay]);
    return ret;
  }

  function _and(q) { if (q instanceof Function) q.apply(this); else console.log(q);}
  _R.prototype.and = function(func) { this._push(_and, [func]); return this;}
  function _or(q) { if (q instanceof Function) q.apply(this); else console.log(q);}
  _R.prototype.or = function(func) { this._push(_or, [func]); return this;}

  function _tryAny(arr) {
    if (!arr.length) {
      this._break();
    }
    var func = arr.shift();
    if (arr.length) {
      var self = this;
      this._slip(_or, [ function(){ _tryAny.apply(self,[arr]);} ]);
    }
    try {
      this._repair();
      func.apply(this);
    }
    catch (e) {
      this._break(e.toString());
    }
  }

  function _push(arr, obj) {
    for (var i in arr) if (arr[i] === obj) return;
    arr.push(obj);
  }
  function _pop(arr, obj) {
    for (var i in arr) if (arr[i] === obj) {
      arr.splice(i, 1);
      return;
    }
  }

  // _J: JZZ object
  function _J() {
    _R.apply(this);
  }
  _J.prototype = new _R();

  _J.prototype.time = function() { return 0; }
  if (typeof performance != 'undefined' && performance.now) _J.prototype._time = function() { return performance.now(); }
  function _initTimer() {
    if (!_J.prototype._time) _J.prototype._time = function() { return Date.now(); }
    _J.prototype._startTime = _J.prototype._time();
    _J.prototype.time = function() { return _J.prototype._time() - _J.prototype._startTime; }
  }

  function _clone(obj) {
    if (obj instanceof Object) {
      var ret = obj instanceof Array ? [] : {};
      for(var k in obj) ret[k] = _clone(obj[k]);
      return ret;
    }
    return obj;
  }
  _J.prototype._info = { name: 'JZZ.js', version: _version };
  _J.prototype.info = function() { return _clone(this._info); }

  var _outs = [];
  var _ins = [];

  function _postRefresh() {
    this._info.engine = _engine._type;
    this._info.inputs = [];
    this._info.outputs = [];
    _outs = [];
    _ins = [];
    _engine._allOuts = {};
    _engine._allIns = {};
    var i, x;
    for (i=0; i<_engine._outs.length; i++) {
      x = _engine._outs[i];
      x.engine = _engine;
      _engine._allOuts[x.name] = x;
      this._info.outputs.push({
        name: x.name,
        manufacturer: x.manufacturer,
        version: x.version,
        engine: _engine._type
      });
      _outs.push(x);
    }
    for (i=0; i<_virtual._outs.length; i++) {
      x = _virtual._outs[i];
      this._info.outputs.push({
        name: x.name,
        manufacturer: x.manufacturer,
        version: x.version,
        engine: x.type
      });
      _outs.push(x);
    }
    for (i=0; i<_engine._ins.length; i++) {
      x = _engine._ins[i];
      x.engine = _engine;
      _engine._allIns[x.name] = x;
      this._info.inputs.push({
        name: x.name,
        manufacturer: x.manufacturer,
        version: x.version,
        engine: _engine._type
      });
      _ins.push(x);
    }
    for (i=0; i<_virtual._ins.length; i++) {
      x = _virtual._ins[i];
      this._info.inputs.push({
        name: x.name,
        manufacturer: x.manufacturer,
        version: x.version,
        engine: x.type
      });
      _ins.push(x);
    }
  }
  function _refresh() {
    this._slip(_postRefresh, []);
    _engine._refresh();
  }
  _J.prototype.refresh = function() {
    this._push(_refresh, []);
    return this;
  }

  function _filterList(q, arr) {
    if (q === undefined) return arr.slice();
    var i, n;
    var a = [];
    if (q instanceof RegExp) {
      for (n=0; n<arr.length; n++) if (q.test(arr[n].name)) a.push(arr[n]);
      return a;
    }
    if (q instanceof Function) q = q(arr);
    if (!(q instanceof Array)) q = [q];
    for (i=0; i<q.length; i++) {
      for (n=0; n<arr.length; n++) {
        if (q[i]+'' === n+'' || q[i] === arr[n].name || (q[i] instanceof Object && q[i].name === arr[n].name)) a.push(arr[n]);
      }
    }
    return a;
  }

  function _openMidiOut(port, arg) {
    var arr = _filterList(arg, _outs);
    function pack(x){ return function(){x.engine._openOut(this, x.name);};};
    for (var i=0; i<arr.length; i++) arr[i] = pack(arr[i]);
    port._slip(_tryAny, [arr]);
    port._resume();
  }
  _J.prototype.openMidiOut = function(arg) {
    var port = new _O();
    this._push(_refresh, []);
    this._push(_openMidiOut, [port, arg]);
    return port;
  }

  function _openMidiIn(port, arg) {
    var arr = _filterList(arg, _ins);
    function pack(x){ return function(){x.engine._openIn(this, x.name);};};
    for (var i=0; i<arr.length; i++) arr[i] = pack(arr[i]);
    port._slip(_tryAny, [arr]);
    port._resume();
  }
  _J.prototype.openMidiIn = function(arg) {
    var port = new _I();
    this._push(_refresh, []);
    this._push(_openMidiIn, [port, arg]);
    return port;
  }

  function _close(obj) {
    _engine._close();
    this._break();
    obj._resume();
  }
  _J.prototype.close = function() {
    var ret = new _R();
    this._push(_close, [ret]);
    return ret;
  }

  // _O: MIDI-Out object
  function _O() {
    _R.apply(this);
  }
  _O.prototype = new _R();
  _O.prototype.name = function() { return this._impl ? this._impl.name : undefined;}
  _O.prototype.info = function() { return this._impl ? _clone(this._impl.info) : {};}

  function _closeMidiOut(obj) {
    if (this._impl._close) this._impl._close(this);
    this._break('closed');
    obj._resume();
  }
  _O.prototype.close = function() {
    var ret = new _R();
    this._push(_closeMidiOut, [ret]);
    return ret;
  }

  function _send(arg) {
    this._impl._send(arg);
  }
  _O.prototype.send = function() {
    this._push(_send, [MIDI.apply(null, arguments)]);
    return this;
  }
  _O.prototype.note = function(c, n, v, t) {
    this.noteOn(c, n, v);
    if (t) this.wait(t).noteOff(c, n);
    return this;
  }

  // _I: MIDI-In object
  function _I() {
    _R.apply(this);
    this._handles = [];
    this._outs = [];
  }
  _I.prototype = new _R();
  _I.prototype.name = _O.prototype.name;
  _I.prototype.info = _O.prototype.info;
  _I.prototype._event = function(msg) {
    for (var i in this._handles) this._handles[i].apply(this, [msg]);
    for (var i in this._outs) this._outs[i]._send(msg);
  }
  function _connect(arg) {
    if (arg instanceof Function) _push(this._orig._handles, arg);
    else _push(this._orig._outs, arg);
  }
  function _disconnect(arg) {
    if (arg instanceof Function) _pop(this._orig._handles, arg);
    else _pop(this._orig._outs, arg);
  }
  _I.prototype.connect = function(arg) {
    this._push(_connect, [arg]);
    return this;
  }
  _I.prototype.disconnect = function(arg) {
    this._push(_disconnect, [arg]);
    return this;
  }

  function _closeMidiIn(obj) {
    if (this._impl._close) this._impl._close(this);
    this._break();
    obj._resume();
  }
  _I.prototype.close = function() {
    var ret = new _R();
    this._push(_closeMidiIn, [ret]);
    return ret;
  }

  var _jzz;
  var _engine = {};
  var _virtual = { _outs: [], _ins: []};

  // Node.js
  function _tryNODE() {
    if(typeof module !== 'undefined' && module.exports){
      _initNode(require('jazz-midi'));
      return;
    }
    this._break();
  }
  // Jazz-Plugin
  function _tryJazzPlugin() {
    var div = document.createElement('div'); 
    div.style.visibility='hidden';
    document.body.appendChild(div);
    var obj = document.createElement('object');
    obj.style.visibility='hidden';
    obj.style.width='0px'; obj.style.height='0px';
    obj.classid = 'CLSID:1ACE1618-1C7D-4561-AEE1-34842AA85E90';
    if(obj.isJazz){
      document.body.appendChild(obj);
      _initMSIE(obj);
      return;
    }
    obj.type = 'audio/x-jazz';
    document.body.appendChild(obj);
    if(obj.isJazz){
      _initNPAPI(obj);
      return;
    }
    this._break();
  }
  // Web MIDI API
  function _tryWebMIDI() {
    if(navigator.requestMIDIAccess) {
      var self = this;
      function onGood(midi) {
        _initWebMIDI(midi);
        self._resume();
      }
      function onBad(msg) {
        self._break(msg);
        self._resume();
      }
      var opt = {};
      if (this._options && this._options.sysex === true) opt.sysex = true;
      navigator.requestMIDIAccess(opt).then(onGood, onBad);
      this._pause();
      return;
    }
    this._break();
  }
  function _zeroBreak() {
    this._pause();
    var self = this;
    setTimeout(function(){ self._crash();}, 0);
  }

  function _initJZZ(opt) {
    _jzz = new _J();
    _jzz._options = opt;
    _jzz._push(_tryAny, [[_tryNODE, _zeroBreak, _tryJazzPlugin, _tryWebMIDI, _initNONE]]);
    _jzz.refresh();
    _jzz._push(_initTimer, []);
    _jzz._push(function(){if(!_engine._outs.length && !_engine._ins.length) this._break();}, []);
    _jzz._resume();
  }

  function _initNONE() {
    _engine._type = 'none';
    _engine._refresh = function() { _engine._outs = []; _engine._ins = [];}
  }
  // common initialization for Jazz-Plugin and jazz-midi
  function _initEngineJP() {
    _engine._pool = [];
    _engine._inArr = [];
    _engine._outArr = [];
    _engine._inMap = {};
    _engine._outMap = {};
    _engine._refresh = function() {
      _engine._outs = [];
      _engine._ins = [];
      var i, x;
      for( i=0; (x=_engine._main.MidiOutInfo(i)).length; i++) {
        _engine._outs.push({type: _engine._type, name: x[0], manufacturer: x[1], version: x[2]});
      }
      for (i=0; (x=_engine._main.MidiInInfo(i)).length; i++) {
        _engine._ins.push({type: _engine._type, name: x[0], manufacturer: x[1], version: x[2]});
      }
    }
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
            engine: _engine._type            
          },
          _close: function(port){ _engine._closeOut(port); },
          _send: function(a){ this.plugin.MidiOutRaw(a.slice()); }
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
    }
    _engine._openIn = function(port, name) {
      var impl = _engine._inMap[name];
      if (!impl) {
        if (_engine._pool.length <= _engine._inArr.length) _engine._pool.push(_engine._newPlugin());
        function makeHandle(x) { return function(t, a) { x.handle(t, a); }; };
        impl = {
          name: name,
          clients: [],
          info: {
            name: name,
            manufacturer: _engine._allIns[name].manufacturer,
            version: _engine._allIns[name].version,
            type: 'MIDI-in',
            engine: _engine._type            
          },
          _close: function(port){ _engine._closeIn(port); },
          handle: function(t, a) {
            for (var i in this.clients) {
              var msg = MIDI(a);
              this.clients[i]._event(msg);
            }
          }
        };
        var plugin = _engine._pool[_engine._inArr.length];
        impl.plugin = plugin;
        _engine._inArr.push(impl);
        _engine._inMap[name] = impl;
      }
      if (!impl.open) {
        var s = plugin.MidiInOpen(name, makeHandle(impl));
        if (s !== name) {
          if (s) plugin.MidiInClose();
          port._break(); return;
        }
        impl.open = true;
      }
      port._orig._impl = impl;
      _push(impl.clients, port._orig);
    }
    _engine._closeOut = function(port) {
      var impl = port._impl;
      _pop(impl.clients, port._orig);
      if (!impl.clients.length) {
        impl.open = false;
        impl.plugin.MidiOutClose();
      }
    }
    _engine._closeIn = function(port) {
      var impl = port._impl;
      _pop(impl.clients, port._orig);
      if (!impl.clients.length) {
        impl.open = false;
        impl.plugin.MidiInClose();
      }
    }
    _engine._close = function() {
      for (var i in _engine._inArr) if (_engine._inArr[i].open) _engine._inArr[i].plugin.MidiInClose();
    }
    _J.prototype._time = function() { return _engine._main.Time(); }
  }

  function _initNode(obj) {
    _engine._type = 'node';
    _engine._main = obj;
    _engine._pool = [];
    _engine._newPlugin = function(){ return new obj.MIDI();}
    _initEngineJP();
  }
  function _initMSIE(obj) {
    _engine._type = 'msie';
    _engine._main = obj;
    _engine._pool = [obj];
    _engine._newPlugin = function() {
      var plg = document.createElement('object');
      plg.style.visibility='hidden';
      plg.style.width='0px'; obj.style.height='0px';
      plg.classid = 'CLSID:1ACE1618-1C7D-4561-AEE1-34842AA85E90';
      document.body.appendChild(plg);
      return plg.isJazz ? plg : undefined;
    }
    _initEngineJP();
  }
  function _initNPAPI(obj) {
    _engine._type = 'npapi';
    _engine._main = obj;
    _engine._pool = [obj];
    _engine._newPlugin = function() {
      var plg = document.createElement('object');
      plg.style.visibility='hidden';
      plg.style.width='0px'; obj.style.height='0px';
      plg.type = 'audio/x-jazz';
      document.body.appendChild(plg);
      return plg.isJazz ? plg : undefined;
    }
    _initEngineJP();
  }
  function _initWebMIDI(access) {
    _engine._type = 'webmidi';
    _engine._access = access;
    _engine._inMap = {};
    _engine._outMap = {};
    _engine._refresh = function() {
      _engine._outs = [];
      _engine._ins = [];
      _engine._access.outputs.forEach(function(port, key) {
        _engine._outs.push({type: _engine._type, name: port.name, manufacturer: port.manufacturer, version: port.version});
      });
      _engine._access.inputs.forEach(function(port, key) {
        _engine._ins.push({type: _engine._type, name: port.name, manufacturer: port.manufacturer, version: port.version});
      });
    }
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
            engine: _engine._type            
          },
          _close: function(port){ _engine._closeOut(port); },
          _send: function(a){ this.dev.send(a.slice());}
        };
        var id, dev;
        _engine._access.outputs.forEach(function(dev, key) {
          if (dev.name === name) impl.dev = dev;
        });
        if (impl.dev) {
          _engine._outMap[name] = impl;
        }
        else impl = undefined;
      }
      if (impl) {
        port._orig._impl = impl;
        _push(impl.clients, port._orig);
      }
      else port._break();
    }
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
            engine: _engine._type            
          },
          _close: function(port){ _engine._closeIn(port); },
          handle: function(evt) {
            for (var i in this.clients) {
              var msg = MIDI([].slice.call(evt.data));
              this.clients[i]._event(msg);
            }
          }
        };
        var id, dev;
        _engine._access.inputs.forEach(function(dev, key) {
          if (dev.name === name) impl.dev = dev;
        });
        if (impl.dev) {
        function makeHandle(x) { return function(evt) { x.handle(evt); }; };
          impl.dev.onmidimessage = makeHandle(impl);
          _engine._inMap[name] = impl;
        }
        else impl = undefined;
      }
      if (impl) {
        port._orig._impl = impl;
        _push(impl.clients, port._orig);
      }
      else port._break();
    }
    _engine._closeOut = function(port) {
      var impl = port._impl;
      _pop(impl.clients, port._orig);
    }
    _engine._closeIn = function(port) {
      var impl = port._impl;
      _pop(impl.clients, port._orig);
    }
    _engine._close = function() {
    }
  }

  JZZ = function(opt) {
    if(!_jzz) _initJZZ(opt);
    return _jzz;
  }

  JZZ._openMidiOut = function(name, engine) {
    var port = new _O();
    engine._openOut(port, name);
    return port;
  }
  JZZ._openMidiIn = function(name, engine) {
    var port = new _I();
    engine._openIn(port, name);
    return port;
  }
  JZZ._registerMidiOut = function(name, engine) {
    var x = engine._info(name);
    x.engine = engine;
    _virtual._outs.push(x);
    return true;
  }
  JZZ._registerMidiIn = function(name, engine) {
    var x = engine._info(name);
    x.engine = engine;
    _virtual._ins.push(x);
    return true;
  }

  // JZZ.MIDI

  function MIDI(arg) {
    var self = this instanceof MIDI ? this : self = new MIDI();
    if (!arguments.length) return self;
    var arr = arg instanceof Array ? arg : arguments;
    for (var i = 0; i < arr.length; i++) {
      var n = arr[i];
      if (i==1 && self[0]>=0x80 && self[0]<=0xAF) n = MIDI.noteValue(n);
      if (n != parseInt(n) || n<0 || n>255) _throw(arr[i]);
      self.push(n);
    }
    return self;
  }
  MIDI.prototype = [];
  MIDI.prototype.constructor = MIDI;
  var _noteNum = {};
  MIDI.noteValue = function(x){ return _noteNum[x.toString().toLowerCase()];}

  var _noteMap = {c:0, d:2, e:4, f:5, g:7, a:9, b:11, h:11};
  for (var k in _noteMap) {
    for (var n=0; n<12; n++) {
      var m = _noteMap[k] + n*12;
      if (m > 127) break;
      _noteNum[k+n] = m;
      if (m > 0) { _noteNum[k+'b'+n] = m - 1; _noteNum[k+'bb'+n] = m - 2;}
      if (m < 127) { _noteNum[k+'#'+n] = m + 1; _noteNum[k+'##'+n] = m + 2;}
    }
  }
  for (var n=0; n<128; n++) _noteNum[n] = n;
  function _throw(x){ throw RangeError('Bad MIDI value: '+x);}
  function _ch(n) { if (n != parseInt(n) || n<0 || n>0xf) _throw(n); return n;}
  function _7b(n) { if (n != parseInt(n) || n<0 || n>0x7f) _throw(n); return n;}
  function _lsb(n){ if (n != parseInt(n) || n<0 || n>0x3fff) _throw(n); return n & 0x7f;}
  function _msb(n){ if (n != parseInt(n) || n<0 || n>0x3fff) _throw(n); return n >> 7;}
  var _helper = {
    noteOff : function(c, n){ return [0x80+_ch(c), _7b(MIDI.noteValue(n)), 0];},
    noteOn  : function(c, n, v){ return [0x90+_ch(c), _7b(MIDI.noteValue(n)), _7b(v)];},
    aftertouch : function(c, n, v){ return [0xA0+_ch(c), _7b(MIDI.noteValue(n)), _7b(v)];},
    control : function(c, n, v){ return [0xB0+_ch(c), _7b(n), _7b(v)];},
    program : function(c, n){ return [0xC0+_ch(c), _7b(n)];},
    pressure: function(c, n){ return [0xD0+_ch(c), _7b(n)];},
    pitchBend: function(c, n){ return [0xE0+_ch(c), _lsb(n), _msb(n)];},
    bankMSB : function(c, n){ return [0xB0+_ch(c), 0x00, _7b(n)];},
    bankLSB : function(c, n){ return [0xB0+_ch(c), 0x20, _7b(n)];},
    modMSB  : function(c, n){ return [0xB0+_ch(c), 0x01, _7b(n)];},
    modLSB  : function(c, n){ return [0xB0+_ch(c), 0x21, _7b(n)];},
    breathMSB : function(c, n){ return [0xB0+_ch(c), 0x02, _7b(n)];},
    breathLSB : function(c, n){ return [0xB0+_ch(c), 0x22, _7b(n)];},
    footMSB : function(c, n){ return [0xB0+_ch(c), 0x04, _7b(n)];},
    footLSB : function(c, n){ return [0xB0+_ch(c), 0x24, _7b(n)];},
    portamentoMSB : function(c, n){ return [0xB0+_ch(c), 0x05, _7b(n)];},
    portamentoLSB : function(c, n){ return [0xB0+_ch(c), 0x25, _7b(n)];},
    volumeMSB : function(c, n){ return [0xB0+_ch(c), 0x07, _7b(n)];},
    volumeLSB : function(c, n){ return [0xB0+_ch(c), 0x27, _7b(n)];},
    balanceMSB : function(c, n){ return [0xB0+_ch(c), 0x08, _7b(n)];},
    balanceLSB : function(c, n){ return [0xB0+_ch(c), 0x28, _7b(n)];},
    panMSB  : function(c, n){ return [0xB0+_ch(c), 0x0A, _7b(n)];},
    panLSB  : function(c, n){ return [0xB0+_ch(c), 0x2A, _7b(n)];},
    expressionMSB : function(c, n){ return [0xB0+_ch(c), 0x0B, _7b(n)];},
    expressionLSB : function(c, n){ return [0xB0+_ch(c), 0x2B, _7b(n)];},
    damper : function(c, b){ return [0xB0+_ch(c), 0x40, b ? 127 : 0];},
    portamento : function(c, b){ return [0xB0+_ch(c), 0x41, b ? 127 : 0];},
    sostenuto : function(c, b){ return [0xB0+_ch(c), 0x42, b ? 127 : 0];},
    soft   : function(c, b){ return [0xB0+_ch(c), 0x43, b ? 127 : 0];},
    allNotesOff : function(c){ return [0xB0+_ch(c), 0x7b, 0];}
  };
  function _copyHelper(name, func) {
    MIDI[name] = function(){ return new MIDI(func.apply(0, arguments));};
    _O.prototype[name] = function(){ this.send(func.apply(0, arguments)); return this;};
  }
  for (var k in _helper) {
    _copyHelper(k, _helper[k]);
  }

  function _hex(x){
    var a=[];
    for (var i=0; i<x.length; i++) {
      a[i] = (x[i]<16 ? '0' : '') + x[i].toString(16);
    }
    return a.join(' ');
  }
  MIDI.prototype.toString = function() {
    if (!this.length) return 'empty';
    var s = _hex(this);
    if (this[0]<0x80) return s;
    s += ' -- ';
    var ss = {
      241: 'Time Code',
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
      255: 'Reset'}[this[0]];
    if (ss) return s + ss;
    var c = this[0] >> 4;
    ss = {8: 'Note Off', 10: 'Aftertouch', 12: 'Program Change', 13: 'Channel Aftertouch', 14: 'Pitch Wheel'}[c];
    if (ss) return s + ss;
    if (c == 9) return s + (this[2] ? 'Note On' : 'Note Off');
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
      64: 'Damper Pedal On/Off',
      65: 'Portamento On/Off',
      66: 'Sostenuto On/Off',
      67: 'Soft Pedal On/Off',
      68: 'Legato Footswitch',
      69: 'Hold 2',
      70: 'Sound Controller 1',
      71: 'Sound Controller 2',
      72: 'Sound Controller 3',
      73: 'Sound Controller 4',
      74: 'Sound Controller 5',
      75: 'Sound Controller 6',
      76: 'Sound Controller 7',
      77: 'Sound Controller 8',
      78: 'Sound Controller 9',
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
      127: 'Poly Mode On'}[this[1]];
    if (!ss) ss = 'Undefined';
    return s + ss;
  }

  JZZ.MIDI = MIDI;

})();