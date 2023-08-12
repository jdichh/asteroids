import { CANVAS } from "./canvasUtils.js";
import soundManager from "./classes/soundEffectsManager.js";

soundManager.preloadSound("FIRE_SOUND", "./assets/sounds/fire.mp3");
soundManager.preloadSound("ASTEROID_HIT", "./assets/sounds/bangMedium.mp3");

export const musicFiles = [
  "./assets/music/music1.mp3",
  "./assets/music/music2.mp3",
  "./assets/music/music3.mp3",
  "./assets/music/music4.mp3",
  "./assets/music/music5.mp3",
  "./assets/music/music6.mp3",
];

export const preloadedMusicFiles = musicFiles.map((musicFile) => {
  const audio = new Audio();
  audio.src = musicFile;
  audio.preload = "auto";
  return audio;
});

export let currentMusicIndex = Math.floor(Math.random() * musicFiles.length);
export let MUSIC = preloadedMusicFiles[currentMusicIndex];
export let isMusicPlaying = true;

const musicToggleButton = document.createElement("button");
musicToggleButton.setAttribute("id", "music-toggle-button");
musicToggleButton.addEventListener("click", toggleMusic);

const iconElement = document.createElement("i");
iconElement.classList.add("fas", "fa-music", "fa-sm");
musicToggleButton.appendChild(iconElement);

const volumeSlider = document.createElement("input");
volumeSlider.setAttribute("id", "volume-slider");
volumeSlider.setAttribute("type", "range");
volumeSlider.setAttribute("min", "0");
volumeSlider.setAttribute("max", "1");
volumeSlider.setAttribute("step", "0.01");
volumeSlider.setAttribute("value", "0.1");
volumeSlider.addEventListener("input", updateVolume);

CANVAS.parentNode.appendChild(musicToggleButton);
CANVAS.parentNode.appendChild(volumeSlider);

// Default volume in case the user has autoplay enabled to prevent the user to be deaf after the page loads.
MUSIC.volume = 0.1;

// Set the initial volume based on the slider value.
export function updateVolume() {
  const volume = parseFloat(volumeSlider.value);
  MUSIC.volume = volume;
}

// MUSIC.playbackRate is for testing purposes.
function startMusic() {
  currentMusicIndex = Math.floor(Math.random() * musicFiles.length);
  MUSIC = preloadedMusicFiles[currentMusicIndex];
  MUSIC.currentTime = 0;
  MUSIC.volume = 0.1;
  // MUSIC.playbackRate = 3.5
  MUSIC.addEventListener("ended", playNextTrack);
  if (isMusicPlaying) {
    MUSIC.play();
  }
}

export function playNextTrack() {
  MUSIC.removeEventListener("ended", playNextTrack);
  currentMusicIndex = (currentMusicIndex + 1) % musicFiles.length;
  MUSIC = preloadedMusicFiles[currentMusicIndex];
  MUSIC.currentTime = 0;
  MUSIC.volume = 0.1;
  // MUSIC.playbackRate = 3.5
  MUSIC.addEventListener("ended", playNextTrack);
  if (isMusicPlaying) {
    MUSIC.play();
  }
}

startMusic();

function toggleMusic() {
  if (isMusicPlaying) {
    MUSIC.pause();
    iconElement.classList.remove("fas", "fa-music", "fa-sm");
    iconElement.classList.remove("fas", "fa-play", "fa-sm");
    iconElement.classList.add("fas", "fa-stop", "fa-sm");
  } else {
    if (!MUSIC.paused) {
      playNextTrack();
    } else {
      playNextTrack();
      MUSIC.play();
      iconElement.classList.remove("fas", "fa-music", "fa-sm");
      iconElement.classList.remove("fas", "fa-stop", "fa-sm");
      iconElement.classList.add("fas", "fa-play", "fa-sm");
    }
  }
  isMusicPlaying = !isMusicPlaying;
  updateVolume();
}
