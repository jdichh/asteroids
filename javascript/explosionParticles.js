import { CONTEXT } from "./canvasUtils.js";

export function updateParticles(explosion) {
  for (let j = explosion.particles.length - 1; j >= 0; j--) {
    const particle = explosion.particles[j];
    particle.coordinates.x += particle.velocity.x;
    particle.coordinates.y += particle.velocity.y;
    particle.alpha -= 0.02; // Reduce the opacity of the particle over time.
    if (particle.alpha <= 0) {
      explosion.particles.splice(j, 1);
    }
  }
}

export function renderParticles(explosion) {
  for (const particle of explosion.particles) {
    CONTEXT.save();
    CONTEXT.beginPath();
    CONTEXT.arc(
      particle.coordinates.x,
      particle.coordinates.y,
      particle.radius,
      0,
      Math.PI * 2
    );
    CONTEXT.closePath();
    CONTEXT.fillStyle = `rgba(255, 255, 255, ${particle.alpha})`;
    CONTEXT.fill();
    CONTEXT.restore();
  }
}
