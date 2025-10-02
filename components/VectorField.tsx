'use client';

import { useEffect, useRef, useState } from 'react';
import { Point, VectorFieldConfig, Particle, ParticleConfig } from '@/lib/types';
import { distance, angleTo, calculateVectorLength, generateGrid } from '@/lib/vectorMath';
import { updateParticle, cullParticles, spawnParticles } from '@/lib/particleSystem';

const defaultConfig: VectorFieldConfig = {
  gridSpacing: 35,
  keepOutRadius: 60,
  maxVectorLength: 25,
  influenceRange: 120,
  vectorColor: '#00ffff',
  vectorOpacity: 0.8,
  backgroundColor: '#0a0a0a',
};

const particleConfig: ParticleConfig = {
  spawnRate: 3,
  maxParticles: 200,
  particleLife: 2000, // milliseconds
  particleSize: 3,
  particleColor: '#ff00ff',
  trailLength: 20,
  velocityDamping: 0.95,
};

export default function VectorField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [mousePos, setMousePos] = useState<Point>({ x: -1000, y: -1000 });
  const [gridPoints, setGridPoints] = useState<Point[]>([]);
  const animationFrameRef = useRef<number>();
  const particlesRef = useRef<Particle[]>([]);
  const lastFrameTimeRef = useRef<number>(performance.now());

  // Handle mouse movement
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };

    const handleMouseLeave = () => {
      setMousePos({ x: -1000, y: -1000 });
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  // Handle canvas resize and grid generation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resizeCanvas = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();

      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;

      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.scale(dpr, dpr);
      }

      // Regenerate grid when canvas resizes
      setGridPoints(generateGrid(rect.width, rect.height, defaultConfig.gridSpacing));
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  // Animation loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const render = () => {
      const now = performance.now();
      const deltaTime = (now - lastFrameTimeRef.current) / 1000; // Convert to seconds
      lastFrameTimeRef.current = now;

      const rect = canvas.getBoundingClientRect();

      // Clear canvas with slight trail effect for particles
      ctx.fillStyle = defaultConfig.backgroundColor + 'dd'; // Slight transparency
      ctx.fillRect(0, 0, rect.width, rect.height);

      // Update particles
      const particles = particlesRef.current;

      // Spawn new particles
      spawnParticles(particles, mousePos, particleConfig);

      // Update existing particles
      for (const particle of particles) {
        updateParticle(particle, mousePos, gridPoints, deltaTime, particleConfig);
      }

      // Remove dead particles
      particlesRef.current = cullParticles(particles);

      // Draw particles first (behind vectors)
      drawParticles(ctx, particlesRef.current, particleConfig);

      // Draw vectors
      ctx.strokeStyle = defaultConfig.vectorColor;
      ctx.fillStyle = defaultConfig.vectorColor;
      ctx.globalAlpha = defaultConfig.vectorOpacity;
      ctx.lineWidth = 1.5;

      gridPoints.forEach((point) => {
        const dist = distance(point, mousePos);
        const angle = angleTo(point, mousePos);
        const length = calculateVectorLength(
          dist,
          defaultConfig.keepOutRadius,
          defaultConfig.maxVectorLength,
          defaultConfig.influenceRange
        );

        if (length > 0) {
          // Color gradient based on distance (closer = brighter)
          const normalizedDist = Math.min(1, dist / 300);
          const opacity = defaultConfig.vectorOpacity * (0.4 + 0.6 * normalizedDist);

          ctx.globalAlpha = opacity;
          drawArrow(ctx, point.x, point.y, angle, length);
        }
      });

      animationFrameRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [gridPoints, mousePos]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full"
      style={{ cursor: 'none' }}
    />
  );
}

/**
 * Draw an arrow (line + triangle head) on the canvas
 */
function drawArrow(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  angle: number,
  length: number
) {
  const endX = x + Math.cos(angle) * length;
  const endY = y + Math.sin(angle) * length;

  // Draw line
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(endX, endY);
  ctx.stroke();

  // Draw arrowhead
  const headLength = Math.min(6, length * 0.3);
  const headAngle = Math.PI / 6; // 30 degrees

  ctx.beginPath();
  ctx.moveTo(endX, endY);
  ctx.lineTo(
    endX - headLength * Math.cos(angle - headAngle),
    endY - headLength * Math.sin(angle - headAngle)
  );
  ctx.lineTo(
    endX - headLength * Math.cos(angle + headAngle),
    endY - headLength * Math.sin(angle + headAngle)
  );
  ctx.closePath();
  ctx.fill();
}

/**
 * Draw particles with fade-out based on life
 */
function drawParticles(
  ctx: CanvasRenderingContext2D,
  particles: Particle[],
  config: ParticleConfig
) {
  ctx.fillStyle = config.particleColor;

  for (const particle of particles) {
    // Calculate opacity based on remaining life
    const lifeRatio = particle.life / particle.maxLife;
    const opacity = Math.pow(lifeRatio, 0.5); // Square root for smoother fade

    ctx.globalAlpha = opacity * 0.9;

    // Draw particle as a small circle with glow
    ctx.beginPath();
    ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
    ctx.fill();

    // Add subtle glow
    const hexOpacity = Math.floor(opacity * 255).toString(16).padStart(2, '0');
    const gradient = ctx.createRadialGradient(
      particle.x,
      particle.y,
      0,
      particle.x,
      particle.y,
      particle.size * 2
    );
    gradient.addColorStop(0, config.particleColor + hexOpacity);
    gradient.addColorStop(1, config.particleColor + '00');

    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(particle.x, particle.y, particle.size * 2, 0, Math.PI * 2);
    ctx.fill();

    // Reset fill style for next particle
    ctx.fillStyle = config.particleColor;
  }
}
