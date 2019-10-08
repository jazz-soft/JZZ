import 'webmidi';

declare namespace JZZ {
  namespace SMPTE {
    interface Constructor {
      /** Create new SMPTE object
       *
       * https://jazz-soft.net/doc/JZZ/smpte.html#constructor */
      new (...args: any[]): SMPTE;
      /** Create new SMPTE object
       *
       * https://jazz-soft.net/doc/JZZ/smpte.html#constructor */
      (...args: any[]): SMPTE;
    }
  }
  interface SMPTE {
    /** Convert SMPTE to human-readable string
     *
     * https://jazz-soft.net/doc/JZZ/smpte.html#tostring */
    toString(): string;
    /** SMPTE event is Full Frame
     *
     * https://jazz-soft.net/doc/JZZ/smpte.html#isFullFrame */
    isFullFrame(): boolean;
    /** Get SMPTE type
     *
     * https://jazz-soft.net/doc/JZZ/smpte.html#getType */
    getType(): number;
    /** Get SMPTE hour
     *
     * https://jazz-soft.net/doc/JZZ/smpte.html#getHour */
    getHour(): number;
    /** Get SMPTE minute
     *
     * https://jazz-soft.net/doc/JZZ/smpte.html#getMinute */
    getMinute(): number;
    /** Get SMPTE second
     *
     * https://jazz-soft.net/doc/JZZ/smpte.html#getSecond */
    getSecond(): number;
    /** Get SMPTE frame
     *
     * https://jazz-soft.net/doc/JZZ/smpte.html#getFrame */
    getFrame(): number;
    /** Get SMPTE quarter frame
     *
     * https://jazz-soft.net/doc/JZZ/smpte.html#getQuarter */
    getQuarter(): number;
    /** Set SMPTE type
     *
     * https://jazz-soft.net/doc/JZZ/smpte.html#setType */
    setType(n: number): SMPTE;
    /** Set SMPTE hour
     *
     * https://jazz-soft.net/doc/JZZ/smpte.html#setHour */
    setHour(n: number): SMPTE;
    /** Set SMPTE minute
     *
     * https://jazz-soft.net/doc/JZZ/smpte.html#setMinute */
    setMinute(n: number): SMPTE;
    /** Set SMPTE second
     *
     * https://jazz-soft.net/doc/JZZ/smpte.html#setSecond */
    setSecond(n: number): SMPTE;
    /** Set SMPTE frame
     *
     * https://jazz-soft.net/doc/JZZ/smpte.html#setFrame */
    setFrame(n: number): SMPTE;
    /** Set SMPTE quarter frame
     *
     * https://jazz-soft.net/doc/JZZ/smpte.html#setQuarter */
    setQuarter(n: number): SMPTE;
    /** Increase SMPTE time by one frame
     *
     * https://jazz-soft.net/doc/JZZ/smpte.html#incrFrame */
    incrFrame(): SMPTE;
    /** Decrease SMPTE time by one frame
     *
     * https://jazz-soft.net/doc/JZZ/smpte.html#decrFrame */
    decrFrame(): SMPTE;
    /** Increase SMPTE time by quarter frame
     *
     * https://jazz-soft.net/doc/JZZ/smpte.html#incrQF */
    incrQF(): SMPTE;
    /** Decrease SMPTE time by quarter frame
     *
     * https://jazz-soft.net/doc/JZZ/smpte.html#decrQF */
    decrQF(): SMPTE;
    /** Read MIDI Time Code message
     *
     * https://jazz-soft.net/doc/JZZ/smpte.html#read */
    read(...args: any[]): boolean;
    /** Reset SMPTE object
     *
     * https://jazz-soft.net/doc/JZZ/smpte.html#reset */
     reset(...args: any[]): SMPTE;
  }

  namespace MIDI {
    interface Constructor {
      /** Create new MIDI message
       *
       * https://jazz-soft.net/doc/JZZ/jzzmidi.html#constructor */
      new (...args: any[]): MIDI;
      /** Create new MIDI message
       *
       * https://jazz-soft.net/doc/JZZ/jzzmidi.html#constructor */
      (...args: any[]): MIDI;

      // Channel-dependent
      /** Note On: `[9x nn vv]`; `x`: channel, `nn`: note, `vv`: velocity
       *
       * https://jazz-soft.net/doc/JZZ/jzzmidi.html#noteOn */
      noteOn(x: number, nn: number | string, vv?: number): MIDI;
      /** Note Off: `[8x nn vv]`; `x`: channel, `nn`: note, `vv`: velocity
       *
       * https://jazz-soft.net/doc/JZZ/jzzmidi.html#noteOff */
      noteOff(x: number, nn: number | string, vv?: number): MIDI;
      /** Polyphonic aftetouch: `[Ax nn vv]`; `x`: channel, `nn`: note, `vv`: value
       *
       * https://jazz-soft.net/doc/JZZ/jzzmidi.html#aftertouch */
      aftertouch(x: number, nn: number | string, vv: number): MIDI;
      /** MIDI control: `[Bx nn vv]`; `x`: channel, `nn`: function, `vv`: value
       *
       * https://jazz-soft.net/doc/JZZ/jzzmidi.html#control */
      control(x: number, nn: number, vv: number): MIDI;
      /** Program change: `[Cx nn]`; `x`: channel, `nn`: program
       *
       * https://jazz-soft.net/doc/JZZ/jzzmidi.html#program */
      program(x: number, nn: number | string): MIDI;
      /** Pressure: `[Dx nn]`; `x`: channel, `nn`: pressure
       *
       * https://jazz-soft.net/doc/JZZ/jzzmidi.html#pressure */
      pressure(x: number, nn: number): MIDI;
      /** Pitch bend: `[Ex lsb msb]`; `x`: channel, `msb`/`lsb`: most/least significant 7 bits
       *
       * https://jazz-soft.net/doc/JZZ/jzzmidi.html#pitchBend */
      pitchBend(x: number, nn: number): MIDI;
      /** Bank select MSB: `[Bx 00 nn]`; `x`: channel, `nn`: most significant 7 bits
       *
       * https://jazz-soft.net/doc/JZZ/jzzmidi.html#bankMSB */
      bankMSB(x: number, nn: number): MIDI;
      /** Bank select LSB: `[Bx 20 nn]`; `x`: channel, `nn`: least significant 7 bits
       *
       * https://jazz-soft.net/doc/JZZ/jzzmidi.html#bankLSB */
      bankLSB(x: number, nn: number): MIDI;
      /** Modulation MSB: `[Bx 01 nn]`; `x`: channel, `nn`: most significant 7 bits
       *
       * https://jazz-soft.net/doc/JZZ/jzzmidi.html#modMSB */
      modMSB(x: number, nn: number): MIDI;
      /** Modulation LSB: `[Bx 21 nn]`; `x`: channel, `nn`: least significant 7 bits
       *
       * https://jazz-soft.net/doc/JZZ/jzzmidi.html#modLSB */
      modLSB(x: number, nn: number): MIDI;
      /** Breath controller MSB: `[Bx 02 nn]`; `x`: channel, `nn`: most significant 7 bits
       *
       * https://jazz-soft.net/doc/JZZ/jzzmidi.html#breathMSB */
      breathMSB(x: number, nn: number): MIDI;
      /** Breath controller LSB: `[Bx 22 nn]`; `x`: channel, `nn`: least significant 7 bits
       *
       * https://jazz-soft.net/doc/JZZ/jzzmidi.html#breathLSB */
      breathLSB(x: number, nn: number): MIDI;
      /** Foot controller MSB: `[Bx 04 nn]`; `x`: channel, `nn`: most significant 7 bits
       *
       * https://jazz-soft.net/doc/JZZ/jzzmidi.html#footMSB */
      footMSB(x: number, nn: number): MIDI;
      /** Foot controller LSB: `[Bx 24 nn]`; `x`: channel, `nn`: least significant 7 bits
       *
       * https://jazz-soft.net/doc/JZZ/jzzmidi.html#footLSB */
      footLSB(x: number, nn: number): MIDI;
      /** Portamento MSB: `[Bx 05 nn]`; `x`: channel, `nn`: most significant 7 bits
       *
       * https://jazz-soft.net/doc/JZZ/jzzmidi.html#portamentoMSB */
      portamentoMSB(x: number, nn: number): MIDI;
      /** Portamento LSB: `[Bx 25 nn]`; `x`: channel, `nn`: least significant 7 bits
       *
       * https://jazz-soft.net/doc/JZZ/jzzmidi.html#portamentoLSB */
      portamentoLSB(x: number, nn: number): MIDI;
      /** Volume MSB: `[Bx 07 nn]`; `x`: channel, `nn`: most significant 7 bits
       *
       * https://jazz-soft.net/doc/JZZ/jzzmidi.html#volumeMSB */
      volumeMSB(x: number, nn: number): MIDI;
      /** Volume LSB: `[Bx 27 nn]`; `x`: channel, `nn`: least significant 7 bits
       *
       * https://jazz-soft.net/doc/JZZ/jzzmidi.html#volumeLSB */
      volumeLSB(x: number, nn: number): MIDI;
      /** Balance MSB: `[Bx 08 nn]`; `x`: channel, `nn`: most significant 7 bits
       *
       * https://jazz-soft.net/doc/JZZ/jzzmidi.html#balanceMSB */
      balanceMSB(x: number, nn: number): MIDI;
      /** Balance LSB: `[Bx 28 nn]`; `x`: channel, `nn`: least significant 7 bits
       *
       * https://jazz-soft.net/doc/JZZ/jzzmidi.html#balanceLSB */
      balanceLSB(x: number, nn: number): MIDI;
      /** Pan MSB: `[Bx 0A nn]`; `x`: channel, `nn`: most significant 7 bits
       *
       * https://jazz-soft.net/doc/JZZ/jzzmidi.html#panMSB */
      panMSB(x: number, nn: number): MIDI;
      /** Pan LSB: `[Bx 2A nn]`; `x`: channel, `nn`: least significant 7 bits
       *
       * https://jazz-soft.net/doc/JZZ/jzzmidi.html#panLSB */
      panLSB(x: number, nn: number): MIDI;
      /** Expression MSB: `[Bx 0B nn]`; `x`: channel, `nn`: most significant 7 bits
       *
       * https://jazz-soft.net/doc/JZZ/jzzmidi.html#expressionMSB */
      expressionMSB(x: number, nn: number): MIDI;
      /** Expression LSB: `[Bx 2B nn]`; `x`: channel, `nn`: least significant 7 bits
       *
       * https://jazz-soft.net/doc/JZZ/jzzmidi.html#expressionLSB */
      expressionLSB(x: number, nn: number): MIDI;
      /** Damper on/off: `[Bx 40 nn]`; `x`: channel, `nn`: `bb ? 7f : 00`
       *
       * https://jazz-soft.net/doc/JZZ/jzzmidi.html#damper */
      damper(x: number, bb: boolean): MIDI;
      /** Portamento on/off: `[Bx 41 nn]`; `x`: channel, `nn`: `bb ? 7f : 00`
       *
       * https://jazz-soft.net/doc/JZZ/jzzmidi.html#portamento */
      portamento(x: number, bb: boolean): MIDI;
      /** Sostenuto on/off: `[Bx 42 nn]`; `x`: channel, `nn`: `bb ? 7f : 00`
       *
       * https://jazz-soft.net/doc/JZZ/jzzmidi.html#sostenuto */
      sostenuto(x: number, bb: boolean): MIDI;
      /** Soft on/off: `[Bx 43 nn]`; `x`: channel, `nn`: `bb ? 7f : 00`
       *
       * https://jazz-soft.net/doc/JZZ/jzzmidi.html#soft */
      soft(x: number, bb: boolean): MIDI;
      /** All sound off: `[Bx 78 00]`; `x`: channel
       *
       * https://jazz-soft.net/doc/JZZ/jzzmidi.html#allSoundOff */
      allSoundOff(x: number): MIDI;
      /** All notes off: `[Bx 7B 00]`; `x`: channel
       *
       * https://jazz-soft.net/doc/JZZ/jzzmidi.html#allNotesOff */
      allNotesOff(x: number): MIDI;

