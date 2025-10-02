import { Point } from './types';

/**
 * Calculate the Euclidean distance between two points
 */
export function distance(p1: Point, p2: Point): number {
  const dx = p2.x - p1.x;
  const dy = p2.y - p1.y;
  return Math.sqrt(dx * dx + dy * dy);
}

/**
 * Calculate the angle from p1 to p2 in radians
 */
export function angleTo(from: Point, to: Point): number {
  return Math.atan2(to.y - from.y, to.x - from.x);
}

/**
 * Calculate vector length based on distance to mouse with smooth falloff
 * Returns 0 within keepOutRadius, scales smoothly to maxLength beyond it
 */
export function calculateVectorLength(
  distanceToMouse: number,
  keepOutRadius: number,
  maxLength: number,
  influenceRange: number
): number {
  if (distanceToMouse < keepOutRadius) {
    return 0;
  }

  const effectiveDistance = distanceToMouse - keepOutRadius;
  const scale = Math.min(1, effectiveDistance / influenceRange);

  // Smooth easing function for more organic feel
  const smoothScale = scale * scale * (3 - 2 * scale); // smoothstep

  return maxLength * smoothScale;
}

/**
 * Generate a grid of anchor points for vectors
 */
export function generateGrid(
  width: number,
  height: number,
  spacing: number
): Point[] {
  const points: Point[] = [];

  // Start from half spacing to center the grid
  for (let y = spacing / 2; y < height; y += spacing) {
    for (let x = spacing / 2; x < width; x += spacing) {
      points.push({ x, y });
    }
  }

  return points;
}
