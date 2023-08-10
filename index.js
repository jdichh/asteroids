const CANVAS = document.getElementById("canvas");
const CONTEXT = CANVAS.getContext("2d");

CANVAS.width = window.innerWidth;
CANVAS.height = window.innerHeight;

// Apply gradient to background
var gradient = CONTEXT.createLinearGradient(0, 0, CANVAS.width, CANVAS.height);
gradient.addColorStop(0, '#0F212A');
gradient.addColorStop(0.99, '#050D0D');

CONTEXT.fillStyle = gradient;
CONTEXT.fillRect(0, 0, CANVAS.width, CANVAS.height);

class Player {
  constructor({ coordinates, velocity }) {
    this.coordinates = coordinates;
    this.velocity = velocity;
  }

  show() {
    // just checking the center position
    // CONTEXT.arc(this.coordinates.x, this.coordinates.y, 5, 0, Math.PI * 2, false)
    // CONTEXT.fillStyle = 'yellow'
    // CONTEXT.fill()

    CONTEXT.beginPath();
    CONTEXT.moveTo(this.coordinates.x, this.coordinates.y - 25); // Top of the spaceship
    CONTEXT.lineTo(this.coordinates.x - 15, this.coordinates.y + 10); // Bottom left
    CONTEXT.lineTo(this.coordinates.x, this.coordinates.y); // Middle bottom
    CONTEXT.lineTo(this.coordinates.x + 15, this.coordinates.y + 10); // Bottom right
    CONTEXT.closePath();

    CONTEXT.shadowColor = 'rgba(179, 201, 198, 1)'; // Pale turquoise of some sort
    CONTEXT.shadowBlur = 5; // Blur effect
    CONTEXT.shadowOffsetX = 0; // Horizontal distance
    CONTEXT.shadowOffsetY = 0; // Vertical distance

    CONTEXT.strokeStyle = 'white';
    CONTEXT.stroke()
  }
}

const player = new Player({
  coordinates: { x: CANVAS.width / 2, y: CANVAS.height / 2 },
  velocity: { x: 0, y: 0 },
});

player.show();

window.addEventListener('keydown', (e) => {
    switch (e.code) {
        case 'KeyW':
            alert('W key.')
        break;
        case 'KeyA':
            alert('A key.')
        break;
        case 'KeyS':
            alert('S key.')
        break;
        case 'KeyD':
            alert('D key.')
        break;
    }
})