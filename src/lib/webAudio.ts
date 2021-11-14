const audioContext = new AudioContext();

const gainNode = audioContext.createGain();
const pannerNode = audioContext.createStereoPanner();

function setAudioSourceFromElement(elem: HTMLAudioElement) {
  const source = audioContext.createMediaElementSource(elem);
  source.connect(gainNode).connect(audioContext.destination);
}

function play(elem: HTMLAudioElement) {
  if (audioContext.state === 'suspended') {
    audioContext.resume();
  }

  elem.play();
}

function pause(elem: HTMLAudioElement) {
  elem.pause();
}

function stop(elem: HTMLAudioElement) {
  elem.pause();
  elem.currentTime = 0;
}

function setVolume(volume: number) {
  gainNode.gain.value = volume;
}

function setPan(pan: number) {
  pannerNode.pan.value = pan;
}
