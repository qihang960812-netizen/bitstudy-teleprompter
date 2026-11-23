class MicrophoneInput extends AudioWorkletProcessor {
  constructor(options) {
    super();
    this.pcm16 = options.processorOptions?.pcm16 === true;
    this.Block = this.pcm16 ? Int16Array : Float32Array;
    this.length = Math.round(sampleRate * (this.pcm16 ? 0.04 : 0.125));
    this.buffer = new this.Block(this.length);
    this.offset = 0;
  }

  process(inputs) {
    const channel = inputs[0]?.[0];
    if (!channel) return true;
    for (const sample of channel) {
      const value = sample * 32768;
      this.buffer[this.offset++] = this.pcm16 ? Math.max(-32768, Math.min(32767, value)) : value;
      if (this.offset === this.length) {
        this.port.postMessage(this.buffer, [this.buffer.buffer]);
        this.buffer = new this.Block(this.length);
        this.offset = 0;
      }
    }
    return true;
  }
}
registerProcessor('prompter-microphone', MicrophoneInput);
