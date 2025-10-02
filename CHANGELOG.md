# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.1.0] - 2025-10-02

### Added
- Initial project setup with Next.js 15.5.4, TypeScript, and Tailwind CSS 4
- Full-page vector field animation using HTML5 Canvas
- Real-time mouse tracking with vector field response
- Dynamic vector scaling based on distance to cursor
- Keep-out zone (60px radius) around mouse cursor where vectors disappear
- Smooth falloff using smoothstep easing function for organic feel
- High-DPI display support with `devicePixelRatio` scaling
- Responsive canvas that regenerates grid on window resize
- Vector rendering with triangle arrowheads
- Opacity gradient effect (vectors dim near cursor, brighten farther away)
- 60fps animation loop using `requestAnimationFrame`
- Math utility library (`lib/vectorMath.ts`) with:
  - Distance calculation between points
  - Angle calculation for vector direction
  - Vector length scaling with smooth falloff
  - Grid generation for vector anchor points
- TypeScript type definitions (`lib/types.ts`) for:
  - Point interface
  - Vector interface
  - VectorFieldConfig interface
- Custom cursor hiding for cleaner aesthetic
- Dark theme optimized for cyan vectors on dark background

### Technical Details
- Grid spacing: 35px
- Keep-out radius: 60px
- Max vector length: 25px
- Influence range: 120px
- Vector color: Cyan (#00ffff)
- Background color: #0a0a0a
- Typical vector count: 600-800 (screen-size dependent)

### Development
- Configured Turbopack for faster development builds
- Set up Yarn package manager
- Configured ESLint for code quality
- Added responsive canvas resize handling
- Implemented cleanup for event listeners and animation frames

[Unreleased]: https://github.com/aharbuz/field-mouse/compare/v0.1.0...HEAD
[0.1.0]: https://github.com/aharbuz/field-mouse/releases/tag/v0.1.0
