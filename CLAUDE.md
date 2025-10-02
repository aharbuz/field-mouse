# Claude Context: Vector Field Animation Project

## Project Purpose
This is a demonstration project for creating an interactive vector field animation. It serves as a single-page website with a full-screen canvas animation where vectors dynamically respond to mouse movement.

## Architecture Overview

### Technology Choices & Rationale
- **Next.js 15 + React 19**: Chosen for familiarity (user specified), provides good foundation for potential expansion
- **HTML5 Canvas over SVG**: Canvas selected for performance - can handle 600-800+ vectors at 60fps. SVG would struggle with this many elements updating every frame
- **TypeScript**: Provides type safety for mathematical operations and catches errors early
- **Tailwind CSS**: User preference, minimal usage (only for layout)
- **Yarn**: Used instead of npm due to npm cache permission issues during setup

### Key Design Decisions

#### Fixed Grid vs Dynamic Particles
- Chose **fixed grid** of vector anchor points
- Regenerates on resize but positions are deterministic
- More performant than particle system
- Creates cleaner, more predictable visual aesthetic

#### Scaling Formula
```typescript
// Smoothstep easing: scale² × (3 - 2×scale)
const smoothScale = scale * scale * (3 - 2 * scale);
```
- Provides organic, natural-feeling transitions
- Avoids jittery behavior near boundaries
- Creates smooth gradient from keep-out zone to full length

#### Performance Strategy
- Single pass through grid points per frame
- Early exit for zero-length vectors (within keep-out zone)
- Batched canvas operations
- Efficient math (avoids unnecessary sqrt calls where possible)
- RequestAnimationFrame for browser-optimized timing

## Code Organization

### `lib/vectorMath.ts`
Pure functions with no side effects. Handles all mathematical operations:
- `distance()`: Euclidean distance calculation
- `angleTo()`: Direction from one point to another
- `calculateVectorLength()`: Core scaling logic with keep-out zone
- `generateGrid()`: Creates array of anchor points

### `lib/types.ts`
TypeScript interfaces defining data structures:
- `Point`: x, y coordinates
- `Vector`: anchor point, angle, length
- `VectorFieldConfig`: Configuration parameters

### `components/VectorField.tsx`
Main component containing:
1. **Mouse tracking** (lines 24-40): Event listeners for mousemove/mouseleave
2. **Canvas setup** (lines 43-69): Resize handling, HiDPI scaling, grid regeneration
3. **Animation loop** (lines 72-117): requestAnimationFrame with rendering logic
4. **Drawing helper** (lines 131-163): Arrow rendering with triangle heads

## Configuration Parameters
Tuned for balanced performance and visual appeal:
- `gridSpacing: 35` - Dense enough for coverage, sparse enough for performance
- `keepOutRadius: 60` - Large enough to see effect, small enough to not dominate
- `maxVectorLength: 25` - Proportional to grid spacing
- `influenceRange: 120` - 2x keep-out radius for smooth gradient
- `vectorColor: #00ffff` - Cyan for good visibility on dark background
- `vectorOpacity: 0.8` - Base opacity, modified by distance gradient

## Common Modifications

### Changing Colors
Edit `defaultConfig` in `components/VectorField.tsx`:
```typescript
vectorColor: '#ff00ff', // Change to magenta
backgroundColor: '#1a1a1a', // Lighter background
```

### Adjusting Grid Density
```typescript
gridSpacing: 50, // Fewer vectors (better performance)
gridSpacing: 25, // More vectors (more compute intensive)
```

### Modifying Keep-Out Zone
```typescript
keepOutRadius: 100, // Larger clear area around cursor
influenceRange: 200, // Smoother, longer gradient
```

### Adding Touch Support
Would need to add in `VectorField.tsx`:
```typescript
window.addEventListener('touchmove', (e) => {
  const touch = e.touches[0];
  setMousePos({ x: touch.clientX, y: touch.clientY });
});
```

## Performance Characteristics
- **Target**: 60fps
- **Typical load**: 600-800 vectors on 1920×1080 display
- **Bottleneck**: Canvas drawing operations (not calculations)
- **Scaling**: Linear with number of vectors
- **Memory**: Minimal - grid regenerates but doesn't accumulate

## Known Limitations
1. No mobile touch support yet
2. Cursor hidden globally (might interfere with UI elements if added)
3. Fixed color scheme (not user-configurable)
4. CPU-based rendering (no WebGL/GPU acceleration)
5. Grid regenerates entirely on resize (could be optimized with partial updates)

## Development Commands
```bash
yarn dev          # Start dev server (Turbopack enabled)
yarn build        # Production build
yarn start        # Start production server
yarn lint         # Run ESLint
```

## Future Enhancement Ideas
- Add touch/mobile support
- Color picker for customization
- Grid density slider
- Multiple mouse cursors (multiplayer?)
- WebGL implementation for 10,000+ vectors
- Particle trail effects
- Sound reactivity
- 3D vector field (three.js)
