import 'webmidi';

declare namespace JZZ {
  namespace SMPTE {
    interface Constructor {
      /** Create new SMPTE object */
      new (...args: any[]): SMPTE;
      /** Create new SMPTE object */
      (...args: any[]): SMPTE;
    }
  }
  interface SMPTE {
    toString(): string;
  }

  namespace MIDI {
    interface Constructor {
      /** Create new MIDI message */
      new (...args: any[]): MIDI;
      /** Create new MIDI message */
      (...args: any[]): MIDI;
      // Channel-dependent
      /** Note On: `[9x nn vv]`; `x`: channel, `nn`: note, `vv`: velocity */
      noteOn(x: number, nn: number | string, vv?: number): MIDI;
      /** Note Off: `[8x nn vv]`; `x`: channel, `nn`: note, `vv`: velocity */
      noteOff(x: number, nn: number | string, vv?: number): MIDI;
      /** Polyphonic aftetouch: `[Ax nn vv]`; `x`: channel, `nn`: note, `vv`: value */
      aftertouch(x: number, nn: number | string, vv: number): MIDI;
      /** MIDI control: `[Bx nn vv]`; `x`: channel, `nn`: function, `vv`: value */
      control(x: number, nn: number, vv: number): MIDI;
      /** Program change: `[Cx nn]`; `x`: channel, `nn`: program */
      program(x: number, nn: number | string): MIDI;
      /** Pressure: `[Dx nn]`; `x`: channel, `nn`: pressure */
      pressure(x: number, nn: number): MIDI;
      /** Pitch bend: `[Ex lsb msb]`; `x`: channel, `msb`/`lsb`: most/least significant 7 bits */
      pitchBend(x: number, nn: number): MIDI;
      /** Bank select MSB: `[Bx 00 nn]`; `x`: channel, `nn`: most significant 7 bits */
      bankMSB(x: number, nn: number): MIDI;
      /** Bank select LSB: `[Bx 20 nn]`; `x`: channel, `nn`: least significant 7 bits */
      bankLSB(x: number, nn: number): MIDI;
      /** Modulation MSB: `[Bx 01 nn]`; `x`: channel, `nn`: most significant 7 bits */
      modMSB(x: number, nn: number): MIDI;
      /** Modulation LSB: `[Bx 21 nn]`; `x`: channel, `nn`: least significant 7 bits */
      modLSB(x: number, nn: number): MIDI;
      /** Breath controller MSB: `[Bx 02 nn]`; `x`: channel, `nn`: most significant 7 bits */
      breathMSB(x: number, nn: number): MIDI;
      /** Breath controller LSB: `[Bx 22 nn]`; `x`: channel, `nn`: least significant 7 bits */
      breathLSB(x: number, nn: number): MIDI;
      /** Foot controller MSB: `[Bx 04 nn]`; `x`: channel, `nn`: most significant 7 bits */
      footMSB(x: number, nn: number): MIDI;
      /** Foot controller LSB: `[Bx 24 nn]`; `x`: channel, `nn`: least significant 7 bits */
      footLSB(x: number, nn: number): MIDI;
      /** Portamento MSB: `[Bx 05 nn]`; `x`: channel, `nn`: most significant 7 bits */
      portamentoMSB(x: number, nn: number): MIDI;
      /** Portamento LSB: `[Bx 25 nn]`; `x`: channel, `nn`: least significant 7 bits */
      portamentoLSB(x: number, nn: number): MIDI;
      /** Volume MSB: `[Bx 07 nn]`; `x`: channel, `nn`: most significant 7 bits */
      volumeMSB(x: number, nn: number): MIDI;
      /** Volume LSB: `[Bx 27 nn]`; `x`: channel, `nn`: least significant 7 bits */
      volumeLSB(x: number, nn: number): MIDI;
      /** Balance MSB: `[Bx 08 nn]`; `x`: channel, `nn`: most significant 7 bits */
      balanceMSB(x: number, nn: number): MIDI;
      /** Balance LSB: `[Bx 28 nn]`; `x`: channel, `nn`: least significant 7 bits */
      balanceLSB(x: number, nn: number): MIDI;
      /** Pan MSB: `[Bx 0A nn]`; `x`: channel, `nn`: most significant 7 bits */
      panMSB(x: number, nn: number): MIDI;
      /** Pan LSB: `[Bx 2A nn]`; `x`: channel, `nn`: least significant 7 bits */
      panLSB(x: number, nn: number): MIDI;
      /** Expression MSB: `[Bx 0B nn]`; `x`: channel, `nn`: most significant 7 bits */
      expressionMSB(x: number, nn: number): MIDI;
      /** Expression LSB: `[Bx 2B nn]`; `x`: channel, `nn`: least significant 7 bits */
      expressionLSB(x: number, nn: number): MIDI;
      /** Damper on/off: `[Bx 40 nn]`; `x`: channel, `nn`: `bb ? 7f : 00` */
      damper(x: number, bb: boolean): MIDI;
      /** Portamento on/off: `[Bx 41 nn]`; `x`: channel, `nn`: `bb ? 7f : 00` */
      portamento(x: number, bb: boolean): MIDI;
      /** Sostenuto on/off: `[Bx 42 nn]`; `x`: channel, `nn`: `bb ? 7f : 00` */
      sostenuto(x: number, bb: boolean): MIDI;
      /** Soft on/off: `[Bx 43 nn]`; `x`: channel, `nn`: `bb ? 7f : 00` */
      soft(x: number, bb: boolean): MIDI;
      /** All sound off: `[Bx 78 00]`; `x`: channel */
      allSoundOff(x: number): MIDI;
      /** All notes off: `[Bx 7B 00]`; `x`: channel */
      allNotesOff(x: number): MIDI;
      // Channel-independent
      /** Song position: `[F2 lsb msb]`; `msb`/`lsb`: most/least significant 7 bits */
      songPosition(nn: number): MIDI;
      /** Song select: `[F3 nn]`; `nn`: song number */
      songSelect(nn: number): MIDI;
      /** Tune: `[F6]` */
      tune(): MIDI;
      /** Clock: `[F8]` */
      clock(): MIDI;
      /** Start: `[FA]` */
      start(): MIDI;
      /** Continue: `[FB]` */
      continue(): MIDI;
      /** Stop: `[FC]` */
      stop(): MIDI;
      /** Active sense signal: `[FE]` */
      active(): MIDI;
      /** Reset: `[FF]` */
      reset(): MIDI;
      /** ID Request SysEx: `[F0 7E 7F 06 01 F7]` */
      sxIdRequest(): MIDI;
      /** MIDI time code (SMPTE uarter frame): `[F1 xx]` */
      mtc(t: SMPTE): MIDI;
      /** SMPTE Full Frame SysEx: `[F0 7F 7F 01 01 xx xx xx xx F7]` */
      sxFullFrame(t: SMPTE): MIDI;
      // SMF
      smf(...args: any): MIDI;
      /** SMF Sequence number: [FF00 02 ssss] */
      smfSeqNumber(ssss: number): MIDI;
      /** SMF Text: [FF01 len text]; for use in Karaoke */
      smfText(str: string): MIDI;
      /** SMF Copyright: [FF02 len text] */
      smfCopyright(str: string): MIDI;
      /** SMF Sequence name: [FF03 len text] */
      smfSeqName(str: string): MIDI;
      /** SMF Instrument name: [FF04 len text] */
      smfInstrName(str: string): MIDI;
      /** SMF Lyrics: [FF05 len text] */
      smfLyric(str: string): MIDI;
      /** SMF Marker: [FF06 len text] */
      smfMarker(str: string): MIDI;
      /** SMF Cue point: [FF07 len text] */
      smfCuePoint(str: string): MIDI;
      /** SMF Program name: [FF08 len text] */
      smfProgName(str: string): MIDI;
      /** SMF Device name: [FF09 len text] */
      smfDevName(str: string): MIDI;
      /** SMF Channel prefix: [FF20 01 cc] */
      smfChannelPrefix(cc: number): MIDI;
      /** SMF MIDI port [FF21 01 pp] */
      smfMidiPort(pp: number): MIDI;
      /** SMF End of track: [FF2F 00] */
      smfEndOfTrack(): MIDI;
      /** SMF Tempo: [FF51 03 tttttt] */
      smfTempo(tttttt: number): MIDI;
      /** SMF Tempo, BMP: [FF51 03 tttttt] */
      smfBPM(bpm: number): MIDI;
      /** SMF SMPTE: [FF54 05 hh mm ss fr ff] */
      smfSMPTE(smpte: SMPTE | number[]): MIDI;
      /** SMF Time signature: [FF58 04 nn dd cc bb] */
      smfTimeSignature(nn: number, dd: number, cc?: number, bb?: number): MIDI;
      /** SMF Channel prefix: [FF20 01 cc] */
      //smfKeySignature(key) - key signature; returns FF59 02 sf mi, where key is a key signature (e.g. 'Bb', 'F#m'), sf - a sharp/flat count (e.g. -7 for 7 flats, 7 for 7 sharps, 0 for C major / A minor), mi = 0/1 for major / minor.
      /** SMF Sequencer-specific data: [FF7F len data] */
      //smfSequencer(data: string): MIDI;
      