      // Channel-independent
      /** Song position: `[F2 lsb msb]`; `msb`/`lsb`: most/least significant 7 bits
       *
       * https://jazz-soft.net/doc/JZZ/jzzmidi.html#songPosition */
      songPosition(nn: number): MIDI;
      /** Song select: `[F3 nn]`; `nn`: song number
       *
       * https://jazz-soft.net/doc/JZZ/jzzmidi.html#songSelect */
      songSelect(nn: number): MIDI;
      /** Tune: `[F6]`
       *
       * https://jazz-soft.net/doc/JZZ/jzzmidi.html#tune */
      tune(): MIDI;
      /** Clock: `[F8]`
       *
       * https://jazz-soft.net/doc/JZZ/jzzmidi.html#clock */
      clock(): MIDI;
      /** Start: `[FA]`
       *
       * https://jazz-soft.net/doc/JZZ/jzzmidi.html#start */
      start(): MIDI;
      /** Continue: `[FB]`
       *
       * https://jazz-soft.net/doc/JZZ/jzzmidi.html#continue */
      continue(): MIDI;
      /** Stop: `[FC]`
       *
       * https://jazz-soft.net/doc/JZZ/jzzmidi.html#stop */
      stop(): MIDI;
      /** Active sense signal: `[FE]`
       *
       * https://jazz-soft.net/doc/JZZ/jzzmidi.html#active */
      active(): MIDI;
      /** Reset: `[FF]`
       *
       * https://jazz-soft.net/doc/JZZ/jzzmidi.html#reset */
      reset(): MIDI;
      /** ID Request SysEx: `[F0 7E 7F 06 01 F7]`
       *
       * https://jazz-soft.net/doc/JZZ/jzzmidi.html#sxIdRequest */
      sxIdRequest(): MIDI;
      /** MIDI time code (SMPTE quarter frame): `[F1 xx]`
       *
       * https://jazz-soft.net/doc/JZZ/jzzmidi.html#mtc */
      mtc(t: SMPTE): MIDI;
      /** SMPTE Full Frame SysEx: `[F0 7F 7F 01 01 xx xx xx xx F7]`
       *
       * https://jazz-soft.net/doc/JZZ/jzzmidi.html#sxFullFrame */
      sxFullFrame(t: SMPTE): MIDI;

      // SMF
      /** Standard MIDI File meta event: [FFxx len data]
       *
       * https://jazz-soft.net/doc/JZZ/jzzmidi.html#smf */
      smf(...args: any): MIDI;
      /** SMF Sequence Number: [FF00 02 ssss]
       *
       * https://jazz-soft.net/doc/JZZ/jzzmidi.html#smfSeqNumber */
      smfSeqNumber(ssss: number): MIDI;
      /** SMF Text: [FF01 len text]; used in Karaoke files
       *
       * https://jazz-soft.net/doc/JZZ/jzzmidi.html#smfText */
      smfText(str: string): MIDI;
      /** SMF Copyright: [FF02 len text]
       *
       * https://jazz-soft.net/doc/JZZ/jzzmidi.html#smfCopyright */
      smfCopyright(str: string): MIDI;
      /** SMF Sequence Name: [FF03 len text]
       *
       * https://jazz-soft.net/doc/JZZ/jzzmidi.html#smfSeqName */
      smfSeqName(str: string): MIDI;
      /** SMF Instrument Name: [FF04 len text]
       *
       * https://jazz-soft.net/doc/JZZ/jzzmidi.html#smfInstrName */
      smfInstrName(str: string): MIDI;
      /** SMF Lyric: [FF05 len text]
       *
       * https://jazz-soft.net/doc/JZZ/jzzmidi.html#smfLyric */
      smfLyric(str: string): MIDI;
      /** SMF Marker: [FF06 len text]
       *
       * https://jazz-soft.net/doc/JZZ/jzzmidi.html#smfMarker */
      smfMarker(str: string): MIDI;
      /** SMF Cue Point: [FF07 len text]
       *
       * https://jazz-soft.net/doc/JZZ/jzzmidi.html#smfCuePoint */
      smfCuePoint(str: string): MIDI;
      /** SMF Program Name: [FF08 len text]
       *
       * https://jazz-soft.net/doc/JZZ/jzzmidi.html#smfProgName */
      smfProgName(str: string): MIDI;
      /** SMF Device Name: [FF09 len text]
       *
       * https://jazz-soft.net/doc/JZZ/jzzmidi.html#smfDevName */
      smfDevName(str: string): MIDI;
      /** SMF Channel Prefix: [FF20 01 cc]
       *
       * https://jazz-soft.net/doc/JZZ/jzzmidi.html#smfChannelPrefix */
      smfChannelPrefix(cc: number): MIDI;
      /** SMF MIDI Port [FF21 01 pp]
       *
       * https://jazz-soft.net/doc/JZZ/jzzmidi.html#smfMidiPort */
      smfMidiPort(pp: number): MIDI;
      /** SMF End of Track: [FF2F 00]
       *
       * https://jazz-soft.net/doc/JZZ/jzzmidi.html#smfEndOfTrack */
      smfEndOfTrack(): MIDI;
      /** SMF Tempo: [FF51 03 tttttt]
       *
       * https://jazz-soft.net/doc/JZZ/jzzmidi.html#smfTempo */
      smfTempo(tttttt: number): MIDI;
      /** SMF Tempo, BMP: [FF51 03 tttttt]
       *
       * https://jazz-soft.net/doc/JZZ/jzzmidi.html#smfBPM */
      smfBPM(bpm: number): MIDI;
      /** SMF SMPTE offset: [FF54 05 hh mm ss fr ff]
       * 
       * https://jazz-soft.net/doc/JZZ/jzzmidi.html#smfSMPTE */
      smfSMPTE(smpte: SMPTE | number[]): MIDI;
      /** SMF Time Signature: [FF58 04 nn dd cc bb]
       *
       * https://jazz-soft.net/doc/JZZ/jzzmidi.html#smfTimeSignature */
      smfTimeSignature(nn: number, dd: number, cc?: number, bb?: number): MIDI;
      /** SMF Key Signature: [FF59 02 sf mi]
       *
       * https://jazz-soft.net/doc/JZZ/jzzmidi.html#smfKeySignature */
      smfKeySignature(key: string): MIDI;
      /** SMF Sequencer-specific Data: [FF7F len data]
       *
       * https://jazz-soft.net/doc/JZZ/jzzmidi.html#smfSequencer */
      smfSequencer(data: string): MIDI;

      // Other
      /** Note MIDI value by name
       *
       * https://jazz-soft.net/doc/JZZ/midigm.html#noteValue */
      noteValue(note: number | string): number;
      /** Program MIDI value by name
       *
       * https://jazz-soft.net/doc/JZZ/midigm.html#programValue */
      programValue(prog: number | string): number;
      /** Note frequency in HZ; `a5`: frequency of the `A5`, default: `440`
       *
       * https://jazz-soft.net/doc/JZZ/jzzmidi.html#freq */
      freq(note: number | string, a5?: number): number;
    }
  }
  interface MIDI extends Array<number> {
    /** Convert MIDI to human-readable string
     *
     * https://jazz-soft.net/doc/JZZ/jzzmidi.html#tostring */
    toString(): string;
    /** The message is Note On
     *
     * https://jazz-soft.net/doc/JZZ/jzzmidi.html#isNoteOn */
    isNoteOn(): boolean;
    /** The message is Note Off
     *
     * https://jazz-soft.net/doc/JZZ/jzzmidi.html#isNoteOff */
    isNoteOff(): boolean;
    /** The message is a SysEx
     *
     * https://jazz-soft.net/doc/JZZ/jzzmidi.html#isSysEx */
    isSysEx(): boolean;
    /** The message is a full SysEx
     *
     * https://jazz-soft.net/doc/JZZ/jzzmidi.html#isFullSysEx */
    isFullSysEx(): boolean;
    /** The message is a Standard MIDI File meta event
     *
     * https://jazz-soft.net/doc/JZZ/jzzmidi.html#isSMF */
    isSMF(): boolean;
    /** The message is a Tempo meta event
     *
     * https://jazz-soft.net/doc/JZZ/jzzmidi.html#isTempo */
    isTempo(): boolean;
    /** The message is a Time Signature meta event
     *
     * https://jazz-soft.net/doc/JZZ/jzzmidi.html#isTimeSignature */
    isTimeSignature(): boolean;
    /** The message is a Key Signature meta event
     *
     * https://jazz-soft.net/doc/JZZ/jzzmidi.html#isKeySignature */
    isKeySignature(): boolean;
    /** The message is an End of Track meta event
     *
     * https://jazz-soft.net/doc/JZZ/jzzmidi.html#isEOT */
    isEOT(): boolean;
    /** Return the channel number where applicable
     *
     * https://jazz-soft.net/doc/JZZ/jzzmidi.html#getChannel */
    getChannel(): number;
    /** Set the channel number where applicable
     *
     * https://jazz-soft.net/doc/JZZ/jzzmidi.html#setChannel */
    setChannel(cc: number): MIDI;
    /** Return the note value where applicable
     *
     * https://jazz-soft.net/doc/JZZ/jzzmidi.html#getNote */
    getNote(): number;
    /** Set the note where applicable
     *
     * https://jazz-soft.net/doc/JZZ/jzzmidi.html#setNote */
    setNote(note: number | string): MIDI;
    /** Return the velocity where applicable
     *
     * https://jazz-soft.net/doc/JZZ/jzzmidi.html#getVelocity */
    getVelocity(): number;
    /** Set the velocity where applicable
     *
     * https://jazz-soft.net/doc/JZZ/jzzmidi.html#setVelocity */
    setVelocity(vv: number): MIDI;
    /** Return the SysEx channel number where applicable
     *
     * https://jazz-soft.net/doc/JZZ/jzzmidi.html#getSysExChannel */
    getSysExChannel(): number;
    /** Set the SysEx channel number where applicable
     *
     * https://jazz-soft.net/doc/JZZ/jzzmidi.html#setSysExChannel */
    setSysExChannel(cc: number): MIDI;
    
