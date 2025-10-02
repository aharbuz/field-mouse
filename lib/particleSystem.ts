import { Particle, ParticleConfig, Point } from './types';
import { distance, angleTo } from './vectorMath';

/**
 * Create a new particle at the given position
 */
export function createParticle(x: number, y: number, config: ParticleConfig): Particle {
  return {
    x,
    y,
    vx: 0,
    vy: 0,
    life: config.particleLife,
    maxLife: config.particleLife,
    size: config.particleSize,
  };
}

/**
 * Update particle physics based on vector field influence
 */
export function updateParticle(
  particle: Particle,
  mousePos: Point,
  gridPoints: Point[],
  deltaTime: number,
  config: ParticleConfig
): void {
  // Find nearest grid point to determine local vector field direction
  let nearestPoint: Point | null = null;
  let minDist = Infinity;

  for (const point of gridPoints) {
    const dist = distance(particle, point);
    if (dist < minDist) {
      minDist = dist;
      nearestPoint = point;
    }
  }

  if (nearestPoint) {
    // Calculate force from vector field (points toward mouse from nearest grid point)
    const angle = angleTo(nearestPoint, mousePos);
    const distToMouse = distance(particle, mousePos);

    // Force strength decreases with distance from mouse
    const forceStrength = Math.max(0, 1 - distToMouse / 400);
    const acceleration = 0.5;

    // Apply force in direction of local field
    particle.vx += Math.cos(angle) * acceleration * forceStrength * deltaTime;
    particle.vy += Math.sin(angle) * acceleration * forceStrength * deltaTime;
  }

  // Apply velocity damping for smooth trails
  particle.vx *= config.velocityDamping;
  particle.vy *= config.velocityDamping;

  // Update position
  particle.x += particle.vx;
  particle.y += particle.vy;

  // Age particle (convert deltaTime from seconds to milliseconds)
  particle.life -= deltaTime * 1000;
}

/**
 * Remove dead particles and manage particle pool
 */
export function cullParticles(particles: Particle[]): Particle[] {
  return particles.filter((p) => p.life > 0);
}

/**
 * Spawn new particles at mouse position
 */
export function spawnParticles(
  particles: Particle[],
  mousePos: Point,
  config: ParticleConfig,
  deltaTime: number
): void {
  // Don't spawn if mouse is off screen
  if (mousePos.x < -500 || mousePos.y < -500) return;

  // Spawn based on rate and delta time
  const spawnCount = Math.floor(config.spawnRate * deltaTime);

  for (let i = 0; i < spawnCount; i++) {
    if (particles.length >= config.maxParticles) break;

    // Add small random offset for variety
    const offsetX = (Math.random() - 0.5) * 10;
    const offsetY = (Math.random() - 0.5) * 10;

    particles.push(createParticle(mousePos.x + offsetX, mousePos.y + offsetY, config));
  }
}
