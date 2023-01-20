import EventEmitter from 'events';

export default class AudioPlayer extends EventEmitter {
  private audioContext: AudioContext;
  private gainNode: GainNode;
  private pannerNode: StereoPannerNode;
  private audioElement: HTMLAudioElement;

  constructor() {
    super();

    this.audioContext = new AudioContext();
    this.gainNode = this.audioContext.createGain();
    this.pannerNode = this.audioContext.createStereoPanner();
    this.audioElement = new Audio();
    const source = this.audioContext.createMediaElementSource(
      this.audioElement,
    );
    source
      .connect(this.pannerNode)
      .connect(this.gainNode)
      .connect(this.audioContext.destination);

    this.audioElement.onended = (...args) => {
      this.emit('ended', ...args);
    };
  }

  setAudioSource(url: string) {
    this.audioElement.src = url;
  }

  play() {
    if (this.audioContext.state === 'suspended') {
      this.audioContext.resume();
    }

    this.audioElement.play();
  }

  pause() {
    this.audioElement.pause();
  }

  stop() {
    this.audioElement.pause();
    this.audioElement.currentTime = 0;
  }

  setPlaybackRate(rate: number) {
    this.audioElement.playbackRate = rate;
  }

  setVolume(volume: number) {
    this.gainNode.gain.value = volume;
  }

  setPan(pan: number) {
    this.pannerNode.pan.value = pan;
  }

  rewind(seconds: number) {
    this.audioElement.currentTime -= seconds;
  }

  forward(seconds: number) {
    this.audioElement.currentTime += seconds;
  }

  seek(seconds: number) {
    this.audioElement.currentTime = seconds;
  }
}
