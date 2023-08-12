import soundManager from "./javascript/classes/soundEffectsManager.js";
import { playNextTrack, MUSIC } from "./javascript/sfxAndMusic.js";
import { CANVAS, CONTEXT } from "./javascript/canvasUtils.js";
import { drawFPS, calculateFPS } from "./javascript/fpsUtils.js";
import { scoreBoard } from "./javascript/scoreUtils.js";
import { drawStartScreenInfo } from "./javascript/startScreenCanvas.js";
import { drawRestartScreenInfo } from "./javascript/restartScreenCanvas.js";
import { resetScore, increaseScore } from "./javascript/scoreUtils.js";
import { controlScheme } from "./javascript/controlScheme.js";
import { enableCanvasWrap } from "./javascript/canvasWrap.js";
import {
  ASTEROIDS,
  MAX_ASTEROIDS,
  FRAMERATE,
  PROJECTILES,
  EXPLOSIONS,
  PROJECTILE_SPEED,
  KEYPRESS,
} from "./javascript/gameConstants.js";
import {
  player,
  Asteroid,
  Projectile,
} from "./javascript/classes/gameClasses.js";

let gameOver = false;
let gameStarted = false;

///// Asteroid Setup & Spawning /////
setInterval(() => {
  if (gameStarted && !gameOver && ASTEROIDS.length < MAX_ASTEROIDS) {
    // Spawn location of asteroids (outside of canvas bounds).
    const randomX = Math.random() < 0.5 ? -50 : CANVAS.width + 50;
    const randomY = Math.random() < 0.5 ? -50 : CANVAS.height + 50;
    // Asteroid travel speed.
    const randomVelocityX = (Math.random() - 0.65) * 13;
    const randomVelocityY = (Math.random() - 0.65) * 13;

    ASTEROIDS.push(
      new Asteroid({
        coordinates: { x: randomX, y: randomY },
        velocity: { x: randomVelocityX, y: randomVelocityY },
      })
    );
  }
  // Time in-between asteroid spawning.
}, 500);

function updateAsteroids() {
  for (let i = ASTEROIDS.length - 1; i >= 0; i--) {
    const asteroid = ASTEROIDS[i];
    asteroid.updateAsteroid();

    if (playerCollided(asteroid, player.getVertices())) {
      gameOver = true;
    }
    // Remove the asteroid if it's out of bounds (Garbage collector).
    if (
      asteroid.coordinates.x < 0 ||
      asteroid.coordinates.x > CANVAS.width ||
      asteroid.coordinates.y < 0 ||
      asteroid.coordinates.y > CANVAS.height
    ) {
      ASTEROIDS.splice(i, 1);
    }
  }
}

function drawAsteroids() {
  for (const asteroid of ASTEROIDS) {
    asteroid.drawAsteroid();
  }
}
///// End of Asteroid Setup & Spawning /////

///// Hit Detection /////
function detectCollisions() {
  for (let i = PROJECTILES.length - 1; i >= 0; i--) {
    const PROJECTILE = PROJECTILES[i];

    for (let j = ASTEROIDS.length - 1; j >= 0; j--) {
      const ASTEROID = ASTEROIDS[j];
      // Calculate the distance between the projectile and asteroid.
      const distance = Math.sqrt(
        (PROJECTILE.coordinates.x - ASTEROID.coordinates.x) ** 2 +
          (PROJECTILE.coordinates.y - ASTEROID.coordinates.y) ** 2
      );

      // Check if the distance is less than the sum of the projectile radius and asteroid radius.
      if (distance < PROJECTILE.radius + ASTEROID.radius) {
        increaseScore(15);
        // Remove detected projectiles and asteroids that have collided.
        PROJECTILES.splice(i, 1);
        ASTEROIDS.splice(j, 1);
        // Explosion visual effect.
        const explosion = {
          coordinates: { x: ASTEROID.coordinates.x, y: ASTEROID.coordinates.y },
          particles: [],
          maxParticles: 15,
          particleSpeed: 2,
          particleRadius: 1.5,
          explosionDuration: 20, // Duration of the explosion in frames
          frameCount: 0,
        };
        EXPLOSIONS.push(explosion);
        soundManager.playSound("ASTEROID_HIT", 0.1);
      }
    }
  }
}