    /** Get data from SMF meta event
     *
     * https://jazz-soft.net/doc/JZZ/jzzmidi.html#getData */
    getData(): string;
    /** Set data on SMF meta event
     *
     * https://jazz-soft.net/doc/JZZ/jzzmidi.html#setData */
    setData(data: string): MIDI;
    /** Get UTF8 text from SMF meta event
     *
     * https://jazz-soft.net/doc/JZZ/jzzmidi.html#getText */
    getText(): string;
    /** Set UTF8 text on SMF meta event
     *
     * https://jazz-soft.net/doc/JZZ/jzzmidi.html#setText */
    setText(str: string): MIDI;
    /** Get tempo in ms per quarter note from SMF Tempo meta event
     *
     * https://jazz-soft.net/doc/JZZ/jzzmidi.html#getTempo */
    getTempo(): number;
    /** Get tempo as BPM from SMF Tempo meta event
     *
     * https://jazz-soft.net/doc/JZZ/jzzmidi.html#getBPM */
    getBPM(): number;
    /** Get time signature from SMF Time Signature meta event
     *
     * https://jazz-soft.net/doc/JZZ/jzzmidi.html#getTimeSignature */
    getTimeSignature(): number[];
    /** Get key signature from SMF Key Signature meta event
     *
     * https://jazz-soft.net/doc/JZZ/jzzmidi.html#getKeySignature */
    getKeySignature(): any[];
  }

  namespace Stub {
    interface Async extends Stub, PromiseLike<Stub> {}
  }
  interface Stub {
    /** Print if OK
     *
     * https://jazz-soft.net/doc/JZZ/common.html#and */
    and(text: string): Stub.Async;
    /** Execute if OK
     *
     * https://jazz-soft.net/doc/JZZ/common.html#and */
    and(func: (self?: Stub) => void): Stub.Async;
    /** Print if not OK
     *
     * https://jazz-soft.net/doc/JZZ/common.html#or */
    or(text: string): Stub.Async;
    /** Execute if not OK
     *
     * https://jazz-soft.net/doc/JZZ/common.html#or */
    or(func: (self?: Stub) => void): Stub.Async;
    /** Wait `ms` milliseconds
     *
     * https://jazz-soft.net/doc/JZZ/common.html#wait */
    wait(ms: number): Stub.Async;
  }

  namespace Engine {
    interface Async extends Engine, PromiseLike<Engine> {}
  }
  interface Engine {
    // Stub
    /** Print if OK
     *
     * https://jazz-soft.net/doc/JZZ/common.html#and */
    and(text: string): Engine.Async;
    /** Execute if OK
     *
     * https://jazz-soft.net/doc/JZZ/common.html#and */
    and(func: (self?: Stub) => void): Engine.Async;
    /** Print if not OK
     *
     * https://jazz-soft.net/doc/JZZ/common.html#or */
    or(text: string): Engine.Async;
    /** Execute if not OK
     *
     * https://jazz-soft.net/doc/JZZ/common.html#or */
    or(func: (self?: Stub) => void): Engine.Async;
    /** Wait `ms` milliseconds
     *
     * https://jazz-soft.net/doc/JZZ/common.html#wait */
    wait(ms: number): Engine.Async;

    // Engine
    /** Return an `info` object
     *
     * https://jazz-soft.net/doc/JZZ/jzz.html#info */
    info(): any;
    /** Refresh the list of available ports
     *
     * https://jazz-soft.net/doc/JZZ/jzz.html#refresh */
    refresh(): Engine.Async;
    /** Open MIDI-In port
     *
     * https://jazz-soft.net/doc/JZZ/midiin.html#open */
    openMidiIn(arg?: any): Port.Async;
    /** Open MIDI-Out port
     *
     * https://jazz-soft.net/doc/JZZ/midiout.html#open */
    openMidiOut(arg?: any): Port.Async;
    /** Watch MIDI connection changes
     *
     * https://jazz-soft.net/doc/JZZ/jzz.html#onChange */
    onChange(arg?: any): Watcher.Async;
    /** Close MIDI engine
     *
     * https://jazz-soft.net/doc/JZZ/jzz.html#close */
    close(): Stub.Async;
  }

  namespace Port {
    interface Async extends Port, PromiseLike<Port> {}
  }
  interface Port {
    // Stub
    /** Print if OK
     *
     * https://jazz-soft.net/doc/JZZ/common.html#and */
    and(text: string): Port.Async;
    /** Execute if OK
     *
     * https://jazz-soft.net/doc/JZZ/common.html#and */
    and(func: (self?: Stub) => void): Port.Async;
    /** Print if not OK
     *
     * https://jazz-soft.net/doc/JZZ/common.html#or */
    or(text: string): Port.Async;
    /** Execute if not OK
     *
     * https://jazz-soft.net/doc/JZZ/common.html#or */
    or(func: (self?: Stub) => void): Port.Async;
    /** Wait `ms` milliseconds
     *
     * https://jazz-soft.net/doc/JZZ/common.html#wait */
    wait(ms: number): Port.Async;

    // Port
    /** Return an `info` object
     *
     * https://jazz-soft.net/doc/JZZ/midiin.html#info */
    info(): any;
    /** Return the port name
     *
     * https://jazz-soft.net/doc/JZZ/midiin.html#name */
    name(): string;
    /** Connect MIDI port
     *
     * https://jazz-soft.net/doc/JZZ/midiin.html#connect */
    connect(arg: any): Port.Async;
    /** Disonnect MIDI port
     *
     * https://jazz-soft.net/doc/JZZ/midiin.html#disconnect */
    disconnect(arg?: any): Port.Async;
    /** Send MIDI message
     *
     * https://jazz-soft.net/doc/JZZ/midiout.html#send */
    send(...args: any[]): Port.Async;
    /** Emit MIDI message
     *
     * https://jazz-soft.net/doc/JZZ/midithru.html#emit */
    emit(...args: any[]): Port.Async;
    /** Emit MIDI message
     *
     * https://jazz-soft.net/doc/JZZ/midithru.html#emit */
    _emit(...args: any[]): void;
    /** Close MIDI port
     *
     * https://jazz-soft.net/doc/JZZ/midiin.html#close */
    close(): Stub.Async;

    /** MIDI channel
     *
     * https://jazz-soft.net/doc/JZZ/midiout.html#ch */
    ch(x: number): Channel.Async;
    /** MIDI channel
     *
     * https://jazz-soft.net/doc/JZZ/midiout.html#ch */
    ch(): Port.Async;
    /** MPE channel
     *
     * https://jazz-soft.net/doc/JZZ/midiout.html#mpe */
    mpe(m: number, n: number): MPE.Async;
    /** MPE channel
     *
     * https://jazz-soft.net/doc/JZZ/midiout.html#mpe */
    mpe(): Port.Async;

    /** Play note
     *
     * https://jazz-soft.net/doc/JZZ/midiout.html#note */
    note(x: number, nn: number | string, vv?: number, tt?: number): Port.Async;

