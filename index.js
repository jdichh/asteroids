let gameOver = false;

///// Canvas Setup /////
const CANVAS = document.getElementById("canvas");
const CONTEXT = CANVAS.getContext("2d");

CANVAS.width = window.innerWidth;
CANVAS.height = window.innerHeight;
///// End of Canvas Setup /////

///// Class Setup /////
class Player {
  constructor({ coordinates, velocity }) {
    this.coordinates = coordinates;
    this.velocity = velocity;
    this.rotation = 0;
  }

  drawPlayer() {
    CONTEXT.save();

    // Enables ship to rotate freely.
    CONTEXT.translate(this.coordinates.x, this.coordinates.y);
    CONTEXT.rotate(this.rotation);
    CONTEXT.translate(-this.coordinates.x, -this.coordinates.y);

    // Spaceship shape.
    CONTEXT.beginPath();
    CONTEXT.moveTo(this.coordinates.x + 30, this.coordinates.y); // Top of the spaceship
    CONTEXT.lineTo(this.coordinates.x - 5, this.coordinates.y - 15); // Bottom left
    CONTEXT.lineTo(this.coordinates.x + 5, this.coordinates.y); // Middle bottom
    CONTEXT.lineTo(this.coordinates.x - 5, this.coordinates.y + 15); // Bottom right
    CONTEXT.closePath();

    CONTEXT.shadowColor = "rgba(179, 201, 198, 1)"; // Pale turquoise of some sort
    CONTEXT.shadowBlur = 5; // Blur effect

    CONTEXT.fillStyle = "#dadada";
    CONTEXT.fill();

    CONTEXT.restore();
  }

  updatePlayer() {
    this.drawPlayer();
    this.coordinates.x += this.velocity.x;
    this.coordinates.y += this.velocity.y;
  }

  getVertices() {
    const cos = Math.cos(this.rotation);
    const sin = Math.sin(this.rotation);

    return [
      {
        x: this.coordinates.x + cos * 30 - sin * 0,
        y: this.coordinates.y + sin * 30 + cos * 0,
      },
      {
        x: this.coordinates.x + cos * -10 - sin * 10,
        y: this.coordinates.y + sin * -10 + cos * 10,
      },
      {
        x: this.coordinates.x + cos * -10 - sin * -10,
        y: this.coordinates.y + sin * -10 + cos * -10,
      },
    ];
  }
}

class Projectile {
  constructor({ coordinates, velocity }) {
    this.coordinates = coordinates;
    this.velocity = velocity;
    this.radius = 2;
    this.maxDistance = 700; // Maximum distance the projectile can travel
    this.distanceTraveled = 0; // Distance traveled by the projectile
  }

  drawProjectile() {
    CONTEXT.beginPath();
    CONTEXT.arc(
      this.coordinates.x,
      this.coordinates.y,
      this.radius,
      0,
      Math.PI * 2,
      false
    );
    CONTEXT.closePath();
    CONTEXT.fillStyle = "#eeeeee";
    CONTEXT.fill();
  }

  updateProjectile() {
    this.drawProjectile();
    this.coordinates.x += this.velocity.x;
    this.coordinates.y += this.velocity.y;
    this.distanceTraveled += Math.sqrt(
      this.velocity.x * this.velocity.x + this.velocity.y * this.velocity.y
    );

    // Checks if the projectile has exceeded the maximum distance.
    if (this.distanceTraveled >= this.maxDistance) {
      const index = PROJECTILES.indexOf(this);
      if (index !== -1) {
        PROJECTILES.splice(index, 1);
      }
      return;
    }

    // Enables projectiles to "wrap around" the canvas.
    if (this.coordinates.x < 0) {
      this.coordinates.x = CANVAS.width;
    } else if (this.coordinates.x > CANVAS.width) {
      this.coordinates.x = 0;
    }

    if (this.coordinates.y < 0) {
      this.coordinates.y = CANVAS.height;
    } else if (this.coordinates.y > CANVAS.height) {
      this.coordinates.y = 0;
    }
  }
}

const player = new Player({
  coordinates: { x: CANVAS.width / 2, y: CANVAS.height / 2 },
  velocity: { x: 0, y: 0 },
});
///// End of Class Setup /////

///// Asteroid Setup & Spawning /////
class Asteroid {
  constructor({ coordinates, velocity }) {
    this.coordinates = coordinates;
    this.velocity = velocity;
    this.radius = 100 * Math.random() + 5;
    this.numPoints = Math.floor(Math.random() * 4) + 5; // Random number of points for the asteroid shape.
  }