function playerCollided(circle, triangle) {
  // Check if the circle is colliding with any of the triangle's edges.
  for (let i = 0; i < 3; i++) {
    let start = triangle[i];
    let end = triangle[(i + 1) % 3];

    let dx = end.x - start.x;
    let dy = end.y - start.y;
    let length = Math.sqrt(dx * dx + dy * dy);

    let dot =
      ((circle.coordinates.x - start.x) * dx +
        (circle.coordinates.y - start.y) * dy) /
      Math.pow(length, 2);

    let closestX = start.x + dot * dx;
    let closestY = start.y + dot * dy;

    if (!isPointOnLineSegment(closestX, closestY, start, end)) {
      closestX = closestX < start.x ? start.x : end.x;
      closestY = closestY < start.y ? start.y : end.y;
    }

    dx = closestX - circle.coordinates.x;
    dy = closestY - circle.coordinates.y;

    let distance = Math.sqrt(dx * dx + dy * dy);

    if (distance <= circle.radius) {
      return true;
    }
  }
  // No collision.
  return false;
}

function isPointOnLineSegment(x, y, start, end) {
  return (
    x >= Math.min(start.x, end.x) &&
    x <= Math.max(start.x, end.x) &&
    y >= Math.min(start.y, end.y) &&
    y <= Math.max(start.y, end.y)
  );
}
///// End of Hit Detection /////

///// Main Game Loop /////
function restartGame() {
  gameOver = false;
  resetScore();
  player.coordinates.x = CANVAS.width / 2;
  player.coordinates.y = CANVAS.height / 2;
  player.velocity.x = 0;
  player.velocity.y = 0;
  ASTEROIDS.length = 0;
  PROJECTILES.length = 0;

  CANVAS.removeEventListener("click", restartGame);

  // Reset music and playback state.
  MUSIC.currentTime = 0;
  MUSIC.volume = 0.1;

  mainGame();
  playNextTrack();
}

let lastFrameTime = 0;

function startGame() {
  gameStarted = true;
  lastFrameTime = performance.now(); // Reset the last frame time.
  requestAnimationFrame(mainGame);
}

