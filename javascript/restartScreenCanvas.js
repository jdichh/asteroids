import { CANVAS, CONTEXT } from "./canvasUtils.js";
import { score } from "./scoreUtils.js";

export function drawRestartScreenInfo(){
    CONTEXT.fillStyle = "rgb(16, 16, 16)";
    CONTEXT.fillRect(0, 0, CANVAS.width, CANVAS.height);

    CONTEXT.fillStyle = "rgb(220, 220, 220)";
    CONTEXT.font = "30px monospace";

    const mainMessageText = "You have been hit by an asteroid!";
    const mainMessageWidth = CONTEXT.measureText(mainMessageText).width;
    const mainMessageX = (CANVAS.width - mainMessageWidth) / 2;
    const mainMessageY = CANVAS.height / 2 - 70;
    CONTEXT.fillText(mainMessageText, mainMessageX, mainMessageY);

    const scoreText = `Your score was ${score}.`;
    const scoreWidth = CONTEXT.measureText(scoreText).width;
    const scoreX = (CANVAS.width - scoreWidth) / 2;
    const scoreY = CANVAS.height / 2 - 30;
    CONTEXT.fillText(scoreText, scoreX, scoreY);

    CONTEXT.font = "20px monospace";
    const controlsText =
    "W - Forwards | A - Rotate Left | S - Backwards | D - Rotate Right";
    const controlsWidth = CONTEXT.measureText(controlsText).width;
    const controlsX = (CANVAS.width - controlsWidth) / 2;
    const controlsY = CANVAS.height / 2 + 125;
    CONTEXT.fillText(controlsText, controlsX, controlsY);

    const playAgainText = "Press the LEFT MOUSE BUTTON to play again.";
    const playAgainWidth = CONTEXT.measureText(playAgainText).width;
    const playAgainX = (CANVAS.width - playAgainWidth) / 2;
    const playAgainY = CANVAS.height / 2 + 160;
    CONTEXT.fillText(playAgainText, playAgainX, playAgainY);

    CONTEXT.font = "14px monospace";
    const musicText = "Music by Karl Casey. (Royalty-Free)";
    const musicWidth = CONTEXT.measureText(musicText).width;
    const musicX = (CANVAS.width - musicWidth) / 2;
    const musicY = CANVAS.height / 2 + 430;
    CONTEXT.fillText(musicText, musicX, musicY);

    const musicWebsiteText = "karlcasey.bandcamp.com";
    const musicWebsiteWidth = CONTEXT.measureText(musicWebsiteText).width;
    const musicWebsiteX = (CANVAS.width - musicWebsiteWidth) / 2;
    const musicWebsiteY = CANVAS.height / 2 + 450;
    CONTEXT.fillText(musicWebsiteText, musicWebsiteX, musicWebsiteY);
}