    // Channel-dependent
    /** Note On: `[9x nn vv]`; `x`: channel, `nn`: note, `vv`: velocity
     *
     * https://jazz-soft.net/doc/JZZ/jzzmidi.html#noteOn */
    noteOn(x: number, nn: number | string, vv?: number): Port.Async;
    /** Note Off: `[8x nn vv]`; `x`: channel, `nn`: note, `vv`: velocity
     *
     * https://jazz-soft.net/doc/JZZ/jzzmidi.html#noteOff */
    noteOff(x: number, nn: number | string, vv?: number): Port.Async;
    /** Polyphonic aftetouch: `[Ax nn vv]`; `x`: channel, `nn`: note, `vv`: value
     *
     * https://jazz-soft.net/doc/JZZ/jzzmidi.html#aftertouch */
    aftertouch(x: number, nn: number | string, vv: number): Port.Async;
    /** MIDI control: `[Bx nn vv]`; `x`: channel, `nn`: function, `vv`: value
     *
     * https://jazz-soft.net/doc/JZZ/jzzmidi.html#control */
    control(x: number, nn: number, vv: number): Port.Async;
    /** Program change: `[Cx nn]`; `x`: channel, `nn`: program
     *
     * https://jazz-soft.net/doc/JZZ/jzzmidi.html#program */
    program(x: number, nn: number | string): Port.Async;
    /** Pressure: `[Dx nn]`; `x`: channel, `nn`: pressure
     *
     * https://jazz-soft.net/doc/JZZ/jzzmidi.html#pressure */
    pressure(x: number, nn: number): Port.Async;
    /** Pitch bend: `[Ex lsb msb]`; `x`: channel, `msb`/`lsb`: most/least significant 7 bits
     *
     * https://jazz-soft.net/doc/JZZ/jzzmidi.html#pitchBend */
    pitchBend(x: number, nn: number): Port.Async;
    /** Bank select MSB: `[Bx 00 nn]`; `x`: channel, `nn`: most significant 7 bits
     *
     * https://jazz-soft.net/doc/JZZ/jzzmidi.html#bankMSB */
    bankMSB(x: number, nn: number): Port.Async;
    /** Bank select LSB: `[Bx 20 nn]`; `x`: channel, `nn`: least significant 7 bits
     *
     * https://jazz-soft.net/doc/JZZ/jzzmidi.html#bankLSB */
    bankLSB(x: number, nn: number): Port.Async;
    /** Modulation MSB: `[Bx 01 nn]`; `x`: channel, `nn`: most significant 7 bits
     *
     * https://jazz-soft.net/doc/JZZ/jzzmidi.html#modMSB */
    modMSB(x: number, nn: number): Port.Async;
    /** Modulation LSB: `[Bx 21 nn]`; `x`: channel, `nn`: least significant 7 bits
     *
     * https://jazz-soft.net/doc/JZZ/jzzmidi.html#modLSB */
    modLSB(x: number, nn: number): Port.Async;
    /** Breath controller MSB: `[Bx 02 nn]`; `x`: channel, `nn`: most significant 7 bits
     *
     * https://jazz-soft.net/doc/JZZ/jzzmidi.html#breathMSB */
    breathMSB(x: number, nn: number): Port.Async;
    /** Breath controller LSB: `[Bx 22 nn]`; `x`: channel, `nn`: least significant 7 bits
     *
     * https://jazz-soft.net/doc/JZZ/jzzmidi.html#breathLSB */
    breathLSB(x: number, nn: number): Port.Async;
    /** Foot controller MSB: `[Bx 04 nn]`; `x`: channel, `nn`: most significant 7 bits
     *
     * https://jazz-soft.net/doc/JZZ/jzzmidi.html#footMSB */
    footMSB(x: number, nn: number): Port.Async;
    /** Foot controller LSB: `[Bx 24 nn]`; `x`: channel, `nn`: least significant 7 bits
     *
     * https://jazz-soft.net/doc/JZZ/jzzmidi.html#footLSB */
    footLSB(x: number, nn: number): Port.Async;
    /** Portamento MSB: `[Bx 05 nn]`; `x`: channel, `nn`: most significant 7 bits
     *
     * https://jazz-soft.net/doc/JZZ/jzzmidi.html#portamentoMSB */
    portamentoMSB(x: number, nn: number): Port.Async;
    /** Portamento LSB: `[Bx 25 nn]`; `x`: channel, `nn`: least significant 7 bits
     *
     * https://jazz-soft.net/doc/JZZ/jzzmidi.html#portamentoLSB */
    portamentoLSB(x: number, nn: number): Port.Async;
    /** Volume MSB: `[Bx 07 nn]`; `x`: channel, `nn`: most significant 7 bits
     *
     * https://jazz-soft.net/doc/JZZ/jzzmidi.html#volumeMSB */
    volumeMSB(x: number, nn: number): Port.Async;
    /** Volume LSB: `[Bx 27 nn]`; `x`: channel, `nn`: least significant 7 bits
     *
     * https://jazz-soft.net/doc/JZZ/jzzmidi.html#volumeLSB */
    volumeLSB(x: number, nn: number): Port.Async;
    /** Balance MSB: `[Bx 08 nn]`; `x`: channel, `nn`: most significant 7 bits
     *
     * https://jazz-soft.net/doc/JZZ/jzzmidi.html#balanceMSB */
    balanceMSB(x: number, nn: number): Port.Async;
    /** Balance LSB: `[Bx 28 nn]`; `x`: channel, `nn`: least significant 7 bits
     *
     * https://jazz-soft.net/doc/JZZ/jzzmidi.html#balanceLSB */
    balanceLSB(x: number, nn: number): Port.Async;
    /** Pan MSB: `[Bx 0A nn]`; `x`: channel, `nn`: most significant 7 bits
     *
     * https://jazz-soft.net/doc/JZZ/jzzmidi.html#panMSB */
    panMSB(x: number, nn: number): Port.Async;
    /** Pan LSB: `[Bx 2A nn]`; `x`: channel, `nn`: least significant 7 bits
     *
     * https://jazz-soft.net/doc/JZZ/jzzmidi.html#panLSB */
    panLSB(x: number, nn: number): Port.Async;
    /** Expression MSB: `[Bx 0B nn]`; `x`: channel, `nn`: most significant 7 bits
     *
     * https://jazz-soft.net/doc/JZZ/jzzmidi.html#expressionMSB */
    expressionMSB(x: number, nn: number): Port.Async;
    /** Expression LSB: `[Bx 2B nn]`; `x`: channel, `nn`: least significant 7 bits
     *
     * https://jazz-soft.net/doc/JZZ/jzzmidi.html#expressionLSB */
    expressionLSB(x: number, nn: number): Port.Async;
    /** Damper on/off: `[Bx 40 nn]`; `x`: channel, `nn`: `bb ? 7f : 00`
     *
     * https://jazz-soft.net/doc/JZZ/jzzmidi.html#damper */
    damper(x: number, bb: boolean): Port.Async;
    /** Portamento on/off: `[Bx 41 nn]`; `x`: channel, `nn`: `bb ? 7f : 00`
     *
     * https://jazz-soft.net/doc/JZZ/jzzmidi.html#portamento */
    portamento(x: number, bb: boolean): Port.Async;
    /** Sostenuto on/off: `[Bx 42 nn]`; `x`: channel, `nn`: `bb ? 7f : 00`
     *
     * https://jazz-soft.net/doc/JZZ/jzzmidi.html#sostenuto */
    sostenuto(x: number, bb: boolean): Port.Async;
    /** Soft on/off: `[Bx 43 nn]`; `x`: channel, `nn`: `bb ? 7f : 00`
     *
     * https://jazz-soft.net/doc/JZZ/jzzmidi.html#soft */
    soft(x: number, bb: boolean): Port.Async;
    /** All sound off: `[Bx 78 00]`; `x`: channel
     *
     * https://jazz-soft.net/doc/JZZ/jzzmidi.html#allSoundOff */
    allSoundOff(x: number): Port.Async;
    /** All notes off: `[Bx 7B 00]`; `x`: channel
     *
     * https://jazz-soft.net/doc/JZZ/jzzmidi.html#allNotesOff */
    allNotesOff(x: number): Port.Async;

    // Channel-independent
    /** Song position: `[F2 lsb msb]`; `msb`/`lsb`: most/least significant 7 bits
     *
     * https://jazz-soft.net/doc/JZZ/jzzmidi.html#songPosition */
    songPosition(nn: number): Port.Async;
    /** Song select: `[F3 nn]`; `nn`: song number
     *
     * https://jazz-soft.net/doc/JZZ/jzzmidi.html#songSelect */
    songSelect(nn: number): Port.Async;
    /** Tune: `[F6]`
     *
     * https://jazz-soft.net/doc/JZZ/jzzmidi.html#tune */
    tune(): Port.Async;
    /** Clock: `[F8]`
     *
     * https://jazz-soft.net/doc/JZZ/jzzmidi.html#clock */
    clock(): Port.Async;
    /** Start: `[FA]`
     *
     * https://jazz-soft.net/doc/JZZ/jzzmidi.html#start */
    start(): Port.Async;
    /** Continue: `[FB]`
     *
     * https://jazz-soft.net/doc/JZZ/jzzmidi.html#continue */
    continue(): Port.Async;
    /** Stop: `[FC]`
     *
     * https://jazz-soft.net/doc/JZZ/jzzmidi.html#stop */
    stop(): Port.Async;
    /** Active sense signal: `[FE]`
     *
     * https://jazz-soft.net/doc/JZZ/jzzmidi.html#active */
    active(): Port.Async;
    /** Reset: `[FF]`
     *
     * https://jazz-soft.net/doc/JZZ/jzzmidi.html#reset */
    reset(): Port.Async;
    /** ID Request SysEx: `[F0 7E 7F 06 01 F7]`
     *
     * https://jazz-soft.net/doc/JZZ/jzzmidi.html#sxIdRequest */
    sxIdRequest(): Port.Async;
    /** MIDI time code (SMPTE quarter frame): `[F1 xx]`
     *
     * https://jazz-soft.net/doc/JZZ/jzzmidi.html#mtc */
    mtc(t: SMPTE): Port.Async;
    /** SMPTE Full Frame SysEx: `[F0 7F 7F 01 01 xx xx xx xx F7]`
     *
     * https://jazz-soft.net/doc/JZZ/jzzmidi.html#sxFullFrame */
    sxFullFrame(t: SMPTE): Port.Async;