function mainGame(currentTime) {
  /*
   I tried enabling/disabling hardware acceleration in Chrome Dev and Firefox Dev Edition. (It's enabled for me now after testing.)
   FPS is somehow halved when using 1000, for example, if I the fps to 60, it's 30 in game.
   I've set it to 120fps to be 60fps in-game, for me at least. 
   My screen is at 60Hz, V-sync is off for browsers, and I've restarted my PC multiple times.
   Hmm.
  */
  const DELTA_TIME = (currentTime - lastFrameTime) / 1000;

  if (DELTA_TIME < 1 / FRAMERATE) {
    requestAnimationFrame(mainGame);
    return;
  } else {
    lastFrameTime = currentTime;
  }

  if (!gameStarted) {
    // Display the start screen.
    drawStartScreenInfo();
    CANVAS.addEventListener("click", startGame);
    return;
  }

  if (gameOver) {
    drawRestartScreenInfo();
    CANVAS.addEventListener("click", restartGame);
    return;
  }

  CONTEXT.fillStyle = "black";
  CONTEXT.fillRect(0, 0, CANVAS.width, CANVAS.height);

  player.updatePlayer();

  // Asteroid spawning & maintenance.
  updateAsteroids();
  drawAsteroids();

  // Projectile to asteroid hit detection.
  detectCollisions();

  // FPS COUNTER
  calculateFPS(currentTime);
  drawFPS();
  requestAnimationFrame(mainGame);

  // Scoreboard
  scoreBoard()

  // Controls
  controlScheme()
  enableCanvasWrap()

  // Update and show explosions on projectile to asteroid impact.
  for (let i = EXPLOSIONS.length - 1; i >= 0; i--) {
    const EXPLOSION = EXPLOSIONS[i];

    if (EXPLOSION.frameCount === 0) {
      for (let j = 0; j < EXPLOSION.maxParticles; j++) {
        const angle = Math.random() * Math.PI * 2;
        const velocity = {
          x: Math.cos(angle) * EXPLOSION.particleSpeed,
          y: Math.sin(angle) * EXPLOSION.particleSpeed,
        };
        const PARTICLE = {
          coordinates: {
            x: EXPLOSION.coordinates.x,
            y: EXPLOSION.coordinates.y,
          },
          velocity,
          radius: EXPLOSION.particleRadius,
          color: EXPLOSION.particleColor,
          alpha: 1,
        };
        EXPLOSION.particles.push(PARTICLE);
      }
    }

    for (let j = EXPLOSION.particles.length - 1; j >= 0; j--) {
      const PARTICLE = EXPLOSION.particles[j];
      PARTICLE.coordinates.x += PARTICLE.velocity.x;
      PARTICLE.coordinates.y += PARTICLE.velocity.y;
      PARTICLE.alpha -= 0.02; // Reduce the opacity of the particle over time.
      if (PARTICLE.alpha <= 0) {
        EXPLOSION.particles.splice(j, 1);
      }
    }

    EXPLOSION.frameCount++;

    if (EXPLOSION.frameCount >= EXPLOSION.explosionDuration) {
      EXPLOSIONS.splice(i, 1);
    }

    for (const PARTICLE of EXPLOSION.particles) {
      CONTEXT.save();
      CONTEXT.beginPath();
      CONTEXT.arc(
        PARTICLE.coordinates.x,
        PARTICLE.coordinates.y,
        PARTICLE.radius,
        0,
        Math.PI * 2
      );
      CONTEXT.closePath();
      CONTEXT.fillStyle = `rgba(255, 255, 255, ${PARTICLE.alpha})`; // White color with alpha
      CONTEXT.fill();
      CONTEXT.restore();
    }
  }

  for (let i = PROJECTILES.length - 1; i >= 0; i--) {
    const PROJECTILE = PROJECTILES[i];
    PROJECTILE.updateProjectile();
  }

  // Garbage collector for projectiles that traveled past the max distance.
  if (PROJECTILES.distanceTraveled >= PROJECTILES.maxDistance) {
    PROJECTILES.splice(i, 1);
  }
}

mainGame();
///// End of Main Game Loop /////

///// Controls /////
function fireProjectile() {
  soundManager.playSound("FIRE_SOUND", 0.1);

  PROJECTILES.push(
    new Projectile({
      coordinates: {
        x: player.coordinates.x + Math.cos(player.rotation) * 45,
        y: player.coordinates.y + Math.sin(player.rotation) * 45,
      },
      velocity: {
        x: Math.cos(player.rotation) * PROJECTILE_SPEED,
        y: Math.sin(player.rotation) * PROJECTILE_SPEED,
      },
    })
  );
}

window.addEventListener("mousedown", (e) => {
  if (gameStarted && !gameOver && e.button === 0) {
    fireProjectile();
  }
});

window.addEventListener("keydown", (e) => {
  if (gameStarted) {
    switch (e.code) {
      case "KeyW":
        KEYPRESS.w_key.pressed = true;
        break;
      case "KeyA":
        KEYPRESS.a_key.pressed = true;
        break;
      case "KeyS":
        KEYPRESS.s_key.pressed = true;
        break;
      case "KeyD":
        KEYPRESS.d_key.pressed = true;
        break;
    }
  }
});

window.addEventListener("keyup", (e) => {
  if (gameStarted) {
    switch (e.code) {
      case "KeyW":
        KEYPRESS.w_key.pressed = false;
        break;
      case "KeyA":
        KEYPRESS.a_key.pressed = false;
        break;
      case "KeyS":
        KEYPRESS.s_key.pressed = false;
        break;
      case "KeyD":
        KEYPRESS.d_key.pressed = false;
        break;
    }
  }
});