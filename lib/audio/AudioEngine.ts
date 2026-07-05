"use client";

/**
 * Procedural noir ambience — NO audio files, everything synthesized:
 *  - rain: looped white-noise buffer → bandpass + lowpass, with a slow LFO
 *    on the bandpass frequency (gusting)
 *  - thunder: brown-noise burst → deep lowpass → long exponential decay,
 *    randomly panned, scheduled every 25–60s (also triggerable by lightning)
 *
 * start() MUST be called from a user gesture (autoplay policy).
 * Module singleton — never store this in React state.
 */
class AudioEngine {
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  private thunderTimer: ReturnType<typeof setTimeout> | null = null;
  private stopTimer: ReturnType<typeof setTimeout> | null = null;
  private closingCtx: AudioContext | null = null;
  private onVis = () => {
    if (!this.ctx) return;
    if (document.hidden) void this.ctx.suspend();
    else void this.ctx.resume();
  };

  get running() {
    return !!this.ctx;
  }

  async start() {
    if (this.ctx) return; // idempotent
    // a previous stop() may still be fading out — close its context NOW so
    // rapid toggling can't accumulate live AudioContexts (browsers cap ~6)
    if (this.stopTimer) {
      clearTimeout(this.stopTimer);
      this.stopTimer = null;
    }
    if (this.closingCtx) {
      void this.closingCtx.close();
      this.closingCtx = null;
    }
    const ctx = new AudioContext();
    this.ctx = ctx;
    if (ctx.state === "suspended") await ctx.resume();
    // stop() ran while we awaited? abort — it already closed this context.
    if (this.ctx !== ctx) return;

    const master = ctx.createGain();
    master.gain.setValueAtTime(0, ctx.currentTime);
    master.gain.linearRampToValueAtTime(0.4, ctx.currentTime + 1.5);
    master.connect(ctx.destination);
    this.master = master;

    this.buildRain(ctx, master);
    this.scheduleThunder(8_000, 20_000); // first rumble comes fairly soon
    document.addEventListener("visibilitychange", this.onVis);
  }

  stop() {
    const ctx = this.ctx;
    if (!ctx) return;
    document.removeEventListener("visibilitychange", this.onVis);
    if (this.thunderTimer) clearTimeout(this.thunderTimer);
    this.thunderTimer = null;

    if (!this.master) {
      // start() is mid-await (graph not built yet) — close immediately;
      // start() notices this.ctx changed and aborts.
      this.ctx = null;
      void ctx.close();
      return;
    }

    this.master.gain.cancelScheduledValues(ctx.currentTime);
    this.master.gain.setValueAtTime(this.master.gain.value, ctx.currentTime);
    this.master.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.8);
    this.ctx = null;
    this.master = null;
    this.closingCtx = ctx;
    this.stopTimer = setTimeout(() => {
      void ctx.close();
      this.closingCtx = null;
      this.stopTimer = null;
    }, 900);
  }

  /** Public one-shot — SheetLightning calls this after a flash. */
  thunder(delayS = 0) {
    const ctx = this.ctx;
    const master = this.master;
    if (!ctx || !master) return;
    const t0 = ctx.currentTime + delayS;

    const dur = 4 + Math.random() * 3;
    const buffer = ctx.createBuffer(1, ctx.sampleRate * dur, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    let lastValue = 0;
    for (let i = 0; i < data.length; i++) {
      const white = Math.random() * 2 - 1;
      lastValue = (lastValue + 0.02 * white) / 1.02; // brown noise
      data[i] = lastValue * 3.5;
    }

    const src = ctx.createBufferSource();
    src.buffer = buffer;
    const lp = ctx.createBiquadFilter();
    lp.type = "lowpass";
    lp.frequency.value = 160;
    const env = ctx.createGain();
    env.gain.setValueAtTime(0, t0);
    env.gain.linearRampToValueAtTime(0.5 + Math.random() * 0.4, t0 + 0.15);
    env.gain.exponentialRampToValueAtTime(0.001, t0 + dur);
    const pan = ctx.createStereoPanner();
    pan.pan.value = Math.random() * 1.6 - 0.8;

    src.connect(lp).connect(env).connect(pan).connect(master);
    src.start(t0);
    src.stop(t0 + dur + 0.1);
    src.onended = () => {
      src.disconnect();
      lp.disconnect();
      env.disconnect();
      pan.disconnect();
    };
  }

  private buildRain(ctx: AudioContext, master: GainNode) {
    // 2s looping white-noise buffer
    const buffer = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
    const src = ctx.createBufferSource();
    src.buffer = buffer;
    src.loop = true;

    const band = ctx.createBiquadFilter();
    band.type = "bandpass";
    band.frequency.value = 900;
    band.Q.value = 0.6;
    const low = ctx.createBiquadFilter();
    low.type = "lowpass";
    low.frequency.value = 2400;
    const rainGain = ctx.createGain();
    rainGain.gain.value = 0.5;

    // slow gusting: LFO wobbles the bandpass center
    const lfo = ctx.createOscillator();
    lfo.frequency.value = 0.07;
    const lfoAmp = ctx.createGain();
    lfoAmp.gain.value = 150;
    lfo.connect(lfoAmp).connect(band.frequency);
    lfo.start();

    src.connect(band).connect(low).connect(rainGain).connect(master);
    src.start();
  }

  private scheduleThunder(minMs = 25_000, maxMs = 60_000) {
    if (!this.ctx) return;
    this.thunderTimer = setTimeout(
      () => {
        this.thunder();
        this.scheduleThunder();
      },
      minMs + Math.random() * (maxMs - minMs),
    );
  }
}

export const audioEngine = new AudioEngine();
