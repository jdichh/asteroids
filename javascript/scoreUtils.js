import { CANVAS, CONTEXT } from "./canvasUtils.js";

export let score = 0;

export function increaseScore(points) {
  score += points;
}

export function resetScore() {
  score = 0; // Reset the score
}

export function scoreBoard() {
  CONTEXT.fillStyle = "rgb(220, 220, 220)";
  CONTEXT.font = "16px monospace";
  CONTEXT.fillText(`SCORE: ${score}`, CANVAS.width / 2 - 37.5, 25);
}
