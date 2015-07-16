(function() {

  // _R: common root for all async objects
  function _R() {
    this._orig = this;
    this._ready = false;
    this._queue = [];
  };
  _R.prototype._exec = function() {
    while (this._ready && this._queue.length) {
      var x = this._queue.shift();
      if (this._bad) {
        if (this._hope && x[0] == _or) {
          this._hope = false;
          x[0].apply(this, x[1]);
        }
        else {
          this._queue = [];
          this._hope = false;
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
  _R.prototype._break = function() { this._bad = true; this._hope = true;}
  _R.prototype._repair = function() { this._bad = false;}
  _R.prototype._info = function(){ return this.toString();}

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

  function _then(q) { if (q instanceof Function) q.apply(this); else console.log(q);}
  _R.prototype.then = function(func) { this._push(_then, [func]); return this;}
  _R.prototype.and = _R.prototype.then;
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
      this._break();
    }
  }


  // _J: JZZ object
  function _J() {
    _R.apply(this);
  }
  _J.prototype = new _R();

  function _postRefresh() {
    _engine._allOuts = {};
    _engine._allIns = {};
    var i, x;
    for (i=0; i<_engine._outs.length; i++) {
      x = _engine._outs[i];
      x.engine = _engine;
      _engine._allOuts[x.name] = x;
    }
    for (i=0; i<_engine._ins.length; i++) {
      x = _engine._ins[i];
      x.engine = _engine;
      _engine._allIns[x.name] = x;
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
        if (q[i] === n || q[i] === arr[n].name || q[i] === arr[n]) a.push(arr[n]);
      }
    }
    return a;
  }

  function _openMidiOut(out, arg) {
    var arr = _filterList(arg, _engine._outs);
    function pack(x){ return function(){x.engine._openOut(this, x.name);};};
    for (var i=0; i<arr.length; i++) arr[i] = pack(arr[i]);
    out._slip(_tryAny, [arr]);
    out._resume();
  }
  _J.prototype.openMidiOut = function(arg) {
    var ret = new _O();
    this._push(_refresh, []);
    this._push(_openMidiOut, [ret, arg]);
    return ret;
  }


  // _O: MIDI Out object
  function _O() {
    _R.apply(this);
  }
  _O.prototype = new _R();

  function _send(arg) {
    this._send(arg);
  }
  _O.prototype.send = function(arg) {
    this._push(_send, [arg]);
    return this;
  }


  var _jzz;
  var _engine = {};

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
    setTimeout(function(){ self._break(); self._resume();}, 0);
  }

  function _initJZZ(opt) {
    _jzz = new _J();
    _jzz._options = opt;
    _jzz._info = function() {return _engine._outs;};
    _jzz._push(_tryAny, [[_tryNODE, _zeroBreak, _tryJazzPlugin, _tryWebMIDI, _initNONE]]);
    _jzz.refresh();
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
//_engine._outs.push({type: _engine._type, name: 'dummy', manufacturer: 'none', version: '0.0'});
      for( i=0; (x=_engine._main.MidiOutInfo(i)).length; i++) {
        _engine._outs.push({type: _engine._type, name: x[0], manufacturer: x[1], version: x[2]});
      }
      for (i=0; (x=_engine._main.MidiInInfo(i)).length; i++) {
        _engine._ins.push({type: _engine._type, name: x[0], manufacturer: x[1], version: x[2]});
      }
    }
    _engine._openOut = function(out, name) {
      var plugin = _engine._outMap[name];
      if (!plugin) {
        if (_engine._pool.length <= _engine._outArr.length) _engine._pool.push(_engine._newPlugin());
        plugin = _engine._pool[_engine._outArr.length];
        var s = plugin.MidiOutOpen(name);
        if (s !== name) {
          plugin.MidiOutClose();
          out._break(); return;
        }
        _engine._outMap[name] = plugin;
      }
      out._impl = plugin;
      out._send = function(a){ this._impl.MidiOutRaw(a); }
    }
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
    _engine._openOut = function(out, name) {
      var id, dev;
      _engine._access.outputs.forEach(function(port, key) {
        if (port.name === name) {
          out._port = port;
        }
      });
      out._send = function(a){ this._port.send(a); }
      if (!out._port) out._break();
    }
  }

  JZZ = function(opt) {
    if(!_jzz) _initJZZ(opt);
    return _jzz;
  }

})();