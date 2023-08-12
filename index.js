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
  renderParticles,
  updateParticles,
} from "./javascript/explosionParticles.js";
import { spawnAsteroids } from "./javascript/asteroidUtils.js";
import {
  ASTEROIDS,
  MAX_FPS,
  PROJECTILES,
  EXPLOSIONS,
  PROJECTILE_SPEED,
  KEYPRESS,
  OFF_WHITE,
  SPAWN_INTERVAL,
} from "./javascript/gameConstants.js";
import { player, Projectile } from "./javascript/classes/gameClasses.js";

export let gameOver = false;
export let gameStarted = false;
let asteroidSpawnInterval;

///// Asteroid Setup & Spawning /////
function updateAndDrawAsteroids() {
  const asteroidsToRemove = [];

  for (let i = ASTEROIDS.length - 1; i >= 0; i--) {
    const asteroid = ASTEROIDS[i];
    asteroid.updateAsteroid();

    if (playerCollided(asteroid, player.getVertices())) {
      gameOver = true;
    }

    // Mark asteroids for removal if out of bounds.
    if (
      asteroid.coordinates.x < 0 ||
      asteroid.coordinates.x > CANVAS.width ||
      asteroid.coordinates.y < 0 ||
      asteroid.coordinates.y > CANVAS.height
    ) {
      asteroidsToRemove.push(i);
    }
  }

  // Remove marked asteroids outside the loop.
  for (const index of asteroidsToRemove) {
    ASTEROIDS.splice(index, 1);
  }

  for (const asteroid of ASTEROIDS) {
    asteroid.drawAsteroid();
  }
}
///// End of Asteroid Setup & Spawning /////

///// Hit Detection /////
function detectCollisions() {
  for (let i = PROJECTILES.length - 1; i >= 0; i--) {
    const PROJECTILE = PROJECTILES[i];

    // Skip collision checks if the projectile is out of the game area.
    if (
      PROJECTILE.coordinates.x > CANVAS.width ||
      PROJECTILE.coordinates.y > CANVAS.height
    ) {
      continue;
    }

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
          maxParticles: 40,
          particleSpeed: 2,
          particleRadius: 0.5,
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
  gameLoop();
}

let lastFrameTime = 0;

function gameLoop(currentTime) {
  if (!gameStarted) {
    // Start screen.
    drawStartScreenInfo();
    CANVAS.addEventListener("click", () => {
      gameStarted = true;
      lastFrameTime = performance.now();
      clearInterval(asteroidSpawnInterval);
      requestAnimationFrame(gameLoop);
    });
    return;
  }

  if (gameOver) {
    // What do you think?
    drawRestartScreenInfo();
    CANVAS.addEventListener("click", restartGame);
    return;
  }

  /*
   I tried enabling/disabling hardware acceleration in Chrome Dev and Firefox Dev Edition. (It's enabled for me now after testing.)
   FPS is somehow halved when using 1000, for example, if I the fps to 60, it's 30 in game.
   I've set it to 120fps to be 60fps in-game, for me at least. 
   My screen is at 60Hz, V-sync is off for browsers, and I've restarted my PC multiple times.
   Hmm.
  */

  const DELTA_TIME = (currentTime - lastFrameTime) / 1000;
  const targetTimePerFrame = 1 / MAX_FPS;

  if (DELTA_TIME < targetTimePerFrame) {
    // If the time is less, wait for the remaining time
    const remainingTime = targetTimePerFrame - DELTA_TIME;
    setTimeout(() => {
      requestAnimationFrame(gameLoop);
    }, remainingTime * 1000); // Convert to milliseconds
    return;
  } else {
    lastFrameTime = currentTime;
  }

  CONTEXT.fillStyle = OFF_WHITE;
  CONTEXT.fillRect(0, 0, CANVAS.width, CANVAS.height);

  player.updatePlayer();

  // Asteroid spawning.

  asteroidSpawnInterval = setInterval(spawnAsteroids, SPAWN_INTERVAL);

  // Asteroid maintenance.
  updateAndDrawAsteroids();

  // Projectile to asteroid hit detection.
  detectCollisions();

  // Scoreboard
  scoreBoard();

  // Controls
  controlScheme();
  enableCanvasWrap();

  // Update and show explosions on projectile to asteroid impact.
  for (let i = EXPLOSIONS.length - 1; i >= 0; i--) {
    const explosion = EXPLOSIONS[i];

    if (explosion.frameCount === 0) {
      const particlesToAdd =
        explosion.maxParticles - explosion.particles.length;
      for (let j = 0; j < particlesToAdd; j++) {
        const angle = Math.random() * Math.PI * 2;
        const velocity = {
          x: Math.cos(angle) * explosion.particleSpeed,
          y: Math.sin(angle) * explosion.particleSpeed,
        };
        explosion.particles.push({
          coordinates: { ...explosion.coordinates },
          velocity,
          radius: explosion.particleRadius,
          color: explosion.particleColor,
          alpha: 1,
        });
      }
    }

    updateParticles(explosion);

    explosion.frameCount++;

    if (explosion.frameCount >= explosion.explosionDuration) {
      EXPLOSIONS.splice(i, 1);
    }
    renderParticles(explosion);
  }

  for (let i = PROJECTILES.length - 1; i >= 0; i--) {
    const projectile = PROJECTILES[i];
    projectile.updateProjectile();
  }

  // Garbage collector for projectiles that traveled past the max distance.
  if (PROJECTILES.distanceTraveled >= PROJECTILES.maxDistance) {
    PROJECTILES.splice(i, 1);
  }

  // FPS COUNTER
  calculateFPS(currentTime);
  drawFPS();
  requestAnimationFrame(gameLoop);
}

gameLoop();

///// Controls /////
function fireProjectile() {
  soundManager.playSound("FIRE_SOUND", 0.1);

  const cosRotation = Math.cos(player.rotation);
  const sinRotation = Math.sin(player.rotation);

  PROJECTILES.push(
    new Projectile({
      coordinates: {
        x: player.coordinates.x + cosRotation * 45,
        y: player.coordinates.y + sinRotation * 45,
      },
      velocity: {
        x: PROJECTILE_SPEED * cosRotation,
        y: PROJECTILE_SPEED * sinRotation,
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