    // SMF
    /** Standard MIDI File meta event: [FFxx len data]
     *
     * https://jazz-soft.net/doc/JZZ/jzzmidi.html#smf */
    smf(...args: any): Port.Async;
    /** SMF Sequence Number: [FF00 02 ssss]
     *
     * https://jazz-soft.net/doc/JZZ/jzzmidi.html#smfSeqNumber */
    smfSeqNumber(ssss: number): Port.Async;
    /** SMF Text: [FF01 len text]; used in Karaoke files
     *
     * https://jazz-soft.net/doc/JZZ/jzzmidi.html#smfText */
    smfText(str: string): Port.Async;
    /** SMF Copyright: [FF02 len text]
     *
     * https://jazz-soft.net/doc/JZZ/jzzmidi.html#smfCopyright */
    smfCopyright(str: string): Port.Async;
    /** SMF Sequence Name: [FF03 len text]
     *
     * https://jazz-soft.net/doc/JZZ/jzzmidi.html#smfSeqName */
    smfSeqName(str: string): Port.Async;
    /** SMF Instrument Name: [FF04 len text]
     *
     * https://jazz-soft.net/doc/JZZ/jzzmidi.html#smfInstrName */
    smfInstrName(str: string): Port.Async;
    /** SMF Lyric: [FF05 len text]
     *
     * https://jazz-soft.net/doc/JZZ/jzzmidi.html#smfLyric */
    smfLyric(str: string): Port.Async;
    /** SMF Marker: [FF06 len text]
     *
     * https://jazz-soft.net/doc/JZZ/jzzmidi.html#smfMarker */
    smfMarker(str: string): Port.Async;
    /** SMF Cue Point: [FF07 len text]
     *
     * https://jazz-soft.net/doc/JZZ/jzzmidi.html#smfCuePoint */
    smfCuePoint(str: string): Port.Async;
    /** SMF Program Name: [FF08 len text]
     *
     * https://jazz-soft.net/doc/JZZ/jzzmidi.html#smfProgName */
    smfProgName(str: string): Port.Async;
    /** SMF Device Name: [FF09 len text]
     *
     * https://jazz-soft.net/doc/JZZ/jzzmidi.html#smfDevName */
    smfDevName(str: string): Port.Async;
    /** SMF Channel Prefix: [FF20 01 cc]
     *
     * https://jazz-soft.net/doc/JZZ/jzzmidi.html#smfChannelPrefix */
    smfChannelPrefix(cc: number): Port.Async;
    /** SMF MIDI Port [FF21 01 pp]
     *
     * https://jazz-soft.net/doc/JZZ/jzzmidi.html#smfMidiPort */
    smfMidiPort(pp: number): Port.Async;
    /** SMF End of Track: [FF2F 00]
     *
     * https://jazz-soft.net/doc/JZZ/jzzmidi.html#smfEndOfTrack */
    smfEndOfTrack(): Port.Async;
    /** SMF Tempo: [FF51 03 tttttt]
     *
     * https://jazz-soft.net/doc/JZZ/jzzmidi.html#smfTempo */
    smfTempo(tttttt: number): Port.Async;
    /** SMF Tempo, BMP: [FF51 03 tttttt]
     *
     * https://jazz-soft.net/doc/JZZ/jzzmidi.html#smfBPM */
    smfBPM(bpm: number): Port.Async;
    /** SMF SMPTE offset: [FF54 05 hh mm ss fr ff]
     * 
     * https://jazz-soft.net/doc/JZZ/jzzmidi.html#smfSMPTE */
    smfSMPTE(smpte: SMPTE | number[]): Port.Async;
    /** SMF Time Signature: [FF58 04 nn dd cc bb]
     *
     * https://jazz-soft.net/doc/JZZ/jzzmidi.html#smfTimeSignature */
    smfTimeSignature(nn: number, dd: number, cc?: number, bb?: number): Port.Async;
    /** SMF Key Signature: [FF59 02 sf mi]
     *
     * https://jazz-soft.net/doc/JZZ/jzzmidi.html#smfKeySignature */
    smfKeySignature(key: string): Port.Async;
    /** SMF Sequencer-specific Data: [FF7F len data]
     *
     * https://jazz-soft.net/doc/JZZ/jzzmidi.html#smfSequencer */
    smfSequencer(data: string): Port.Async;
  }

  namespace Channel {
    interface Async extends Channel, PromiseLike<Channel> {}
  }
  interface Channel {
    // Stub
    /** Print if OK
     *
     * https://jazz-soft.net/doc/JZZ/common.html#and */
    and(text: string): Channel.Async;
    /** Execute if OK
     *
     * https://jazz-soft.net/doc/JZZ/common.html#and */
    and(func: (self?: Stub) => void): Channel.Async;
    /** Print if not OK
     *
     * https://jazz-soft.net/doc/JZZ/common.html#or */
    or(text: string): Channel.Async;
    /** Execute if not OK
     *
     * https://jazz-soft.net/doc/JZZ/common.html#or */
    or(func: (self?: Stub) => void): Channel.Async;
    /** Wait `ms` milliseconds
     *
     * https://jazz-soft.net/doc/JZZ/common.html#wait */
    wait(ms: number): Channel.Async;

    // Port
    /** Return an `info` object
     *
     * https://jazz-soft.net/doc/JZZ/midiin.html#info */
    info(): any;
    /** Return the port name
     *
     * https://jazz-soft.net/doc/JZZ/midiin.html#name */
    name(): string;
    /** Connect MIDI port
     *
     * https://jazz-soft.net/doc/JZZ/midiin.html#connect */
    connect(arg: any): Channel.Async;
    /** Disonnect MIDI port
     *
     * https://jazz-soft.net/doc/JZZ/midiin.html#disconnect */
    disconnect(arg?: any): Channel.Async;
    /** Send MIDI message
     *
     * https://jazz-soft.net/doc/JZZ/midiout.html#send */
    send(...args: any[]): Channel.Async;
    /** Emit MIDI message
     *
     * https://jazz-soft.net/doc/JZZ/midithru.html#emit */
    emit(...args: any[]): Channel.Async;
    /** Emit MIDI message
     *
     * https://jazz-soft.net/doc/JZZ/midithru.html#emit */
    _emit(...args: any[]): void;
    /** Close MIDI port
     *
     * https://jazz-soft.net/doc/JZZ/midiin.html#close */
    close(): Stub.Async;

    /** MIDI channel
     *
     * https://jazz-soft.net/doc/JZZ/midiout.html#ch */
    ch(x: number): Channel.Async;
    /** MIDI channel
     *
     * https://jazz-soft.net/doc/JZZ/midiout.html#ch */
    ch(): Port.Async;
    /** MPE channel
     *
     * https://jazz-soft.net/doc/JZZ/midiout.html#mpe */
    mpe(m: number, n: number): MPE.Async;
    /** MPE channel
     *
     * https://jazz-soft.net/doc/JZZ/midiout.html#mpe */
    mpe(): Port.Async;

    /** Play note
     *
     * https://jazz-soft.net/doc/JZZ/midiout.html#note */
    note(nn: number | string, vv?: number, tt?: number): Channel.Async;

    // Channel-dependent
    /** Note On: `[9x nn vv]`; `x`: channel, `nn`: note, `vv`: velocity
     *
     * https://jazz-soft.net/doc/JZZ/jzzmidi.html#noteOn */
    noteOn(nn: number | string, vv?: number): Channel.Async;
    /** Note Off: `[8x nn vv]`; `x`: channel, `nn`: note, `vv`: velocity
     *
     * https://jazz-soft.net/doc/JZZ/jzzmidi.html#noteOff */
    noteOff(nn: number | string, vv?: number): Channel.Async;
    /** Polyphonic aftetouch: `[Ax nn vv]`; `x`: channel, `nn`: note, `vv`: value
     *
     * https://jazz-soft.net/doc/JZZ/jzzmidi.html#aftertouch */
    aftertouch(nn: number | string, vv: number): Channel.Async;
    /** MIDI control: `[Bx nn vv]`; `x`: channel, `nn`: function, `vv`: value
     *
     * https://jazz-soft.net/doc/JZZ/jzzmidi.html#control */
    control(nn: number, vv: number): Channel.Async;
    /** Program change: `[Cx nn]`; `x`: channel, `nn`: program
     *
     * https://jazz-soft.net/doc/JZZ/jzzmidi.html#program */
    program(nn: number | string): Channel.Async;
    /** Pressure: `[Dx nn]`; `x`: channel, `nn`: pressure
     *
     * https://jazz-soft.net/doc/JZZ/jzzmidi.html#pressure */
    pressure(nn: number): Channel.Async;
    /** Pitch bend: `[Ex lsb msb]`; `x`: channel, `msb`/`lsb`: most/least significant 7 bits
     *
     * https://jazz-soft.net/doc/JZZ/jzzmidi.html#pitchBend */
    pitchBend(nn: number): Channel.Async;
    /** Bank select MSB: `[Bx 00 nn]`; `x`: channel, `nn`: most significant 7 bits
     *
     * https://jazz-soft.net/doc/JZZ/jzzmidi.html#bankMSB */
    bankMSB(nn: number): Channel.Async;
    /** Bank select LSB: `[Bx 20 nn]`; `x`: channel, `nn`: least significant 7 bits
     *
     * https://jazz-soft.net/doc/JZZ/jzzmidi.html#bankLSB */
    bankLSB(nn: number): Channel.Async;
    /** Modulation MSB: `[Bx 01 nn]`; `x`: channel, `nn`: most significant 7 bits
     *
     * https://jazz-soft.net/doc/JZZ/jzzmidi.html#modMSB */
    modMSB(nn: number): Channel.Async;
    /** Modulation LSB: `[Bx 21 nn]`; `x`: channel, `nn`: least significant 7 bits
     *
     * https://jazz-soft.net/doc/JZZ/jzzmidi.html#modLSB */
    modLSB(nn: number): Channel.Async;
    /** Breath controller MSB: `[Bx 02 nn]`; `x`: channel, `nn`: most significant 7 bits
     *
     * https://jazz-soft.net/doc/JZZ/jzzmidi.html#breathMSB */
    breathMSB(nn: number): Channel.Async;
    /** Breath controller LSB: `[Bx 22 nn]`; `x`: channel, `nn`: least significant 7 bits
     *
     * https://jazz-soft.net/doc/JZZ/jzzmidi.html#breathLSB */
    breathLSB(nn: number): Channel.Async;
    /** Foot controller MSB: `[Bx 04 nn]`; `x`: channel, `nn`: most significant 7 bits
     *
     * https://jazz-soft.net/doc/JZZ/jzzmidi.html#footMSB */
    footMSB(nn: number): Channel.Async;
    /** Foot controller LSB: `[Bx 24 nn]`; `x`: channel, `nn`: least significant 7 bits
     *
     * https://jazz-soft.net/doc/JZZ/jzzmidi.html#footLSB */
    footLSB(nn: number): Channel.Async;
    /** Portamento MSB: `[Bx 05 nn]`; `x`: channel, `nn`: most significant 7 bits
     *
     * https://jazz-soft.net/doc/JZZ/jzzmidi.html#portamentoMSB */
    portamentoMSB(nn: number): Channel.Async;
    /** Portamento LSB: `[Bx 25 nn]`; `x`: channel, `nn`: least significant 7 bits
     *
     * https://jazz-soft.net/doc/JZZ/jzzmidi.html#portamentoLSB */
    portamentoLSB(nn: number): Channel.Async;
    /** Volume MSB: `[Bx 07 nn]`; `x`: channel, `nn`: most significant 7 bits
     *
     * https://jazz-soft.net/doc/JZZ/jzzmidi.html#volumeMSB */
    volumeMSB(nn: number): Channel.Async;
    /** Volume LSB: `[Bx 27 nn]`; `x`: channel, `nn`: least significant 7 bits
     *
     * https://jazz-soft.net/doc/JZZ/jzzmidi.html#volumeLSB */
    volumeLSB(nn: number): Channel.Async;
    /** Balance MSB: `[Bx 08 nn]`; `x`: channel, `nn`: most significant 7 bits
     *
     * https://jazz-soft.net/doc/JZZ/jzzmidi.html#balanceMSB */
    balanceMSB(nn: number): Channel.Async;
    /** Balance LSB: `[Bx 28 nn]`; `x`: channel, `nn`: least significant 7 bits
     *
     * https://jazz-soft.net/doc/JZZ/jzzmidi.html#balanceLSB */
    balanceLSB(nn: number): Channel.Async;
    /** Pan MSB: `[Bx 0A nn]`; `x`: channel, `nn`: most significant 7 bits
     *
     * https://jazz-soft.net/doc/JZZ/jzzmidi.html#panMSB */
    panMSB(nn: number): Channel.Async;
    /** Pan LSB: `[Bx 2A nn]`; `x`: channel, `nn`: least significant 7 bits
     *
     * https://jazz-soft.net/doc/JZZ/jzzmidi.html#panLSB */
    panLSB(nn: number): Channel.Async;
    /** Expression MSB: `[Bx 0B nn]`; `x`: channel, `nn`: most significant 7 bits
     *
     * https://jazz-soft.net/doc/JZZ/jzzmidi.html#expressionMSB */
    expressionMSB(nn: number): Channel.Async;
    /** Expression LSB: `[Bx 2B nn]`; `x`: channel, `nn`: least significant 7 bits
     *
     * https://jazz-soft.net/doc/JZZ/jzzmidi.html#expressionLSB */
    expressionLSB(nn: number): Channel.Async;
    /** Damper on/off: `[Bx 40 nn]`; `x`: channel, `nn`: `bb ? 7f : 00`
     *
     * https://jazz-soft.net/doc/JZZ/jzzmidi.html#damper */
    damper(bb: boolean): Channel.Async;
    /** Portamento on/off: `[Bx 41 nn]`; `x`: channel, `nn`: `bb ? 7f : 00`
     *
     * https://jazz-soft.net/doc/JZZ/jzzmidi.html#portamento */
    portamento(bb: boolean): Channel.Async;
    /** Sostenuto on/off: `[Bx 42 nn]`; `x`: channel, `nn`: `bb ? 7f : 00`
     *
     * https://jazz-soft.net/doc/JZZ/jzzmidi.html#sostenuto */
    sostenuto(bb: boolean): Channel.Async;
    /** Soft on/off: `[Bx 43 nn]`; `x`: channel, `nn`: `bb ? 7f : 00`
     *
     * https://jazz-soft.net/doc/JZZ/jzzmidi.html#soft */
    soft(bb: boolean): Channel.Async;
    /** All sound off: `[Bx 78 00]`; `x`: channel
     *
     * https://jazz-soft.net/doc/JZZ/jzzmidi.html#allSoundOff */
    allSoundOff(): Channel.Async;
    /** All notes off: `[Bx 7B 00]`; `x`: channel
     *
     * https://jazz-soft.net/doc/JZZ/jzzmidi.html#allNotesOff */
    allNotesOff(): Channel.Async;

