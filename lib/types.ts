export interface Point {
  x: number;
  y: number;
}

export interface Vector {
  anchor: Point;
  angle: number;
  length: number;
}

export interface VectorFieldConfig {
  gridSpacing: number;
  keepOutRadius: number;
  maxVectorLength: number;
  influenceRange: number;
  vectorColor: string;
  vectorOpacity: number;
  backgroundColor: string;
}

export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
}

export interface ParticleConfig {
  spawnRate: number;
  maxParticles: number;
  particleLife: number;
  particleSize: number;
  particleColor: string;
  trailLength: number;
  velocityDamping: number;
}
