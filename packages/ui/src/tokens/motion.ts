// Nudum Motion Tokens (Durations and Easing Curves)
export const durations = {
  instant: "0ms",
  fast: "150ms", // hover, focus, scale micro-animations
  normal: "300ms", // collapse, drawer transitions
  slow: "500ms" // dialog overlay fades
} as const;

export const easings = {
  default: "cubic-bezier(0.4, 0, 0.2, 1)",
  linear: "linear",
  easeIn: "cubic-bezier(0.4, 0, 1, 1)",
  easeOut: "cubic-bezier(0, 0, 0.2, 1)",
  easeInOut: "cubic-bezier(0.4, 0, 0.2, 1)"
} as const;