  drawAsteroid() {
    CONTEXT.beginPath();
    CONTEXT.moveTo(
      this.coordinates.x + this.radius * Math.cos(0),
      this.coordinates.y + this.radius * Math.sin(0)
    );

    for (let i = 1; i <= this.numPoints; i++) {
      const angle = (Math.PI * 2 * i) / this.numPoints;
      const x = this.coordinates.x + this.radius * Math.cos(angle);
      const y = this.coordinates.y + this.radius * Math.sin(angle);
      CONTEXT.lineTo(x, y);
    }

    CONTEXT.closePath();
    CONTEXT.strokeStyle = "#eeeeee";
    CONTEXT.stroke();
  }

  updateAsteroid() {
    this.drawAsteroid();
    this.coordinates.x += this.velocity.x;
    this.coordinates.y += this.velocity.y;

    // Enables asteroids to "wrap around" the canvas.
    if (this.coordinates.x < 0) {
      this.coordinates.x = CANVAS.width;
    } else if (this.coordinates.x > CANVAS.width) {
      this.coordinates.x = 0;
    }

    if (this.coordinates.y < 0) {
      this.coordinates.y = CANVAS.height;
    } else if (this.coordinates.y > CANVAS.height) {
      this.coordinates.y = 0;
    }
  }
}

const ASTEROIDS = [];
const MAX_ASTEROIDS = 90; // Maximum number of asteroids allowed on screen.

setInterval(() => {
  if (ASTEROIDS.length < MAX_ASTEROIDS) {
    // Spawn location of asteroids (outside of canvas bounds).
    const randomX = Math.random() < 0.5 ? -50 : CANVAS.width + 50;
    const randomY = Math.random() < 0.5 ? -50 : CANVAS.height + 50;
    // Asteroid travel speed.
    const randomVelocityX = (Math.random() - 0.6) * 14;
    const randomVelocityY = (Math.random() - 0.6) * 14;

    ASTEROIDS.push(
      new Asteroid({
        coordinates: { x: randomX, y: randomY },
        velocity: { x: randomVelocityX, y: randomVelocityY },
      })
    );
  }
  // Time in-between asteroid spawning.
}, 400);

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

///// Sound Effects /////
const FIRE_SOUND = new Audio("./assets/sounds/fire.wav");
const ASTEROID_HIT = new Audio("./assets/sounds/bangMedium.wav");
///// End of Sound Effects /////

///// Hit Detection /////
let score = 0;
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
        score += 15;
        // Remove detected projectiles and asteroids that have collided.
        PROJECTILES.splice(i, 1);
        ASTEROIDS.splice(j, 1);
        // Explosion visual effect.
        const explosion = {
          coordinates: { x: ASTEROID.coordinates.x, y: ASTEROID.coordinates.y },
          particles: [],
          maxParticles: 20,
          particleSpeed: 2,
          particleRadius: 1,
          explosionDuration: 60, // Duration of the explosion in frames
          frameCount: 0,
        };
        EXPLOSIONS.push(explosion);
        // Explosion sound effect.
        ASTEROID_HIT.play();
        ASTEROID_HIT.currentTime = 0;
        ASTEROID_HIT.volume = 0.1;
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

///// FPS COUNTER /////
let fps = 0;
let frameCount = 0;
let startTime = performance.now();

function calculateFPS() {
  frameCount++;
  const currentTime = performance.now();
  const elapsedTime = currentTime - startTime;

  if (elapsedTime > 1000) {
    fps = Math.round((frameCount * 1000) / elapsedTime);
    frameCount = 0;
    startTime = currentTime;
  }
}

function drawFPS() {
  CONTEXT.fillStyle = "white";
  CONTEXT.font = "16px monospace";
  CONTEXT.fillText(`FPS: ${fps}`, 10, 20);
}
///// END OF FPS COUNTER /////

///// Main Game Data /////
const MOVEMENT_SPEED = 6.5;
const ROTATION_SPEED = 0.125;
const DECELERATION_RATE = 0.94;
const PROJECTILES = [];
const EXPLOSIONS = [];
const PROJECTILE_SPEED = 17;
const KEYPRESS = {
  w_key: {
    pressed: false,
  },
  a_key: {
    pressed: false,
  },
  s_key: {
    pressed: false,
  },
  d_key: {
    pressed: false,
  },
};

function restartGame() {
  gameOver = false;
  score = 0;
  player.coordinates.x = CANVAS.width / 2;
  player.coordinates.y = CANVAS.height / 2;
  player.velocity.x = 0;
  player.velocity.y = 0;
  ASTEROIDS.length = 0;
  PROJECTILES.length = 0;

  CANVAS.removeEventListener("click", restartGame);
  mainGame();
}

let gameStarted = false;
let lastFrameTime = 0;
const frameRate = 60;