      // Other
      /** Note MIDI value by name */
      noteValue(note: number | string): number;
      /** Program MIDI value by name */
      programValue(prog: number | string): number;
      /** Note frequency in HZ; `a5`: fraquency of `A5`, default: `440` */
      freq(note: number | string, a5?: number): number;
    }
  }
  interface MIDI extends Array<number> {
    toString(): string;

    isNoteOn(): boolean;
    isNoteOff(): boolean;
    isSysEx(): boolean;
    isFullSysEx(): boolean;
    isSMF(): boolean;
    isTempo(): boolean;
    isTimeSignature(): boolean;
    isKeySignature(): boolean;
    isEOT(): boolean;
    
    getChannel(): number;
    setChannel(cc: number): MIDI;
    getNote(): number;
    setNote(note: number | string): MIDI;
    getVelocity(): number;
    setVelocity(vv: number): MIDI;
    getSysExChannel(): number;
    setSysExChannel(cc: number): MIDI;
    
    getData(): string;
    setData(data: string): MIDI;
    getText(): string;
    setText(str: string): MIDI;
    getTempo(): number;
    getBPM(): number;
    getTimeSignature(): number[];
    getKeySignature(): any[];
  }

  namespace Stub {
    interface Async extends Stub, PromiseLike<Stub> {}
  }
  interface Stub {
    /** Print if OK */
    and(text: string): Stub.Async;
    /** Execute if OK */
    and(func: (self?: Stub) => void): Stub.Async;
    /** Print if not OK */
    or(text: string): Stub.Async;
    /** Execute if not OK */
    or(func: (self?: Stub) => void): Stub.Async;
    /** Wait `ms` milliseconds */
    wait(ms: number): Stub.Async;
  }

