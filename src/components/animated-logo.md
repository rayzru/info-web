# AnimatedLogo Component

Hover-animated version of the SR2 logo that expands from compact "СР2" to the full "СЕРДЦЕ РОСТОВА 2" text.

## Features

- **Hover-activated**: Logo expands on mouse hover
- **Smooth animation**: Ease-out transition for natural feel
- **Compact initial state**: Starts with "СР2" close together
- **Customizable duration**: Control animation speed
- **Responsive**: Works at any size
- **Theme-aware**: Adapts to dark/light mode

## Usage

### Basic Example

```tsx
import { AnimatedLogo } from "~/components/animated-logo";

export function MyComponent() {
  return <AnimatedLogo />;
}
```

### With Custom Duration

```tsx
// Fast animation (300ms)
<AnimatedLogo duration={300} />

// Slow animation (1 second)
<AnimatedLogo duration={1000} />

// Default is 600ms
<AnimatedLogo />
```

### Custom Styling

```tsx
// Control size with className
<AnimatedLogo className="w-64" />
<AnimatedLogo className="w-full max-w-md" />
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `duration` | `number` | `400` | Animation duration in milliseconds |
| `className` | `string` | - | Additional CSS classes |
| `...props` | `React.HTMLAttributes<HTMLDivElement>` | - | Standard div props |

## Demo

Visit `/logo-demo` to see all animation variations in action.

## Technical Details

### Animation Approach

The component uses CSS transitions on SVG path elements:

1. **Initial state**: "СР2" letters are positioned close together using `translateX`
2. **Hover state**: All letters fade in and visible letters slide to their original positions
3. **Transition**: Smooth `ease-out` timing for natural expansion

### Implementation

- Hidden letters (all except С, Р, 2): `opacity: 0` → `opacity: 1` on hover with staggered delays
- Visible letters (С, Р, 2): `translateX(-distance)` → `translateX(0)` on hover
- Letters appear sequentially in stages for smooth reveal effect
- CSS transitions handle all animations with calculated delays

### Performance

- Uses CSS transitions (GPU-accelerated)
- No JavaScript running during animation
- Minimal re-renders (only on hover state change)

### Browser Compatibility

Works in all modern browsers that support:
- CSS transitions
- SVG
- React 18+

## Examples

### In Navigation Bar

```tsx
import { AnimatedLogo } from "~/components/animated-logo";

export function Header() {
  return (
    <header>
      <AnimatedLogo className="h-8" />
    </header>
  );
}
```

### As Hero Element

```tsx
import { AnimatedLogo } from "~/components/animated-logo";

export function Hero() {
  return (
    <section className="py-20">
      <div className="container">
        <AnimatedLogo
          duration={800}
          className="mx-auto max-w-2xl"
        />
        <p className="mt-8 text-center">
          Ваш путеводитель по ЖК Сердце Ростова 2
        </p>
      </div>
    </section>
  );
}
```

### With Link

```tsx
import Link from "next/link";
import { AnimatedLogo } from "~/components/animated-logo";

export function LogoLink() {
  return (
    <Link href="/">
      <AnimatedLogo className="h-10" />
    </Link>
  );
}
```
