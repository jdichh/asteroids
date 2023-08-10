///// Canvas Setup /////
const CANVAS = document.getElementById("canvas");
const CONTEXT = CANVAS.getContext("2d");

CANVAS.width = window.innerWidth;
CANVAS.height = window.innerHeight;

var gradient = CONTEXT.createLinearGradient(0, 0, CANVAS.width, CANVAS.height);
gradient.addColorStop(0, "#0F212A");
gradient.addColorStop(0.99, "#050D0D");
///// End of Canvas Setup /////

///// Player Setup /////
class Player {
  constructor({ coordinates, velocity }) {
    this.coordinates = coordinates;
    this.velocity = velocity;
    this.rotation = 0;
  }

  show() {
    CONTEXT.save();

    CONTEXT.translate(this.coordinates.x, this.coordinates.y);
    CONTEXT.rotate(this.rotation);
    CONTEXT.translate(-this.coordinates.x, -this.coordinates.y);

    CONTEXT.beginPath();
    CONTEXT.moveTo(this.coordinates.x + 30, this.coordinates.y); // Top of the spaceship
    CONTEXT.lineTo(this.coordinates.x - 5, this.coordinates.y - 15); // Bottom left
    CONTEXT.lineTo(this.coordinates.x + 5, this.coordinates.y); // Middle bottom
    CONTEXT.lineTo(this.coordinates.x - 5, this.coordinates.y + 15); // Bottom right
    CONTEXT.closePath();

    CONTEXT.shadowColor = "rgba(179, 201, 198, 1)"; // Pale turquoise of some sort
    CONTEXT.shadowBlur = 5; // Blur effect
    CONTEXT.shadowOffsetX = 0; // Horizontal distance
    CONTEXT.shadowOffsetY = 0; // Vertical distance

    CONTEXT.strokeStyle = "white";
    CONTEXT.stroke();

    // just checking the center position
    // CONTEXT.arc(
    //   this.coordinates.x,
    //   this.coordinates.y,
    //   5,
    //   0,
    //   Math.PI * 2,
    //   false
    // );
    // CONTEXT.fillStyle = "yellow";
    // CONTEXT.fill();

    CONTEXT.restore();
  }

  updatePlayer() {
    this.show();
    this.coordinates.x += this.velocity.x;
    this.coordinates.y += this.velocity.y;
  }
}

const player = new Player({
  coordinates: { x: CANVAS.width / 2, y: CANVAS.height / 2 },
  velocity: { x: 0, y: 0 },
});
///// End of Player Setup /////

///// Movement & Controls /////
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

const MOVEMENT_SPEED = 5;
const ROTATION_SPEED = 0.1
const DECELERATION_RATE = 0.94

function movement() {
  const angle = player.rotation - Math.PI / 2;

  CONTEXT.fillStyle = gradient;
  CONTEXT.fillRect(0, 0, CANVAS.width, CANVAS.height);
  window.requestAnimationFrame(movement);

  player.updatePlayer();
//   player.velocity.x = 0;
//   player.velocity.y = 0;
  if (KEYPRESS.w_key.pressed) {
    player.velocity.y = Math.cos(angle) * MOVEMENT_SPEED;
    player.velocity.x = -Math.sin(angle) * MOVEMENT_SPEED;
    createParticle(player.coordinates.x, player.coordinates.y); // Create a particle at ship's position
  } else if (KEYPRESS.a_key.pressed) {
    player.rotation -= ROTATION_SPEED;
  } else if (KEYPRESS.s_key.pressed) {
    player.velocity.y = -Math.cos(angle) * MOVEMENT_SPEED;
    player.velocity.x = Math.sin(angle) * MOVEMENT_SPEED;
    createParticle(player.coordinates.x - Math.sin(angle) * 10, player.coordinates.y + Math.cos(angle) * 10); // Create a particle at bottom left
    createParticle(player.coordinates.x + Math.sin(angle) * 10, player.coordinates.y - Math.cos(angle) * 10); // Create a particle at bottom right
  } else if (KEYPRESS.d_key.pressed) {
    player.rotation += ROTATION_SPEED;
  } 
  
  if (!KEYPRESS.w_key.pressed) {
    player.velocity.x *= DECELERATION_RATE
    player.velocity.y *= DECELERATION_RATE
  }

  // Boundary Checking
  if (player.coordinates.x < 0) {
    player.coordinates.x = 0;
  } else if (player.coordinates.x > CANVAS.width) {
    player.coordinates.x = CANVAS.width;
  }

  if (player.coordinates.y < 0) {
    player.coordinates.y = 0;
  } else if (player.coordinates.y > CANVAS.height) {
    player.coordinates.y = CANVAS.height;
  }
}

movement();

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