    // Channel-independent
    /** Song position: `[F2 lsb msb]`; `msb`/`lsb`: most/least significant 7 bits
     *
     * https://jazz-soft.net/doc/JZZ/jzzmidi.html#songPosition */
    songPosition(nn: number): Channel.Async;
    /** Song select: `[F3 nn]`; `nn`: song number
     *
     * https://jazz-soft.net/doc/JZZ/jzzmidi.html#songSelect */
    songSelect(nn: number): Channel.Async;
    /** Tune: `[F6]`
     *
     * https://jazz-soft.net/doc/JZZ/jzzmidi.html#tune */
    tune(): Channel.Async;
    /** Clock: `[F8]`
     *
     * https://jazz-soft.net/doc/JZZ/jzzmidi.html#clock */
    clock(): Channel.Async;
    /** Start: `[FA]`
     *
     * https://jazz-soft.net/doc/JZZ/jzzmidi.html#start */
    start(): Channel.Async;
    /** Continue: `[FB]`
     *
     * https://jazz-soft.net/doc/JZZ/jzzmidi.html#continue */
    continue(): Channel.Async;
    /** Stop: `[FC]`
     *
     * https://jazz-soft.net/doc/JZZ/jzzmidi.html#stop */
    stop(): Channel.Async;
    /** Active sense signal: `[FE]`
     *
     * https://jazz-soft.net/doc/JZZ/jzzmidi.html#active */
    active(): Channel.Async;
    /** Reset: `[FF]`
     *
     * https://jazz-soft.net/doc/JZZ/jzzmidi.html#reset */
    reset(): Channel.Async;
    /** ID Request SysEx: `[F0 7E 7F 06 01 F7]`
     *
     * https://jazz-soft.net/doc/JZZ/jzzmidi.html#sxIdRequest */
    sxIdRequest(): Channel.Async;
    /** MIDI time code (SMPTE quarter frame): `[F1 xx]`
     *
     * https://jazz-soft.net/doc/JZZ/jzzmidi.html#mtc */
    mtc(t: SMPTE): Channel.Async;
    /** SMPTE Full Frame SysEx: `[F0 7F 7F 01 01 xx xx xx xx F7]`
     *
     * https://jazz-soft.net/doc/JZZ/jzzmidi.html#sxFullFrame */
    sxFullFrame(t: SMPTE): Channel.Async;

    // SMF
    /** Standard MIDI File meta event: [FFxx len data]
     *
     * https://jazz-soft.net/doc/JZZ/jzzmidi.html#smf */
    smf(...args: any): Channel.Async;
    /** SMF Sequence Number: [FF00 02 ssss]
     *
     * https://jazz-soft.net/doc/JZZ/jzzmidi.html#smfSeqNumber */
    smfSeqNumber(ssss: number): Channel.Async;
    /** SMF Text: [FF01 len text]; used in Karaoke files
     *
     * https://jazz-soft.net/doc/JZZ/jzzmidi.html#smfText */
    smfText(str: string): Channel.Async;
    /** SMF Copyright: [FF02 len text]
     *
     * https://jazz-soft.net/doc/JZZ/jzzmidi.html#smfCopyright */
    smfCopyright(str: string): Channel.Async;
    /** SMF Sequence Name: [FF03 len text]
     *
     * https://jazz-soft.net/doc/JZZ/jzzmidi.html#smfSeqName */
    smfSeqName(str: string): Channel.Async;
    /** SMF Instrument Name: [FF04 len text]
     *
     * https://jazz-soft.net/doc/JZZ/jzzmidi.html#smfInstrName */
    smfInstrName(str: string): Channel.Async;
    /** SMF Lyric: [FF05 len text]
     *
     * https://jazz-soft.net/doc/JZZ/jzzmidi.html#smfLyric */
    smfLyric(str: string): Channel.Async;
    /** SMF Marker: [FF06 len text]
     *
     * https://jazz-soft.net/doc/JZZ/jzzmidi.html#smfMarker */
    smfMarker(str: string): Channel.Async;
    /** SMF Cue Point: [FF07 len text]
     *
     * https://jazz-soft.net/doc/JZZ/jzzmidi.html#smfCuePoint */
    smfCuePoint(str: string): Channel.Async;
    /** SMF Program Name: [FF08 len text]
     *
     * https://jazz-soft.net/doc/JZZ/jzzmidi.html#smfProgName */
    smfProgName(str: string): Channel.Async;
    /** SMF Device Name: [FF09 len text]
     *
     * https://jazz-soft.net/doc/JZZ/jzzmidi.html#smfDevName */
    smfDevName(str: string): Channel.Async;
    /** SMF Channel Prefix: [FF20 01 cc]
     *
     * https://jazz-soft.net/doc/JZZ/jzzmidi.html#smfChannelPrefix */
    smfChannelPrefix(cc: number): Channel.Async;
    /** SMF MIDI Port [FF21 01 pp]
     *
     * https://jazz-soft.net/doc/JZZ/jzzmidi.html#smfMidiPort */
    smfMidiPort(pp: number): Channel.Async;
    /** SMF End of Track: [FF2F 00]
     *
     * https://jazz-soft.net/doc/JZZ/jzzmidi.html#smfEndOfTrack */
    smfEndOfTrack(): Channel.Async;
    /** SMF Tempo: [FF51 03 tttttt]
     *
     * https://jazz-soft.net/doc/JZZ/jzzmidi.html#smfTempo */
    smfTempo(tttttt: number): Channel.Async;
    /** SMF Tempo, BMP: [FF51 03 tttttt]
     *
     * https://jazz-soft.net/doc/JZZ/jzzmidi.html#smfBPM */
    smfBPM(bpm: number): Channel.Async;
    /** SMF SMPTE offset: [FF54 05 hh mm ss fr ff]
     * 
     * https://jazz-soft.net/doc/JZZ/jzzmidi.html#smfSMPTE */
    smfSMPTE(smpte: SMPTE | number[]): Channel.Async;
    /** SMF Time Signature: [FF58 04 nn dd cc bb]
     *
     * https://jazz-soft.net/doc/JZZ/jzzmidi.html#smfTimeSignature */
    smfTimeSignature(nn: number, dd: number, cc?: number, bb?: number): Channel.Async;
    /** SMF Key Signature: [FF59 02 sf mi]
     *
     * https://jazz-soft.net/doc/JZZ/jzzmidi.html#smfKeySignature */
    smfKeySignature(key: string): Channel.Async;
    /** SMF Sequencer-specific Data: [FF7F len data]
     *
     * https://jazz-soft.net/doc/JZZ/jzzmidi.html#smfSequencer */
    smfSequencer(data: string): Channel.Async;
  }