function startGame() {
  gameStarted = true;
  lastFrameTime = performance.now(); // Reset the last frame time.
  requestAnimationFrame(mainGame); 
}

function mainGame(currentTime) {
  const deltaTime = (currentTime - lastFrameTime) / 100; // Calculate the time since the last frame in seconds.
  if (deltaTime < 1 / frameRate) {
    // Skip this frame if it's too soon.
    requestAnimationFrame(mainGame);
    return;
  }
  lastFrameTime = currentTime; // Update the last frame time.

  if (!gameStarted) {
    // Display the start screen
    CONTEXT.fillStyle = "black";
    CONTEXT.fillRect(0, 0, CANVAS.width, CANVAS.height);

    CONTEXT.fillStyle = "white";
    CONTEXT.font = "20px monospace";
    CONTEXT.fillText("Press the left mouse button to start the game.", CANVAS.width / 2 - 225, CANVAS.height / 2 + 160);
    CONTEXT.font = "200px monospace";
    CONTEXT.fillText("ASTEROIDS", CANVAS.width / 2 - 450, CANVAS.height / 2 - 80);

    CANVAS.addEventListener("click", startGame);
    return;
  }

  if (gameOver) {
    CONTEXT.fillStyle = "black";
    CONTEXT.fillRect(0, 0, CANVAS.width, CANVAS.height);

    CONTEXT.fillStyle = "white";
    CONTEXT.font = "30px monospace";
    CONTEXT.fillText("You have been hit by an asteroid!", CANVAS.width / 2 - 275, CANVAS.height / 2 - 70);
    CONTEXT.fillText(`Your score was ${score}.`, CANVAS.width / 2 - 150, CANVAS.height / 2 - 30);
    CONTEXT.font = "20px monospace";
    CONTEXT.fillText("Press the left mouse button to play again.", CANVAS.width / 2 - 225, CANVAS.height / 2 + 80)

    CANVAS.addEventListener("click", restartGame);
    return;
  } 
  
  const angle = player.rotation - Math.PI / 2;

  CONTEXT.fillStyle = "black";
  CONTEXT.fillRect(0, 0, CANVAS.width, CANVAS.height);

  window.requestAnimationFrame(mainGame);
  player.updatePlayer();

  // Asteroid spawning & maintenance.
  updateAsteroids();
  drawAsteroids();

  // Projectile to asteroid hit detection.
  detectCollisions();

  // FPS COUNTER
  calculateFPS();
  drawFPS();

  // Scoreboard
  CONTEXT.fillStyle = "white";
  CONTEXT.font = "20px monospace";
  CONTEXT.fillText(`SCORE: ${score}`, CANVAS.width / 2 - 37.5, CANVAS.height / 2 - 430);

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

  // Garbage collector for projectiles.
  if (PROJECTILES.distanceTraveled >= PROJECTILES.maxDistance) {
    PROJECTILES.splice(i, 1);
  }

  if (KEYPRESS.w_key.pressed) {
    player.velocity.y = Math.cos(angle) * MOVEMENT_SPEED;
    player.velocity.x = -Math.sin(angle) * MOVEMENT_SPEED;
  } else if (KEYPRESS.a_key.pressed) {
    player.rotation -= ROTATION_SPEED;
  } else if (KEYPRESS.s_key.pressed) {
    player.velocity.y = -Math.cos(angle) * MOVEMENT_SPEED;
    player.velocity.x = Math.sin(angle) * MOVEMENT_SPEED;
  } else if (KEYPRESS.d_key.pressed) {
    player.rotation += ROTATION_SPEED;
  }

  if (!KEYPRESS.w_key.pressed) {
    player.velocity.x *= DECELERATION_RATE;
    player.velocity.y *= DECELERATION_RATE;
  }

  // Enables the spaceship to "wrap around" the canvas.
  if (player.coordinates.x < 0) {
    player.coordinates.x = CANVAS.width;
  } else if (player.coordinates.x > CANVAS.width) {
    player.coordinates.x = 0;
  }

  if (player.coordinates.y < 0) {
    player.coordinates.y = CANVAS.height;
  } else if (player.coordinates.y > CANVAS.height) {
    player.coordinates.y = 0;
  }
}

mainGame();
///// End of Main Game Data /////

///// Controls /////
function fireProjectile(){
  FIRE_SOUND.play();
  FIRE_SOUND.currentTime = 0;
  FIRE_SOUND.volume = 0.1;
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

window.addEventListener("keydown", (e) => {
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
});

window.addEventListener("keyup", (e) => {
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
});

window.addEventListener("mousedown", (e) => {
  if (e.button === 0) {
    fireProjectile()
  }
});