  namespace Engine {
    interface Async extends Engine, PromiseLike<Engine> {}
  }
  interface Engine {
    // Stub
    /** Print if OK */
    and(text: string): Engine.Async;
    /** Execute if OK */
    and(func: (self?: Stub) => void): Engine.Async;
    /** Print if not OK */
    or(text: string): Engine.Async;
    /** Execute if not OK */
    or(func: (self?: Stub) => void): Engine.Async;
    /** Wait `ms` milliseconds */
    wait(ms: number): Engine.Async;
    // Engine
    /** Close MIDI engine */
    close(): Stub.Async;
    /** Open MIDI-In port */
    openMidiIn(arg?: any): Port.Async;
    /** Open MIDI-Out port */
    openMidiOut(arg?: any): Port.Async;
  }

  namespace Port {
    interface Async extends Port, PromiseLike<Port> {}
  }
  interface Port {
    // Stub
    /** Print if OK */
    and(text: string): Port.Async;
    /** Execute if OK */
    and(func: (self?: Stub) => void): Port.Async;
    /** Print if not OK */
    or(text: string): Port.Async;
    /** Execute if not OK */
    or(func: (self?: Stub) => void): Port.Async;
    /** Wait `ms` milliseconds */
    wait(ms: number): Port.Async;
    // Port
    /** Close MIDI port */
    close(): Stub.Async;
  }
}

interface JZZ {
  /** Start MIDI engine */
  (arg?: any): JZZ.Engine.Async;
  /** MIDI message */
  readonly MIDI: JZZ.MIDI.Constructor;
  /** SMPTE message */
  readonly SMPTE: any;
  /** Invoke Web MIDI API */
  readonly requestMIDIAccess: (options?: WebMidi.MIDIOptions) => Promise<WebMidi.MIDIAccess>;
}
declare const jzz: JZZ;

export = jzz;