  namespace MPE {
    interface Async extends MPE, PromiseLike<MPE> {}
  }
  interface MPE {
    // Stub
    /** Print if OK
     *
     * https://jazz-soft.net/doc/JZZ/common.html#and */
    and(text: string): MPE.Async;
    /** Execute if OK
     *
     * https://jazz-soft.net/doc/JZZ/common.html#and */
    and(func: (self?: Stub) => void): MPE.Async;
    /** Print if not OK
     *
     * https://jazz-soft.net/doc/JZZ/common.html#or */
    or(text: string): MPE.Async;
    /** Execute if not OK
     *
     * https://jazz-soft.net/doc/JZZ/common.html#or */
    or(func: (self?: Stub) => void): MPE.Async;
    /** Wait `ms` milliseconds
     *
     * https://jazz-soft.net/doc/JZZ/common.html#wait */
    wait(ms: number): MPE.Async;

    // Port
    /** Return an `info` object
     *
     * https://jazz-soft.net/doc/JZZ/midiin.html#info */
    info(): any;
    /** Return the port name
     *
     * https://jazz-soft.net/doc/JZZ/midiin.html#name */
    name(): string;
    /** Connect MIDI port
     *
     * https://jazz-soft.net/doc/JZZ/midiin.html#connect */
    connect(arg: any): MPE.Async;
    /** Disonnect MIDI port
     *
     * https://jazz-soft.net/doc/JZZ/midiin.html#disconnect */
    disconnect(arg?: any): MPE.Async;
    /** Send MIDI message
     *
     * https://jazz-soft.net/doc/JZZ/midiout.html#send */
    send(...args: any[]): MPE.Async;
    /** Emit MIDI message
     *
     * https://jazz-soft.net/doc/JZZ/midithru.html#emit */
    emit(...args: any[]): MPE.Async;
    /** Emit MIDI message
     *
     * https://jazz-soft.net/doc/JZZ/midithru.html#emit */
    _emit(...args: any[]): void;
    /** Close MIDI port
     *
     * https://jazz-soft.net/doc/JZZ/midiin.html#close */
    close(): Stub.Async;

    /** MIDI channel
     *
     * https://jazz-soft.net/doc/JZZ/midiout.html#ch */
    ch(x: number): Channel.Async;
    /** MIDI channel
     *
     * https://jazz-soft.net/doc/JZZ/midiout.html#ch */
    ch(): Port.Async;
    /** MPE channel
     *
     * https://jazz-soft.net/doc/JZZ/midiout.html#mpe */
    mpe(m: number, n: number): MPE.Async;
    /** MPE channel
     *
     * https://jazz-soft.net/doc/JZZ/midiout.html#mpe */
    mpe(): Port.Async;

    /** Play note
     *
     * https://jazz-soft.net/doc/JZZ/midiout.html#note */
    note(nn: number | string, vv?: number, tt?: number): MPE.Async;

    // Channel-dependent
    /** Note On: `[9x nn vv]`; `x`: channel, `nn`: note, `vv`: velocity
     *
     * https://jazz-soft.net/doc/JZZ/jzzmidi.html#noteOn */
    noteOn(nn: number | string, vv?: number): MPE.Async;
    /** Note Off: `[8x nn vv]`; `x`: channel, `nn`: note, `vv`: velocity
     *
     * https://jazz-soft.net/doc/JZZ/jzzmidi.html#noteOff */
    noteOff(nn: number | string, vv?: number): MPE.Async;
    /** Polyphonic aftetouch: `[Ax nn vv]`; `x`: channel, `nn`: note, `vv`: value
     *
     * https://jazz-soft.net/doc/JZZ/jzzmidi.html#aftertouch */
    aftertouch(nn: number | string, vv: number): MPE.Async;
    /** MIDI control: `[Bx nn vv]`; `x`: channel, `nn`: function, `vv`: value
     *
     * https://jazz-soft.net/doc/JZZ/jzzmidi.html#control */
    control(nn: number, vv: number): MPE.Async;
    /** Program change: `[Cx nn]`; `x`: channel, `nn`: program
     *
     * https://jazz-soft.net/doc/JZZ/jzzmidi.html#program */
    program(nn: number | string): MPE.Async;
    /** Pressure: `[Dx nn]`; `x`: channel, `nn`: pressure
     *
     * https://jazz-soft.net/doc/JZZ/jzzmidi.html#pressure */
    pressure(nn: number): MPE.Async;
    /** Pitch bend: `[Ex lsb msb]`; `x`: channel, `msb`/`lsb`: most/least significant 7 bits
     *
     * https://jazz-soft.net/doc/JZZ/jzzmidi.html#pitchBend */
    pitchBend(nn: number): MPE.Async;
    /** Bank select MSB: `[Bx 00 nn]`; `x`: channel, `nn`: most significant 7 bits
     *
     * https://jazz-soft.net/doc/JZZ/jzzmidi.html#bankMSB */
    bankMSB(nn: number): MPE.Async;
    /** Bank select LSB: `[Bx 20 nn]`; `x`: channel, `nn`: least significant 7 bits
     *
     * https://jazz-soft.net/doc/JZZ/jzzmidi.html#bankLSB */
    bankLSB(nn: number): MPE.Async;
    /** Modulation MSB: `[Bx 01 nn]`; `x`: channel, `nn`: most significant 7 bits
     *
     * https://jazz-soft.net/doc/JZZ/jzzmidi.html#modMSB */
    modMSB(nn: number): MPE.Async;
    /** Modulation LSB: `[Bx 21 nn]`; `x`: channel, `nn`: least significant 7 bits
     *
     * https://jazz-soft.net/doc/JZZ/jzzmidi.html#modLSB */
    modLSB(nn: number): MPE.Async;
    /** Breath controller MSB: `[Bx 02 nn]`; `x`: channel, `nn`: most significant 7 bits
     *
     * https://jazz-soft.net/doc/JZZ/jzzmidi.html#breathMSB */
    breathMSB(nn: number): MPE.Async;
    /** Breath controller LSB: `[Bx 22 nn]`; `x`: channel, `nn`: least significant 7 bits
     *
     * https://jazz-soft.net/doc/JZZ/jzzmidi.html#breathLSB */
    breathLSB(nn: number): MPE.Async;
    /** Foot controller MSB: `[Bx 04 nn]`; `x`: channel, `nn`: most significant 7 bits
     *
     * https://jazz-soft.net/doc/JZZ/jzzmidi.html#footMSB */
    footMSB(nn: number): MPE.Async;
    /** Foot controller LSB: `[Bx 24 nn]`; `x`: channel, `nn`: least significant 7 bits
     *
     * https://jazz-soft.net/doc/JZZ/jzzmidi.html#footLSB */
    footLSB(nn: number): MPE.Async;
    /** Portamento MSB: `[Bx 05 nn]`; `x`: channel, `nn`: most significant 7 bits
     *
     * https://jazz-soft.net/doc/JZZ/jzzmidi.html#portamentoMSB */
    portamentoMSB(nn: number): MPE.Async;
    /** Portamento LSB: `[Bx 25 nn]`; `x`: channel, `nn`: least significant 7 bits
     *
     * https://jazz-soft.net/doc/JZZ/jzzmidi.html#portamentoLSB */
    portamentoLSB(nn: number): MPE.Async;
    /** Volume MSB: `[Bx 07 nn]`; `x`: channel, `nn`: most significant 7 bits
     *
     * https://jazz-soft.net/doc/JZZ/jzzmidi.html#volumeMSB */
    volumeMSB(nn: number): MPE.Async;
    /** Volume LSB: `[Bx 27 nn]`; `x`: channel, `nn`: least significant 7 bits
     *
     * https://jazz-soft.net/doc/JZZ/jzzmidi.html#volumeLSB */
    volumeLSB(nn: number): MPE.Async;
    /** Balance MSB: `[Bx 08 nn]`; `x`: channel, `nn`: most significant 7 bits
     *
     * https://jazz-soft.net/doc/JZZ/jzzmidi.html#balanceMSB */
    balanceMSB(nn: number): MPE.Async;
    /** Balance LSB: `[Bx 28 nn]`; `x`: channel, `nn`: least significant 7 bits
     *
     * https://jazz-soft.net/doc/JZZ/jzzmidi.html#balanceLSB */
    balanceLSB(nn: number): MPE.Async;
    /** Pan MSB: `[Bx 0A nn]`; `x`: channel, `nn`: most significant 7 bits
     *
     * https://jazz-soft.net/doc/JZZ/jzzmidi.html#panMSB */
    panMSB(nn: number): MPE.Async;
    /** Pan LSB: `[Bx 2A nn]`; `x`: channel, `nn`: least significant 7 bits
     *
     * https://jazz-soft.net/doc/JZZ/jzzmidi.html#panLSB */
    panLSB(nn: number): MPE.Async;
    /** Expression MSB: `[Bx 0B nn]`; `x`: channel, `nn`: most significant 7 bits
     *
     * https://jazz-soft.net/doc/JZZ/jzzmidi.html#expressionMSB */
    expressionMSB(nn: number): MPE.Async;
    /** Expression LSB: `[Bx 2B nn]`; `x`: channel, `nn`: least significant 7 bits
     *
     * https://jazz-soft.net/doc/JZZ/jzzmidi.html#expressionLSB */
    expressionLSB(nn: number): MPE.Async;
    /** Damper on/off: `[Bx 40 nn]`; `x`: channel, `nn`: `bb ? 7f : 00`
     *
     * https://jazz-soft.net/doc/JZZ/jzzmidi.html#damper */
    damper(bb: boolean): MPE.Async;
    /** Portamento on/off: `[Bx 41 nn]`; `x`: channel, `nn`: `bb ? 7f : 00`
     *
     * https://jazz-soft.net/doc/JZZ/jzzmidi.html#portamento */
    portamento(bb: boolean): MPE.Async;
    /** Sostenuto on/off: `[Bx 42 nn]`; `x`: channel, `nn`: `bb ? 7f : 00`
     *
     * https://jazz-soft.net/doc/JZZ/jzzmidi.html#sostenuto */
    sostenuto(bb: boolean): MPE.Async;
    /** Soft on/off: `[Bx 43 nn]`; `x`: channel, `nn`: `bb ? 7f : 00`
     *
     * https://jazz-soft.net/doc/JZZ/jzzmidi.html#soft */
    soft(bb: boolean): MPE.Async;
    /** All sound off: `[Bx 78 00]`; `x`: channel
     *
     * https://jazz-soft.net/doc/JZZ/jzzmidi.html#allSoundOff */
    allSoundOff(): MPE.Async;
    /** All notes off: `[Bx 7B 00]`; `x`: channel
     *
     * https://jazz-soft.net/doc/JZZ/jzzmidi.html#allNotesOff */
    allNotesOff(): MPE.Async;

