import 'webmidi';

declare namespace JZZ {
  namespace MIDI {
    interface Constructor {
      /** Create new MIDI message */
      new (arg: any): MIDI;
      /** Create new MIDI message */
      (arg: any): MIDI;
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
      //mtc: function(t) { return [0xF1, _mtc(t)]; },
      //sxFullFrame: function(t) { return [0xF0, 0x7F, 0x7F, 0x01, 0x01, _hrtype(t), t.getMinute(), t.getSecond(), t.getFrame(), 0xF7]; },
    }
  }
  interface MIDI extends Array<number> {
    toString(): string;
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
