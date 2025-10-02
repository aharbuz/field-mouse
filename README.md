# Vector Field Animation

An interactive full-page vector field animation where hundreds of vectors dynamically respond to mouse movement, creating a mesmerizing magnetic field effect.

![Vector Field Demo](https://img.shields.io/badge/Next.js-15.5.4-black?logo=next.js) ![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript) ![React](https://img.shields.io/badge/React-19-61dafb?logo=react)

## Features

- **Real-time Interaction**: Vectors point toward mouse cursor with smooth, organic transitions
- **Dynamic Scaling**: Smoothstep easing function creates natural-feeling animations
- **Keep-Out Zone**: 60px radius around cursor where vectors gracefully fade to zero
- **High Performance**: 60fps rendering with 600-800+ vectors using HTML5 Canvas
- **Responsive Design**: Grid automatically regenerates on window resize
- **High-DPI Support**: Crisp rendering on retina displays
- **Visual Polish**: Opacity gradient and cyan color scheme on dark background

## Demo

Run locally to see the animation in action:

```bash
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Tech Stack

- **Next.js 15.5.4** - App Router with Turbopack for fast development
- **React 19** - Component architecture
- **TypeScript** - Type-safe vector mathematics
- **HTML5 Canvas** - High-performance rendering engine
- **Tailwind CSS 4** - Minimal styling

## How It Works

The animation uses a fixed grid of anchor points (spaced 35px apart) where each vector:

1. Calculates distance and angle to the mouse cursor
2. Scales its length based on distance using a smoothstep function
3. Renders as a line with a triangle arrowhead
4. Updates at 60fps via `requestAnimationFrame`

### Key Mathematical Implementation

```typescript
// Smoothstep easing for organic transitions
const smoothScale = scale * scale * (3 - 2 * scale);

// Keep-out zone creates clear area around cursor
if (distanceToMouse < keepOutRadius) return 0;
```

## Project Structure

```
field-mouse/
├── app/
│   ├── page.tsx          # Main entry point
│   ├── layout.tsx        # Root layout
│   └── globals.css       # Global styles
├── components/
│   └── VectorField.tsx   # Canvas animation component
├── lib/
│   ├── types.ts          # TypeScript interfaces
│   └── vectorMath.ts     # Pure math functions
├── CLAUDE.md             # AI context & architecture decisions
├── PROGRESS.md           # Detailed implementation docs
└── CHANGELOG.md          # Version history
```

## Configuration

Customize the animation by editing `defaultConfig` in `components/VectorField.tsx`:

```typescript
{
  gridSpacing: 35,         // Distance between vectors
  keepOutRadius: 60,       // Clear zone around cursor
  maxVectorLength: 25,     // Maximum arrow length
  influenceRange: 120,     // Distance for full-length vectors
  vectorColor: '#00ffff',  // Cyan color
  backgroundColor: '#0a0a0a' // Near-black background
}
```

## Development

```bash
# Install dependencies
yarn install

# Run development server
yarn dev

# Build for production
yarn build

# Start production server
yarn start

# Run linter
yarn lint
```

## Performance

- Target: 60fps
- Typical vector count: 600-800 (on 1920×1080 display)
- Rendering: CPU-based canvas operations
- Bottleneck: Drawing operations, not calculations

## Future Enhancements

- Touch support for mobile devices
- Configurable color schemes
- WebGL implementation for 10,000+ vectors
- Particle trail effects
- Sound reactivity
- 3D vector field visualization

## License

MIT

---

Built with [Next.js](https://nextjs.org) | Powered by [Claude Code](https://claude.com/claude-code)