    // Channel-independent
    /** Song position: `[F2 lsb msb]`; `msb`/`lsb`: most/least significant 7 bits
     *
     * https://jazz-soft.net/doc/JZZ/jzzmidi.html#songPosition */
    songPosition(nn: number): MPE.Async;
    /** Song select: `[F3 nn]`; `nn`: song number
     *
     * https://jazz-soft.net/doc/JZZ/jzzmidi.html#songSelect */
    songSelect(nn: number): MPE.Async;
    /** Tune: `[F6]`
     *
     * https://jazz-soft.net/doc/JZZ/jzzmidi.html#tune */
    tune(): MPE.Async;
    /** Clock: `[F8]`
     *
     * https://jazz-soft.net/doc/JZZ/jzzmidi.html#clock */
    clock(): MPE.Async;
    /** Start: `[FA]`
     *
     * https://jazz-soft.net/doc/JZZ/jzzmidi.html#start */
    start(): MPE.Async;
    /** Continue: `[FB]`
     *
     * https://jazz-soft.net/doc/JZZ/jzzmidi.html#continue */
    continue(): MPE.Async;
    /** Stop: `[FC]`
     *
     * https://jazz-soft.net/doc/JZZ/jzzmidi.html#stop */
    stop(): MPE.Async;
    /** Active sense signal: `[FE]`
     *
     * https://jazz-soft.net/doc/JZZ/jzzmidi.html#active */
    active(): MPE.Async;
    /** Reset: `[FF]`
     *
     * https://jazz-soft.net/doc/JZZ/jzzmidi.html#reset */
    reset(): MPE.Async;
    /** ID Request SysEx: `[F0 7E 7F 06 01 F7]`
     *
     * https://jazz-soft.net/doc/JZZ/jzzmidi.html#sxIdRequest */
    sxIdRequest(): MPE.Async;
    /** MIDI time code (SMPTE quarter frame): `[F1 xx]`
     *
     * https://jazz-soft.net/doc/JZZ/jzzmidi.html#mtc */
    mtc(t: SMPTE): MPE.Async;
    /** SMPTE Full Frame SysEx: `[F0 7F 7F 01 01 xx xx xx xx F7]`
     *
     * https://jazz-soft.net/doc/JZZ/jzzmidi.html#sxFullFrame */
    sxFullFrame(t: SMPTE): MPE.Async;

    // SMF
    /** Standard MIDI File meta event: [FFxx len data]
     *
     * https://jazz-soft.net/doc/JZZ/jzzmidi.html#smf */
    smf(...args: any): MPE.Async;
    /** SMF Sequence Number: [FF00 02 ssss]
     *
     * https://jazz-soft.net/doc/JZZ/jzzmidi.html#smfSeqNumber */
    smfSeqNumber(ssss: number): MPE.Async;
    /** SMF Text: [FF01 len text]; used in Karaoke files
     *
     * https://jazz-soft.net/doc/JZZ/jzzmidi.html#smfText */
    smfText(str: string): MPE.Async;
    /** SMF Copyright: [FF02 len text]
     *
     * https://jazz-soft.net/doc/JZZ/jzzmidi.html#smfCopyright */
    smfCopyright(str: string): MPE.Async;
    /** SMF Sequence Name: [FF03 len text]
     *
     * https://jazz-soft.net/doc/JZZ/jzzmidi.html#smfSeqName */
    smfSeqName(str: string): MPE.Async;
    /** SMF Instrument Name: [FF04 len text]
     *
     * https://jazz-soft.net/doc/JZZ/jzzmidi.html#smfInstrName */
    smfInstrName(str: string): MPE.Async;
    /** SMF Lyric: [FF05 len text]
     *
     * https://jazz-soft.net/doc/JZZ/jzzmidi.html#smfLyric */
    smfLyric(str: string): MPE.Async;
    /** SMF Marker: [FF06 len text]
     *
     * https://jazz-soft.net/doc/JZZ/jzzmidi.html#smfMarker */
    smfMarker(str: string): MPE.Async;
    /** SMF Cue Point: [FF07 len text]
     *
     * https://jazz-soft.net/doc/JZZ/jzzmidi.html#smfCuePoint */
    smfCuePoint(str: string): MPE.Async;
    /** SMF Program Name: [FF08 len text]
     *
     * https://jazz-soft.net/doc/JZZ/jzzmidi.html#smfProgName */
    smfProgName(str: string): MPE.Async;
    /** SMF Device Name: [FF09 len text]
     *
     * https://jazz-soft.net/doc/JZZ/jzzmidi.html#smfDevName */
    smfDevName(str: string): MPE.Async;
    /** SMF Channel Prefix: [FF20 01 cc]
     *
     * https://jazz-soft.net/doc/JZZ/jzzmidi.html#smfChannelPrefix */
    smfChannelPrefix(cc: number): MPE.Async;
    /** SMF MIDI Port [FF21 01 pp]
     *
     * https://jazz-soft.net/doc/JZZ/jzzmidi.html#smfMidiPort */
    smfMidiPort(pp: number): MPE.Async;
    /** SMF End of Track: [FF2F 00]
     *
     * https://jazz-soft.net/doc/JZZ/jzzmidi.html#smfEndOfTrack */
    smfEndOfTrack(): MPE.Async;
    /** SMF Tempo: [FF51 03 tttttt]
     *
     * https://jazz-soft.net/doc/JZZ/jzzmidi.html#smfTempo */
    smfTempo(tttttt: number): MPE.Async;
    /** SMF Tempo, BMP: [FF51 03 tttttt]
     *
     * https://jazz-soft.net/doc/JZZ/jzzmidi.html#smfBPM */
    smfBPM(bpm: number): MPE.Async;
    /** SMF SMPTE offset: [FF54 05 hh mm ss fr ff]
     * 
     * https://jazz-soft.net/doc/JZZ/jzzmidi.html#smfSMPTE */
    smfSMPTE(smpte: SMPTE | number[]): MPE.Async;
    /** SMF Time Signature: [FF58 04 nn dd cc bb]
     *
     * https://jazz-soft.net/doc/JZZ/jzzmidi.html#smfTimeSignature */
    smfTimeSignature(nn: number, dd: number, cc?: number, bb?: number): MPE.Async;
    /** SMF Key Signature: [FF59 02 sf mi]
     *
     * https://jazz-soft.net/doc/JZZ/jzzmidi.html#smfKeySignature */
    smfKeySignature(key: string): MPE.Async;
    /** SMF Sequencer-specific Data: [FF7F len data]
     *
     * https://jazz-soft.net/doc/JZZ/jzzmidi.html#smfSequencer */
    smfSequencer(data: string): MPE.Async;
  }

  namespace Watcher {
    interface Async extends Watcher, PromiseLike<Watcher> {}
  }
  interface Watcher extends Engine {
    /** Add the Watcher handle
     *
     * https://jazz-soft.net/doc/JZZ/jzz.html#connect */
    connect(...args: any[]): Watcher.Async;
    /** Remove the Watcher handle
     *
     * https://jazz-soft.net/doc/JZZ/jzz.html#disconnect */
    disconnect(...args: any[]): Watcher.Async;
  }

  interface lib {
    /** Open virtual MIDI-In port
     *
     * https://jazz-soft.net/doc/JZZ/lib.html#openMidiIn */
    openMidiIn(...args: any[]): boolean;
    /** Open virtual MIDI-Out port
     *
     * https://jazz-soft.net/doc/JZZ/lib.html#openMidiOut */
    openMidiOut(...args: any[]): boolean;
    /** Register virtual MIDI-In port
     *
     * https://jazz-soft.net/doc/JZZ/lib.html#registerMidiIn */
    registerMidiIn(...args: any[]): boolean;
    /** Register virtual MIDI-Out port
     *
     * https://jazz-soft.net/doc/JZZ/lib.html#registerMidiOut */
    registerMidiOut(...args: any[]): boolean;
    /** Activate and return window.AudioContext
     *
     * https://jazz-soft.net/doc/JZZ/lib.html#getAudioContext */
    getAudioContext(): any;
    /** Encode string to Base64
     *
     * https://jazz-soft.net/doc/JZZ/lib.html#toBase64 */
    toBase64(txt: string): string;
    /** Decode string from Base64
     *
     * https://jazz-soft.net/doc/JZZ/lib.html#fromBase64 */
    fromBase64(txt: string): string;
    /** Encode string to UTF8
     *
     * https://jazz-soft.net/doc/JZZ/lib.html#toUTF8 */
    toUTF8(txt: string): string;
    /** Decode string from UTF8
     *
     * https://jazz-soft.net/doc/JZZ/lib.html#fromUTF8 */
    fromUTF8(txt: string): string;
  }
}

interface JZZ {
  readonly lib: JZZ.lib;
  /** Start MIDI engine
   *
   * https://jazz-soft.net/doc/JZZ/jzz.html#jzz */
  (arg?: any): JZZ.Engine.Async;
  /** Return an `info` object
   *
   * https://jazz-soft.net/doc/JZZ/jzz.html#info */
  readonly info: () => any;
  /** Create virtual MIDI port
   *
   * https://jazz-soft.net/doc/JZZ/midithru.html#Widget */
  readonly Widget: (...args: any[]) => JZZ.Port;
  /** MIDI message
   *
   * https://jazz-soft.net/doc/JZZ/jzzmidi.html */
  readonly MIDI: JZZ.MIDI.Constructor;
  /** SMPTE message
   *
   * https://jazz-soft.net/doc/JZZ/smpte.html */
  readonly SMPTE: JZZ.SMPTE.Constructor;
  /** Invoke Web MIDI API
   *
   * https://jazz-soft.net/doc/JZZ/webmidi.html */
  readonly requestMIDIAccess: (options?: WebMidi.MIDIOptions) => Promise<WebMidi.MIDIAccess>;
}
declare const jzz: JZZ;

export = jzz;
