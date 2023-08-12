import { CANVAS } from "./canvas.js";
import soundManager from "./classes/soundEffectsManager.js";

soundManager.preloadSound("FIRE_SOUND", "./assets/sounds/fire.mp3");
soundManager.preloadSound("ASTEROID_HIT", "./assets/sounds/bangMedium.mp3");

const musicFiles = [
  "./assets/music/music1.mp3",
  "./assets/music/music2.mp3",
  "./assets/music/music3.mp3",
  "./assets/music/music4.mp3",
  "./assets/music/music5.mp3",
  "./assets/music/music6.mp3",
];

const preloadedMusicFiles = musicFiles.map((musicFile) => {
  const audio = new Audio();
  audio.src = musicFile;
  audio.preload = "auto";
  return audio;
});

let currentMusicIndex = Math.floor(Math.random() * musicFiles.length);
let MUSIC = preloadedMusicFiles[currentMusicIndex];
let isMusicPlaying = false;

const musicToggleButton = document.createElement("button");
musicToggleButton.setAttribute("id", "music-toggle-button");
musicToggleButton.addEventListener("click", toggleMusic);

const iconElement = document.createElement("i");
iconElement.classList.add("fas");
iconElement.classList.add("fa-stop");

// Append the icon element to the button
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

// Default volume in case the user has autoplay enabled to prevent deafening on window load.
MUSIC.volume = 0.1;

// Set the initial volume based on the slider value.
export function updateVolume() {
  const volume = parseFloat(volumeSlider.value);
  MUSIC.volume = volume;
}

export function toggleMusic() {
  if (isMusicPlaying) {
    MUSIC.play();
    iconElement.classList.remove("fa-stop");
    iconElement.classList.add("fa-play");
  } else {
    MUSIC.pause();
    iconElement.classList.remove("fa-play");
    iconElement.classList.add("fa-stop");
  }
  isMusicPlaying = !isMusicPlaying;
  updateVolume();
}

export function playNextTrack() {
  currentMusicIndex = (currentMusicIndex + 1) % musicFiles.length;
  MUSIC = preloadedMusicFiles[currentMusicIndex];
  MUSIC.currentTime = 0;
  MUSIC.volume = 0.1;
  MUSIC.play();
}

// Check if the current track has ended and play the next track if needed.
MUSIC.addEventListener("ended", () => {
  playNextTrack();
});

// Autoplay the first track when the page loads.
MUSIC.play();
