!function(t,e){"object"==typeof exports&&"undefined"!=typeof module?module.exports=e():"function"==typeof define&&define.amd?define("JZZ",[],e):t.JZZ=e()}(this,function(){var t,e,n,i,o,r="0.4.4";function s(){this._orig=this,this._ready=!1,this._queue=[],this._err=[]}function u(t,e){setTimeout(function(){t._resume()},e)}function a(t){t._resume()}function c(t,e,n){t[n]=function(){var t=arguments,i=e._image();return this._push(a,[i]),i[n].apply(i,t)}}function h(t){t instanceof Function?t.apply(this):console.log(t)}function p(t){t instanceof Function?t.apply(this):console.log(t)}function f(t){this._break("closed"),t._resume()}function l(t){if(t.length){var e=t.shift();if(t.length){var n=this;this._slip(p,[function(){l.apply(n,[t])}])}try{this._repair(),e.apply(this)}catch(t){this._break(t.toString())}}else this._break()}function _(t,e){for(var n=0;n<t.length;n++)if(t[n]===e)return;t.push(e)}function d(t,e){for(var n=0;n<t.length;n++)if(t[n]===e)return void t.splice(n,1)}function m(){s.apply(this)}function g(){m.prototype._time||(m.prototype._time=function(){return Date.now()}),m.prototype._startTime=m.prototype._time(),m.prototype.time=function(){return m.prototype._time()-m.prototype._startTime}}function v(t,e,n){if(void 0===e)return v(t,[],[]);if(t instanceof Object){for(var i=0;i<e.length;i++)if(e[i]===t)return n[i];var o;o=t instanceof Array?[]:{},e.push(t),n.push(o);for(var r in t)t.hasOwnProperty(r)&&(o[r]=v(t[r],e,n));return o}return t}s.prototype._exec=function(){for(;this._ready&&this._queue.length;){var t=this._queue.shift();this._orig._bad?this._orig._hope&&t[0]==p?(this._orig._hope=!1,t[0].apply(this,t[1])):(this._queue=[],this._orig._hope=!1):t[0]!=p&&t[0].apply(this,t[1])}},s.prototype._push=function(t,e){this._queue.push([t,e]),s.prototype._exec.apply(this)},s.prototype._slip=function(t,e){this._queue.unshift([t,e])},s.prototype._pause=function(){this._ready=!1},s.prototype._resume=function(){this._ready=!0,s.prototype._exec.apply(this)},s.prototype._break=function(t){this._orig._bad=!0,this._orig._hope=!0,t&&this._orig._err.push(t)},s.prototype._repair=function(){this._orig._bad=!1},s.prototype._crash=function(t){this._break(t),this._resume()},s.prototype.err=function(){return v(this._err)},s.prototype._image=function(){var t=function(){};t.prototype=this._orig;var e=new t;return e._ready=!1,e._queue=[],e},s.prototype.wait=function(t){if(!t)return this;var e=this._image();return this._push(u,[e,t]),e},s.prototype.and=function(t){return this._push(h,[t]),this},s.prototype.or=function(t){return this._push(p,[t]),this},s.prototype._info={},s.prototype.info=function(){var t=v(this._orig._info);return void 0===t.engine&&(t.engine="none"),void 0===t.sysex&&(t.sysex=!0),t},s.prototype.name=function(){return this.info().name},s.prototype.close=function(){var t=new s;return this._close&&this._push(this._close,[]),this._push(f,[t]),t},m.prototype=new s,m.prototype.time=function(){return 0},"undefined"!=typeof performance&&performance.now&&(m.prototype._time=function(){return performance.now()}),m.prototype._info={name:"JZZ.js",ver:r,version:r};var y,M=[],S=[];function w(){var t,e;for(this._orig._info.engine=W._type,this._orig._info.version=W._version,this._orig._info.sysex=W._sysex,this._orig._info.inputs=[],this._orig._info.outputs=[],M=[],S=[],W._allOuts={},W._allIns={},t=0;t<W._outs.length;t++)(e=W._outs[t]).engine=W,W._allOuts[e.name]=e,this._orig._info.outputs.push({name:e.name,manufacturer:e.manufacturer,version:e.version,engine:W._type}),M.push(e);for(t=0;t<R._outs.length;t++)e=R._outs[t],this._orig._info.outputs.push({name:e.name,manufacturer:e.manufacturer,version:e.version,engine:e.type}),M.push(e);for(t=0;t<W._ins.length;t++)(e=W._ins[t]).engine=W,W._allIns[e.name]=e,this._orig._info.inputs.push({name:e.name,manufacturer:e.manufacturer,version:e.version,engine:W._type}),S.push(e);for(t=0;t<R._ins.length;t++)e=R._ins[t],this._orig._info.inputs.push({name:e.name,manufacturer:e.manufacturer,version:e.version,engine:e.type}),S.push(e)}function O(){this._slip(w,[]),W._refresh(this)}function C(t,e){if(void 0===t)return e.slice();var n,i,o=[];if(t instanceof RegExp){for(i=0;i<e.length;i++)t.test(e[i].name)&&o.push(e[i]);return o}for(t instanceof Function&&(t=t(e)),t instanceof Array||(t=[t]),n=0;n<t.length;n++)for(i=0;i<e.length;i++)(t[n]+""==i+""||t[n]===e[i].name||t[n]instanceof Object&&t[n].name===e[i].name)&&o.push(e[i]);return o}function I(t,e){var n;n=e instanceof RegExp?"Port matching "+e+" not found":e instanceof Object||void 0===e?"Port not found":'Port "'+e+'" not found',t._crash(n)}function E(t,e){var n=C(e,M);if(n.length){for(var i=function(t){return function(){t.engine._openOut(this,t.name)}},o=0;o<n.length;o++)n[o]=i(n[o]);t._slip(l,[n]),t._resume()}else I(t,e)}function b(t,e){var n=C(e,S);if(n.length){for(var i=function(t){return function(){t.engine._openIn(this,t.name)}},o=0;o<n.length;o++)n[o]=i(n[o]);t._slip(l,[n]),t._resume()}else I(t,e)}function B(t,e){t._slip(D,[e]),t._resume()}function A(){s.apply(this),this._handles=[],this._outs=[]}function x(t){this._receive(t)}function P(t){this._emit(t)}function L(t){t instanceof Function?_(this._orig._handles,t):_(this._orig._outs,t)}function q(t){void 0===t?(this._orig._handles=[],this._orig._outs=[]):t instanceof Function?d(this._orig._handles,t):d(this._orig._outs,t)}function F(t,e){A.apply(this),this._port=t._orig,this._chan=e,c(this,this._port,"ch"),c(this,this._port,"connect"),c(this,this._port,"disconnect"),c(this,this._port,"close")}function z(){s.apply(this),this._handles=[],c(this,y,"refresh"),c(this,y,"openMidiOut"),c(this,y,"openMidiIn"),c(this,y,"onChange"),c(this,y,"close")}function D(t){t instanceof Function&&(this._orig._handles.length||W._watch(),_(this._orig._handles,t))}function T(t){void 0===t?this._orig._handles=[]:d(this._orig._handles,t),this._orig._handles.length||W._unwatch()}function k(t,e,n,i){if(function(t,e,n,i){var o;if(t.length!=n.length||e.length!=i.length)return!0;for(o=0;o<t.length;o++)if(t[o].name!=n[o].name)return!0;for(o=0;o<e.length;o++)if(e[o].name!=i[o].name)return!0;return!1}(t,e,n,i)){var o,r=[],s=[],u=[],a=[],c={};for(o=0;o<t.length;o++)c[t[o].name]=!0;for(o=0;o<n.length;o++)c[n[o].name]||r.push(n[o]);for(c={},o=0;o<n.length;o++)c[n[o].name]=!0;for(o=0;o<t.length;o++)c[t[o].name]||u.push(t[o]);for(c={},o=0;o<e.length;o++)c[e[o].name]=!0;for(o=0;o<i.length;o++)c[i[o].name]||s.push(i[o]);for(c={},o=0;o<i.length;o++)c[i[o].name]=!0;for(o=0;o<e.length;o++)c[e[o].name]||a.push(e[o]);return r.length||u.length||s.length||a.length?{inputs:{added:r,removed:u},outputs:{added:s,removed:a}}:void 0}}function j(e){for(t=0;t<y._watcher._handles.length;t++)y._watcher._handles[t].apply(y,[e])}m.prototype.refresh=function(){return this._push(O,[]),this},m.prototype.openMidiOut=function(t){var e=new A;return this._push(O,[]),this._push(E,[e,t]),e},m.prototype.openMidiIn=function(t){var e=new A;return this._push(O,[]),this._push(b,[e,t]),e},m.prototype.onChange=function(t){this._orig._watcher||(this._orig._watcher=new z);var e=this._orig._watcher._image();return this._push(B,[e,t]),e},m.prototype._close=function(){W._close()},A.prototype=new s,A.prototype._receive=function(t){this._emit(t)},A.prototype.send=function(){return this._push(x,[it.apply(null,arguments)]),this},A.prototype.note=function(t,e,n,i){return this.noteOn(t,e,n),i&&this.wait(i).noteOff(t,e),this},A.prototype._emit=function(t){var e;for(e=0;e<this._handles.length;e++)this._handles[e].apply(this,[it(t)._stamp(this)]);for(e=0;e<this._outs.length;e++){var n=it(t);n._stamped(this._outs[e])||this._outs[e].send(n._stamp(this))}},A.prototype.emit=function(t){return this._push(P,[t]),this},A.prototype.connect=function(t){return this._push(L,[t]),this},A.prototype.disconnect=function(t){return this._push(q,[t]),this},A.prototype.ch=function(t){if(void 0===t)return this;if(t!=parseInt(t)||t<0||t>15)throw RangeError("Bad channel value: "+t+" (must be from 0 to 15)");var e=new F(this,t);return this._push(a,[e]),e},F.prototype=new A,F.prototype.channel=function(){return this._chan},F.prototype._receive=function(t){this._port._receive(t)},F.prototype.note=function(t,e,n){return this.noteOn(t,e),n&&this.wait(n).noteOff(t),this},z.prototype=new s,z.prototype.connect=function(t){return this._push(D,[t]),this},z.prototype.disconnect=function(t){return this._push(T,[t]),this};var W={},R={_outs:[],_ins:[]};function N(){if("undefined"!=typeof module&&module.exports)return t=require("jazz-midi"),W._type="node",W._main=t,W._pool=[],W._newPlugin=function(){return new t.MIDI},void K();var t;this._break()}function G(){var t=document.createElement("div");t.style.visibility="hidden",document.body.appendChild(t);var e,n=document.createElement("object");if(n.style.visibility="hidden",n.style.width="0px",n.style.height="0px",n.classid="CLSID:1ACE1618-1C7D-4561-AEE1-34842AA85E90",n.type="audio/x-jazz",document.body.appendChild(n),n.isJazz)return e=n,W._type="plugin",W._main=e,W._pool=[e],W._newPlugin=function(){var t=document.createElement("object");return t.style.visibility="hidden",t.style.width="0px",e.style.height="0px",t.classid="CLSID:1ACE1618-1C7D-4561-AEE1-34842AA85E90",t.type="audio/x-jazz",document.body.appendChild(t),t.isJazz?t:void 0},void K();this._break()}function V(){if(navigator.requestMIDIAccess){var t=this;return navigator.requestMIDIAccess({}).then(function(e){X(e),t._resume()},function(e){t._crash(e)}),void this._pause()}this._break()}function H(){if(navigator.requestMIDIAccess){var t=this;return navigator.requestMIDIAccess({sysex:!0}).then(function(e){X(e,!0),t._resume()},function(e){t._crash(e)}),void this._pause()}this._break()}function J(){var t,e,n=this;this._pause(),document.addEventListener("jazz-midi-msg",function i(o){if(t=!0,e||(e=document.getElementById("jazz-midi-msg")),e){var r,s,u,a=[];try{a=JSON.parse(e.innerText)}catch(t){}e.innerText="",document.removeEventListener("jazz-midi-msg",i),"version"===a[0]?(r=e,s=a[2],W._type="extension",W._version=s,W._sysex=!0,W._pool=[],W._outs=[],W._ins=[],W._inArr=[],W._outArr=[],W._inMap={},W._outMap={},W._outsW=[],W._insW=[],W.refreshClients=[],W._msg=r,W._newPlugin=function(){var t={id:W._pool.length};t.id?document.dispatchEvent(new CustomEvent("jazz-midi",{detail:["new"]})):t.ready=!0,W._pool.push(t)},W._newPlugin(),W._refresh=function(t){W.refreshClients.push(t),t._pause(),setTimeout(function(){document.dispatchEvent(new CustomEvent("jazz-midi",{detail:["refresh"]}))},0)},_closeAll=function(){for(var t=0;t<this.clients.length;t++)this._close(this.clients[t])},W._openOut=function(t,e){var n=W._outMap[e];if(!n){W._pool.length<=W._outArr.length&&W._newPlugin();var i=W._pool[W._outArr.length];(n={name:e,clients:[],info:{name:e,manufacturer:W._allOuts[e].manufacturer,version:W._allOuts[e].version,type:"MIDI-out",sysex:W._sysex,engine:W._type},_start:function(){document.dispatchEvent(new CustomEvent("jazz-midi",{detail:["openout",i.id,e]}))},_close:function(t){W._closeOut(t)},_closeAll:_closeAll,_receive:function(t){var e=t.slice();e.splice(0,0,"play",i.id),document.dispatchEvent(new CustomEvent("jazz-midi",{detail:e}))}}).plugin=i,i.output=n,W._outArr.push(n),W._outMap[e]=n}t._orig._impl=n,_(n.clients,t._orig),t._info=n.info,t._receive=function(t){n._receive(t)},t._close=function(){n._close(this)},n.open||(n.plugin.ready&&n._start(),t._pause())},W._openIn=function(t,e){var n=W._inMap[e];if(!n){W._pool.length<=W._inArr.length&&W._newPlugin();var i=W._pool[W._inArr.length];(n={name:e,clients:[],info:{name:e,manufacturer:W._allIns[e].manufacturer,version:W._allIns[e].version,type:"MIDI-in",sysex:W._sysex,engine:W._type},_start:function(){document.dispatchEvent(new CustomEvent("jazz-midi",{detail:["openin",i.id,e]}))},_close:function(t){W._closeIn(t)},_closeAll:_closeAll}).plugin=i,i.input=n,W._inArr.push(n),W._inMap[e]=n}t._orig._impl=n,_(n.clients,t._orig),t._info=n.info,t._close=function(){n._close(this)},n.open||(n.plugin.ready&&n._start(),t._pause())},W._closeOut=function(t){var e=t._impl;d(e.clients,t._orig),e.clients.length||(e.open=!1,document.dispatchEvent(new CustomEvent("jazz-midi",{detail:["closeout",e.plugin.id]})))},W._closeIn=function(t){var e=t._impl;d(e.clients,t._orig),e.clients.length||(e.open=!1,document.dispatchEvent(new CustomEvent("jazz-midi",{detail:["closein",e.plugin.id]})))},W._close=function(){},W._watch=function(){W._insW=W._ins,W._outsW=W._outs,u=setInterval(function(){document.dispatchEvent(new CustomEvent("jazz-midi",{detail:["refresh"]}))},250)},W._unwatch=function(){clearInterval(u),u=void 0},document.addEventListener("jazz-midi-msg",function(t){var e,n,i,o=W._msg.innerText.split("\n");for(W._msg.innerText="",n=0;n<o.length;n++){var r=[];try{r=JSON.parse(o[n])}catch(t){}if(r.length)if("refresh"===r[0]){if(r[1].ins){for(i=0;i<r[1].ins.length;i++)r[1].ins[i].type=W._type;W._ins=r[1].ins}if(r[1].outs){for(i=0;i<r[1].outs.length;i++)r[1].outs[i].type=W._type;W._outs=r[1].outs}for(i=0;i<W.refreshClients.length;i++)W.refreshClients[i]._resume();W.refreshClients=[];var s=k(W._insW,W._outsW,W._ins,W._outs);if(s){for(W._insW=W._ins,W._outsW=W._outs,i=0;i<s.inputs.removed.length;i++)(e=W._inMap[s.inputs.removed[i].name])&&e._closeAll();for(i=0;i<s.outputs.removed.length;i++)(e=W._outMap[s.outputs.removed[i].name])&&e._closeAll();u&&j(s)}}else if("version"===r[0]){var a=W._pool[r[1]];a&&(a.ready=!0,a.input&&a.input._start(),a.output&&a.output._start())}else if("openout"===r[0]){if(e=W._pool[r[1]].output)if(r[2]==e.name){if(e.open=!0,e.clients)for(i=0;i<e.clients.length;i++)e.clients[i]._resume()}else if(e.clients)for(i=0;i<e.clients.length;i++)e.clients[i]._crash()}else if("openin"===r[0]){if(e=W._pool[r[1]].input)if(r[2]==e.name){if(e.open=!0,e.clients)for(i=0;i<e.clients.length;i++)e.clients[i]._resume()}else if(e.clients)for(i=0;i<e.clients.length;i++)e.clients[i]._crash()}else if("midi"===r[0]&&(e=W._pool[r[1]].input)&&e.clients)for(i=0;i<e.clients.length;i++){var c=it(r.slice(3));e.clients[i]._emit(c)}}}),n._resume()):n._crash()}});try{document.dispatchEvent(new Event("jazz-midi"))}catch(t){}window.setTimeout(function(){t||n._crash()},0)}function Q(){this._pause();var t=this;setTimeout(function(){t._crash()},0)}function Z(t){for(var e=[N,Q],n=function(t){var e=["extension","plugin","webmidi"];if(!t||!t.engine)return e;for(var n,i,o=t.engine instanceof Array?t.engine:[t.engine],r={},s=[],u=[],a=0;a<o.length;a++){var c=o[a].toString().toLowerCase();r[c]||(r[c]=!0,"none"===c&&(n=!0),"etc"===c&&(i=!0),i?u.push(c):s.push(c),d(e,c))}(i||s.length||u.length)&&(n=!1);return n?[]:s.concat(i?e:u)}(t),i=0;i<n.length;i++)"webmidi"==n[i]?(t&&!0===t.sysex&&e.push(H),t&&!0===t.sysex&&!0!==t.degrade||e.push(V)):"extension"==n[i]?e.push(J):"plugin"==n[i]&&e.push(G);return e.push(U),e}function U(){W._type="none",W._sysex=!0,W._refresh=function(){W._outs=[],W._ins=[]},W._watch=function(){},W._unwatch=function(){}}function K(){var t;function n(){t&&(W._refresh(),t=!1)}function i(e){t=!0,setTimeout(n,0)}W._inArr=[],W._outArr=[],W._inMap={},W._outMap={},W._outsW=[],W._insW=[],W._version=W._main.version,W._sysex=!0,_closeAll=function(){for(var t=0;t<this.clients.length;t++)this._close(this.clients[t])},W._refresh=function(){var n,i;for(W._outs=[],W._ins=[],n=0;(i=W._main.MidiOutInfo(n)).length;n++)W._outs.push({type:W._type,name:i[0],manufacturer:i[1],version:i[2]});for(n=0;(i=W._main.MidiInInfo(n)).length;n++)W._ins.push({type:W._type,name:i[0],manufacturer:i[1],version:i[2]});var o=k(W._insW,W._outsW,W._ins,W._outs);if(o){for(e=0;e<o.inputs.removed.length;e++)impl=W._inMap[o.inputs.removed[e].name],impl&&impl._closeAll();for(e=0;e<o.outputs.removed.length;e++)impl=W._outMap[o.inputs.removed[e].name],impl&&impl._closeAll();W._insW=W._ins,W._outsW=W._outs,t&&j(o)}},W._openOut=function(t,e){var n=W._outMap[e];if(!n){W._pool.length<=W._outArr.length&&W._pool.push(W._newPlugin()),n={name:e,clients:[],info:{name:e,manufacturer:W._allOuts[e].manufacturer,version:W._allOuts[e].version,type:"MIDI-out",sysex:W._sysex,engine:W._type},_close:function(t){W._closeOut(t)},_closeAll:_closeAll,_receive:function(t){this.plugin.MidiOutRaw(t.slice())}};var i=W._pool[W._outArr.length];n.plugin=i,W._outArr.push(n),W._outMap[e]=n}if(!n.open){var o=n.plugin.MidiOutOpen(e);if(o!==e)return o&&n.plugin.MidiOutClose(),void t._break();n.open=!0}t._orig._impl=n,_(n.clients,t._orig),t._info=n.info,t._receive=function(t){n._receive(t)},t._close=function(){n._close(this)}},W._openIn=function(t,e){var n,i=W._inMap[e];if(!i){W._pool.length<=W._inArr.length&&W._pool.push(W._newPlugin());(i={name:e,clients:[],info:{name:e,manufacturer:W._allIns[e].manufacturer,version:W._allIns[e].version,type:"MIDI-in",sysex:W._sysex,engine:W._type},_close:function(t){W._closeIn(t)},_closeAll:_closeAll,handle:function(t,e){for(var n=0;n<this.clients.length;n++){var i=it(e);this.clients[n]._emit(i)}}}).onmidi=(n=i,function(t,e){n.handle(t,e)});var o=W._pool[W._inArr.length];i.plugin=o,W._inArr.push(i),W._inMap[e]=i}if(!i.open){var r=i.plugin.MidiInOpen(e,i.onmidi);if(r!==e)return r&&i.plugin.MidiInClose(),void t._break();i.open=!0}t._orig._impl=i,_(i.clients,t._orig),t._info=i.info,t._close=function(){i._close(this)}},W._closeOut=function(t){var e=t._impl;d(e.clients,t._orig),e.clients.length||(e.open=!1,e.plugin.MidiOutClose())},W._closeIn=function(t){var e=t._impl;d(e.clients,t._orig),e.clients.length||(e.open=!1,e.plugin.MidiInClose())},W._close=function(){for(var t=0;t<W._inArr.length;t++)W._inArr[t].open&&W._inArr[t].plugin.MidiInClose();W.unwatch()},W._watch=function(){W._main.OnConnectMidiIn(i),W._main.OnConnectMidiOut(i),W._main.OnDisconnectMidiIn(i),W._main.OnDisconnectMidiOut(i)},W._unwatch=function(){W._main.OnConnectMidiIn(),W._main.OnConnectMidiOut(),W._main.OnDisconnectMidiIn(),W._main.OnDisconnectMidiOut()},m.prototype._time=function(){return W._main.Time()}}function X(t,n){var i;W._type="webmidi",W._version=43,W._sysex=!!n,W._access=t,W._inMap={},W._outMap={},W._outsW=[],W._insW=[],_closeAll=function(){for(var t=0;t<this.clients.length;t++)this._close(this.clients[t])},W._refresh=function(){W._outs=[],W._ins=[],W._access.outputs.forEach(function(t,e){W._outs.push({type:W._type,name:t.name,manufacturer:t.manufacturer,version:t.version})}),W._access.inputs.forEach(function(t,e){W._ins.push({type:W._type,name:t.name,manufacturer:t.manufacturer,version:t.version})});var t=k(W._insW,W._outsW,W._ins,W._outs);if(t){for(e=0;e<t.inputs.removed.length;e++)impl=W._inMap[t.inputs.removed[e].name],impl&&impl._closeAll();for(e=0;e<t.outputs.removed.length;e++)impl=W._outMap[t.inputs.removed[e].name],impl&&impl._closeAll();W._insW=W._ins,W._outsW=W._outs,i&&j(t)}},W._openOut=function(t,e){var n,i=W._outMap[e];i||(i={name:e,clients:[],info:{name:e,manufacturer:W._allOuts[e].manufacturer,version:W._allOuts[e].version,type:"MIDI-out",sysex:W._sysex,engine:W._type},_close:function(t){W._closeOut(t)},_closeAll:_closeAll,_receive:function(t){i.dev&&this.dev.send(t.slice())}}),W._access.outputs.forEach(function(t,i){t.name===e&&(n=t)}),n?(i.dev=n,W._outMap[e]=i,i.dev.open&&i.dev.open(),t._orig._impl=i,_(i.clients,t._orig),t._info=i.info,t._receive=function(t){i._receive(t)},t._close=function(){i._close(this)}):t._break()},W._openIn=function(t,e){var n,i,o=W._inMap[e];if(o||(o={name:e,clients:[],info:{name:e,manufacturer:W._allIns[e].manufacturer,version:W._allIns[e].version,type:"MIDI-in",sysex:W._sysex,engine:W._type},_close:function(t){W._closeIn(t)},_closeAll:_closeAll,handle:function(t){for(var e=0;e<this.clients.length;e++){var n=it([].slice.call(t.data));this.clients[e]._emit(n)}}}),W._access.inputs.forEach(function(t,i){t.name===e&&(n=t)}),n){o.dev=n;o.dev.onmidimessage=(i=o,function(t){i.handle(t)}),W._inMap[e]=o,o.dev.open&&o.dev.open(),t._orig._impl=o,_(o.clients,t._orig),t._info=o.info,t._close=function(){o._close(this)}}else t._break()},W._closeOut=function(t){var e=t._impl;d(e.clients,t._orig),e.clients.length||(e.dev&&e.dev.close&&e.dev.close(),e.dev=void 0)},W._closeIn=function(t){var e=t._impl;d(e.clients,t._orig),e.clients.length||(e.dev&&e.dev.close&&e.dev.close(),e.dev=void 0)},W._close=function(){},W._watch=function(){W._access.onstatechange=function(){i=!0,setTimeout(function(){i&&(W._refresh(),i=!1)},0)}},W._unwatch=function(){W._access.onstatechange=void 0}}var Y=function(t){var e;return y||(e=t,(y=new m)._options=e,y._push(l,[Z(e)]),y.refresh(),y._push(g,[]),y._push(function(){M.length||S.length||this._break()},[]),y._resume()),y};function $(){var t=this instanceof $?this:t=new $;return $.prototype.reset.apply(t,arguments),t}function tt(){29.97==this.type&&!this.second&&this.frame<2&&this.minute%10&&(this.frame=2)}function et(t){return[[24,25,29.97,30][t[7]>>1&3],(1&t[7])<<4|t[6],t[5]<<4|t[4],t[3]<<4|t[2],t[1]<<4|t[0]]}function nt(t){return t<10?"0"+t:t}function it(e){var n=this instanceof it?this:n=new it;if(n._from=e instanceof it?e._from.slice():[],!arguments.length)return n;var i=e instanceof Array?e:arguments;for(t=0;t<i.length;t++)o=i[t],1==t&&(n[0]>=128&&n[0]<=175&&(o=it.noteValue(o)),n[0]>=192&&n[0]<=207&&(o=it.programValue(o))),(o!=parseInt(o)||o<0||o>255)&&st(i[t]),n.push(o);return n}Y.info=function(){return m.prototype.info()},Y.Widget=function(t){var e=new A;if(t instanceof Object)for(var n in t)t.hasOwnProperty(n)&&(e[n]=t[n]);return e._resume(),e},m.prototype.Widget=Y.Widget,$.prototype.reset=function(t){if(t instanceof $)return this.setType(t.getType()),this.setHour(t.getHour()),this.setMinute(t.getMinute()),this.setSecond(t.getSecond()),this.setFrame(t.getFrame()),this.setQuarter(t.getQuarter()),this;var e=t instanceof Array?t:arguments;return this.setType(e[0]),this.setHour(e[1]),this.setMinute(e[2]),this.setSecond(e[3]),this.setFrame(e[4]),this.setQuarter(e[5]),this},$.prototype.isFullFrame=function(){return 0==this.quarter||4==this.quarter},$.prototype.getType=function(){return this.type},$.prototype.getHour=function(){return this.hour},$.prototype.getMinute=function(){return this.minute},$.prototype.getSecond=function(){return this.second},$.prototype.getFrame=function(){return this.frame},$.prototype.getQuarter=function(){return this.quarter},$.prototype.setType=function(t){if(void 0===t||24==t)this.type=24;else if(25==t)this.type=25;else if(29.97==t)this.type=29.97,tt.apply(this);else{if(30!=t)throw RangeError("Bad SMPTE frame rate: "+t);this.type=30}return this.frame>=this.type&&(this.frame=29.97==this.type?29:this.type-1),this},$.prototype.setHour=function(t){if(void 0===t&&(t=0),t!=parseInt(t)||t<0||t>=24)throw RangeError("Bad SMPTE hours value: "+t);return this.hour=t,this},$.prototype.setMinute=function(t){if(void 0===t&&(t=0),t!=parseInt(t)||t<0||t>=60)throw RangeError("Bad SMPTE minutes value: "+t);return this.minute=t,tt.apply(this),this},$.prototype.setSecond=function(t){if(void 0===t&&(t=0),t!=parseInt(t)||t<0||t>=60)throw RangeError("Bad SMPTE seconds value: "+t);return this.second=t,tt.apply(this),this},$.prototype.setFrame=function(t){if(void 0===t&&(t=0),t!=parseInt(t)||t<0||t>=this.type)throw RangeError("Bad SMPTE frame number: "+t);return this.frame=t,tt.apply(this),this},$.prototype.setQuarter=function(t){if(void 0===t&&(t=0),t!=parseInt(t)||t<0||t>=8)throw RangeError("Bad SMPTE quarter frame: "+t);return this.quarter=t,this},$.prototype.incrFrame=function(){return this.frame++,this.frame>=this.type&&(this.frame=0,this.second++,this.second>=60&&(this.second=0,this.minute++,this.minute>=60&&(this.minute=0,this.hour=this.hour>=23?0:this.hour+1))),tt.apply(this),this},$.prototype.decrFrame=function(){return!this.second&&2==this.frame&&29.97==this.type&&this.minute%10&&(this.frame=0),this.frame--,this.frame<0&&(this.frame=29.97==this.type?29:this.type-1,this.second--,this.second<0&&(this.second=59,this.minute--,this.minute<0&&(this.minute=59,this.hour=this.hour?this.hour-1:23))),this},$.prototype.incrQF=function(){return this.backwards=!1,this.quarter=this.quarter+1&7,0!=this.quarter&&4!=this.quarter||this.incrFrame(),this},$.prototype.decrQF=function(){return this.backwards=!0,this.quarter=this.quarter+7&7,3!=this.quarter&&7!=this.quarter||this.decrFrame(),this},$.prototype.read=function(t){if(t instanceof it||(t=it.apply(null,arguments)),240==t[0]&&127==t[1]&&1==t[3]&&1==t[4]&&247==t[9])return this.type=[24,25,29.97,30][t[5]>>5&3],this.hour=31&t[5],this.minute=t[6],this.second=t[7],this.frame=t[8],this.quarter=0,this._=void 0,this._b=void 0,this._f=void 0,!0;if(241==t[0]&&void 0!==t[1]){var e=t[1]>>4,n=15&t[1];return 0==e?7==this._&&(7==this._f&&(this.reset(et(this._a)),this.incrFrame()),this.incrFrame()):3==e?4==this._&&this.decrFrame():4==e?3==this._&&this.incrFrame():7==e&&0===this._&&(0===this._b&&(this.reset(et(this._a)),this.decrFrame()),this.decrFrame()),this._a||(this._a=[]),this._a[e]=n,this._f=this._f===e-1||0==e?e:void 0,this._b=this._b===e+1||7==e?e:void 0,this._=e,this.quarter=e,!0}return!1},$.prototype.toString=function(){return[nt(this.hour),nt(this.minute),nt(this.second),nt(this.frame)].join(":")},Y.SMPTE=$,it.prototype=[],it.prototype.constructor=it;var ot={};it.noteValue=function(t){return ot[t.toString().toLowerCase()]},it.programValue=function(t){return t};var rt={c:0,d:2,e:4,f:5,g:7,a:9,b:11,h:11};for(n in rt)if(rt.hasOwnProperty(n))for(o=0;o<12&&!((i=rt[n]+12*o)>127);o++)ot[n+o]=i,i>0&&(ot[n+"b"+o]=i-1,ot[n+"bb"+o]=i-2),i<127&&(ot[n+"#"+o]=i+1,ot[n+"##"+o]=i+2);for(o=0;o<128;o++)ot[o]=o;function st(t){throw RangeError("Bad MIDI value: "+t)}function ut(t){return(t!=parseInt(t)||t<0||t>15)&&st(t),t}function at(t){return(t!=parseInt(t)||t<0||t>127)&&st(t),t}function ct(t){return(t!=parseInt(t)||t<0||t>16383)&&st(t),127&t}function ht(t){return(t!=parseInt(t)||t<0||t>16383)&&st(t),t>>7}var pt={noteOff:function(t,e,n){return void 0===n&&(n=64),[128+ut(t),at(it.noteValue(e)),at(n)]},noteOn:function(t,e,n){return void 0===n&&(n=127),[144+ut(t),at(it.noteValue(e)),at(n)]},aftertouch:function(t,e,n){return[160+ut(t),at(it.noteValue(e)),at(n)]},control:function(t,e,n){return[176+ut(t),at(e),at(n)]},program:function(t,e){return[192+ut(t),at(it.programValue(e))]},pressure:function(t,e){return[208+ut(t),at(e)]},pitchBend:function(t,e){return[224+ut(t),ct(e),ht(e)]},bankMSB:function(t,e){return[176+ut(t),0,at(e)]},bankLSB:function(t,e){return[176+ut(t),32,at(e)]},modMSB:function(t,e){return[176+ut(t),1,at(e)]},modLSB:function(t,e){return[176+ut(t),33,at(e)]},breathMSB:function(t,e){return[176+ut(t),2,at(e)]},breathLSB:function(t,e){return[176+ut(t),34,at(e)]},footMSB:function(t,e){return[176+ut(t),4,at(e)]},footLSB:function(t,e){return[176+ut(t),36,at(e)]},portamentoMSB:function(t,e){return[176+ut(t),5,at(e)]},portamentoLSB:function(t,e){return[176+ut(t),37,at(e)]},volumeMSB:function(t,e){return[176+ut(t),7,at(e)]},volumeLSB:function(t,e){return[176+ut(t),39,at(e)]},balanceMSB:function(t,e){return[176+ut(t),8,at(e)]},balanceLSB:function(t,e){return[176+ut(t),40,at(e)]},panMSB:function(t,e){return[176+ut(t),10,at(e)]},panLSB:function(t,e){return[176+ut(t),42,at(e)]},expressionMSB:function(t,e){return[176+ut(t),11,at(e)]},expressionLSB:function(t,e){return[176+ut(t),43,at(e)]},damper:function(t,e){return[176+ut(t),64,e?127:0]},portamento:function(t,e){return[176+ut(t),65,e?127:0]},sostenuto:function(t,e){return[176+ut(t),66,e?127:0]},soft:function(t,e){return[176+ut(t),67,e?127:0]},allSoundOff:function(t){return[176+ut(t),120,0]},allNotesOff:function(t){return[176+ut(t),123,0]}},ft={mtc:function(t){return[241,function(t){var e;switch(!t.backwards&&t.quarter>=4?t.decrFrame():t.backwards&&t.quarter<4&&t.incrFrame(),t.quarter>>1){case 0:e=t.frame;break;case 1:e=t.second;break;case 2:e=t.minute;break;default:e=t.hour}return 1&t.quarter?e>>=4:e&=15,7==t.quarter&&(25==t.type?e|=2:29.97==t.type?e|=4:30==t.type&&(e|=6)),!t.backwards&&t.quarter>=4?t.incrFrame():t.backwards&&t.quarter<4&&t.decrFrame(),e|t.quarter<<4}(t)]},songPosition:function(t){return[242,ct(t),ht(t)]},songSelect:function(t){return[243,at(t)]},tune:function(){return[246]},clock:function(){return[248]},start:function(){return[250]},continue:function(){return[251]},stop:function(){return[252]},active:function(){return[254]},sxIdRequest:function(){return[240,126,127,6,1,247]},sxFullFrame:function(t){return[240,127,127,1,1,(e=t,25==e.type?32|e.hour:29.97==e.type?64|e.hour:30==e.type?96|e.hour:e.hour),t.getMinute(),t.getSecond(),t.getFrame(),247];var e},reset:function(){return[255]}};function lt(t,e){var n,i;i=e,it[n=t]=function(){return new it(i.apply(0,arguments))},A.prototype[n]=function(){return this.send(i.apply(0,arguments)),this},F.prototype[t]=function(){return this.send(e.apply(0,[this._chan].concat(Array.prototype.slice.call(arguments)))),this}}for(n in ft)ft.hasOwnProperty(n)&&lt(n,ft[n]);for(n in pt)pt.hasOwnProperty(n)&&lt(n,pt[n]);var _t,dt={a:10,b:11,c:12,d:13,e:14,f:15,A:10,B:11,C:12,D:13,E:14,F:15};for(n=0;n<16;n++)dt[n]=n;if(it.prototype.getChannel=function(){var t=this[0];if(!(void 0===t||t<128||t>239))return 15&t},it.prototype.setChannel=function(t){var e=this[0];return void 0===e||e<128||e>239?this:(void 0!==(t=dt[t])&&(this[0]=240&e|t),this)},it.prototype.getNote=function(){var t=this[0];if(!(void 0===t||t<128||t>175))return this[1]},it.prototype.setNote=function(t){var e=this[0];return void 0===e||e<128||e>175?this:(void 0!==(t=it.noteValue(t))&&(this[1]=t),this)},it.prototype.getVelocity=function(){var t=this[0];if(!(void 0===t||t<144||t>159))return this[2]},it.prototype.setVelocity=function(t){var e=this[0];return void 0===e||e<144||e>159?this:((t=parseInt(t))>=0&&t<128&&(this[2]=t),this)},it.prototype.getSysExChannel=function(){if(240==this[0])return this[2]},it.prototype.setSysExChannel=function(t){return 240==this[0]&&this.length>2&&(t=parseInt(t))>=0&&t<128&&(this[2]=t),this},it.prototype.isNoteOn=function(){var t=this[0];return!(void 0===t||t<144||t>159)&&this[2]>0},it.prototype.isNoteOff=function(){var t=this[0];return!(void 0===t||t<128||t>159)&&(t<144||0==this[2])},it.prototype.isSysEx=function(){return 240==this[0]},it.prototype.isFullSysEx=function(){return 240==this[0]&&247==this[this.length-1]},it.prototype.toString=function(){if(!this.length)return"empty";var t=function(t){for(var e=[],n=0;n<t.length;n++)e[n]=(t[n]<16?"0":"")+t[n].toString(16);return e.join(" ")}(this);if(this[0]<128)return t;var e={241:"MIDI Time Code",242:"Song Position",243:"Song Select",244:"Undefined",245:"Undefined",246:"Tune request",248:"Timing clock",249:"Undefined",250:"Start",251:"Continue",252:"Stop",253:"Undefined",254:"Active Sensing",255:"Reset"}[this[0]];if(e)return t+" -- "+e;var n=this[0]>>4;return(e={8:"Note Off",10:"Aftertouch",12:"Program Change",13:"Channel Aftertouch",14:"Pitch Wheel"}[n])?t+" -- "+e:9==n?t+" -- "+(this[2]?"Note On":"Note Off"):11!=n?t:((e={0:"Bank Select MSB",1:"Modulation Wheel MSB",2:"Breath Controller MSB",4:"Foot Controller MSB",5:"Portamento Time MSB",6:"Data Entry MSB",7:"Channel Volume MSB",8:"Balance MSB",10:"Pan MSB",11:"Expression Controller MSB",12:"Effect Control 1 MSB",13:"Effect Control 2 MSB",16:"General Purpose Controller 1 MSB",17:"General Purpose Controller 2 MSB",18:"General Purpose Controller 3 MSB",19:"General Purpose Controller 4 MSB",32:"Bank Select LSB",33:"Modulation Wheel LSB",34:"Breath Controller LSB",36:"Foot Controller LSB",37:"Portamento Time LSB",38:"Data Entry LSB",39:"Channel Volume LSB",40:"Balance LSB",42:"Pan LSB",43:"Expression Controller LSB",44:"Effect control 1 LSB",45:"Effect control 2 LSB",48:"General Purpose Controller 1 LSB",49:"General Purpose Controller 2 LSB",50:"General Purpose Controller 3 LSB",51:"General Purpose Controller 4 LSB",64:"Damper Pedal On/Off",65:"Portamento On/Off",66:"Sostenuto On/Off",67:"Soft Pedal On/Off",68:"Legato Footswitch",69:"Hold 2",70:"Sound Controller 1",71:"Sound Controller 2",72:"Sound Controller 3",73:"Sound Controller 4",74:"Sound Controller 5",75:"Sound Controller 6",76:"Sound Controller 7",77:"Sound Controller 8",78:"Sound Controller 9",79:"Sound Controller 10",80:"General Purpose Controller 5",81:"General Purpose Controller 6",82:"General Purpose Controller 7",83:"General Purpose Controller 8",84:"Portamento Control",88:"High Resolution Velocity Prefix",91:"Effects 1 Depth",92:"Effects 2 Depth",93:"Effects 3 Depth",94:"Effects 4 Depth",95:"Effects 5 Depth",96:"Data Increment",97:"Data Decrement",98:"Non-Registered Parameter Number LSB",99:"Non-Registered Parameter Number MSB",100:"Registered Parameter Number LSB",101:"Registered Parameter Number MSB",120:"All Sound Off",121:"Reset All Controllers",122:"Local Control On/Off",123:"All Notes Off",124:"Omni Mode Off",125:"Omni Mode On",126:"Mono Mode On",127:"Poly Mode On"}[this[1]])||(e="Undefined"),t+" -- "+e)},it.prototype._stamp=function(t){return this._from.push(t._orig?t._orig:t),this},it.prototype._unstamp=function(t){if(void 0===t)this._from=[];else{t._orig&&(t=t._orig);var e=this._from.indexOf(t);e>-1&&this._from.splice(e,1)}return this},it.prototype._stamped=function(t){t._orig&&(t=t._orig);for(var e=0;e<this._from.length;e++)if(this._from[e]==t)return!0;return!1},Y.MIDI=it,(Y.lib={}).openMidiOut=function(t,e){var n=new A;return e._openOut(n,t),n},Y.lib.openMidiIn=function(t,e){var n=new A;return e._openIn(n,t),n},Y.lib.registerMidiOut=function(t,e){for(var n=e._info(t),i=0;i<R._outs.length;i++)if(R._outs[i].name==n.name)return!1;return n.engine=e,R._outs.push(n),y&&y._bad&&(y._repair(),y._resume()),!0},Y.lib.registerMidiIn=function(t,e){for(var n=e._info(t),i=0;i<R._ins.length;i++)if(R._ins[i].name==n.name)return!1;return n.engine=e,R._ins.push(n),y&&y._bad&&(y._repair(),y._resume()),!0},Y.lib.getAudioContext=function(){return _t},"undefined"!=typeof window){var mt=window.AudioContext||window.webkitAudioContext;if(mt){(_t=new mt)&&!_t.createGain&&(_t.createGain=_t.createGainNode);var gt=function(){if("running"!=_t.state){_t.resume();var t=_t.createOscillator(),e=_t.createGain();try{e.gain.value=0}catch(t){}e.gain.setTargetAtTime(0,_t.currentTime,.01),t.connect(e),e.connect(_t.destination),t.start||(t.start=t.noteOn),t.stop||(t.stop=t.noteOff),t.start(.1),t.stop(.11)}else document.removeEventListener("touchend",gt),document.removeEventListener("mousedown",gt),document.removeEventListener("keydown",gt)};document.addEventListener("touchend",gt),document.addEventListener("mousedown",gt),document.addEventListener("keydown",gt),gt()}}return Y});