import { CANVAS, CONTEXT } from "./canvasUtils.js";

export function drawStartScreenInfo() {
    CONTEXT.fillStyle = "black";
    CONTEXT.fillRect(0, 0, CANVAS.width, CANVAS.height);

    CONTEXT.fillStyle = "white";
    CONTEXT.font = "200px monospace";

    const titleText = "ASTEROIDS";
    const titleWidth = CONTEXT.measureText(titleText).width;
    const titleX = (CANVAS.width - titleWidth) / 2;
    const titleY = CANVAS.height / 2 - 80;
    CONTEXT.fillText(titleText, titleX, titleY);

    CONTEXT.font = "20px monospace";
    const instructionText = "Press the LEFT MOUSE BUTTON to start the game.";
    const instructionWidth = CONTEXT.measureText(instructionText).width;
    const instructionX = (CANVAS.width - instructionWidth) / 2;
    const instructionY = CANVAS.height / 2 + 160;
    CONTEXT.fillText(instructionText, instructionX, instructionY);

    const controlsText = "W - Forwards | A - Rotate Left | S - Backwards | D - Rotate Right";
    const controlsWidth = CONTEXT.measureText(controlsText).width;
    const controlsX = (CANVAS.width - controlsWidth) / 2;
    const controlsY = CANVAS.height / 2 + 125;
    CONTEXT.fillText(controlsText, controlsX, controlsY);

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