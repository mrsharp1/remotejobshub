import { Transition } from 'framer-motion'

/**
 * Premium physics settings mirroring the Apple/Linear aesthetic.
 * Usage:
 * <motion.div transition={springs.gentle} />
 */
export const springs = {
  // Snappy, fast interaction for buttons and hover states
  snappy: {
    type: 'spring',
    stiffness: 400,
    damping: 30,
    mass: 1,
  } as Transition,

  // Fluid, gentle entrance for large layout elements
  gentle: {
    type: 'spring',
    stiffness: 100,
    damping: 20,
    mass: 1,
  } as Transition,

  // High-inertia bouncy spring for bottom sheets / drawers
  bouncy: {
    type: 'spring',
    stiffness: 250,
    damping: 20,
    mass: 1,
  } as Transition,

  // Standard smooth ease (similar to linear.app)
  smooth: {
    type: 'tween',
    ease: [0.16, 1, 0.3, 1], // Custom cubic-bezier
    duration: 0.5,
  } as Transition,
}
