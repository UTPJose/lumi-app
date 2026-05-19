// Card and container base styles
export const CARD_STYLES = {
  base: 'rounded-2xl border-2 transition-all active:scale-98',
  white: 'bg-white border-border hover:border-primary/50',
  secondary: 'bg-secondary border-border',
  accent: 'bg-accent/20 border-accent',
  withPadding: 'p-6 rounded-2xl border-2 border-border',
  clickable: 'cursor-pointer hover:shadow-md transition-all active:scale-98',
};

// Page layout patterns (14 pages use this same structure)
export const PAGE_LAYOUT = {
  container: 'min-h-screen bg-background pb-24',
  inner: 'max-w-md mx-auto px-6 py-8 space-y-8',
  section: 'space-y-4',
  heading: 'text-3xl font-bold mb-2',
  subheading: 'text-2xl font-semibold mb-4',
};

// Icon box sizes and styles
export const ICON_BOX = {
  small: 'w-12 h-12 rounded-xl flex items-center justify-center',
  medium: 'w-16 h-16 rounded-2xl flex items-center justify-center',
  large: 'w-24 h-24 rounded-full flex items-center justify-center',
};

// Input and form field styles
export const INPUT_STYLES = 'w-full min-h-[60px] px-6 py-4 bg-white rounded-2xl border-2 border-border focus:border-primary focus:outline-none transition-colors placeholder-muted-foreground';

// Button and interactive element styles
export const BUTTON_STYLES = {
  base: 'transition-all active:scale-98 font-semibold',
  primary: 'bg-primary text-primary-foreground hover:bg-primary/90',
  secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
  outline: 'border-2 border-border hover:border-primary/50 text-foreground',
  ghost: 'hover:bg-accent/10 text-foreground',
  large: 'px-6 py-3 rounded-2xl text-lg',
  medium: 'px-4 py-2 rounded-xl text-base',
  small: 'px-3 py-1 rounded-lg text-sm',
};

// Activity card patterns
export const ACTIVITY_CARD = {
  base: 'bg-white p-6 rounded-2xl border-2 border-border',
  incomplete: 'border-border hover:border-primary/50',
  completed: 'border-primary/50 opacity-70',
  interactive: 'cursor-pointer transition-all active:scale-98',
};

// Grid and layout helpers
export const GRID = {
  double: 'grid grid-cols-2 gap-4',
  triple: 'grid grid-cols-3 gap-3',
  single: 'grid grid-cols-1 gap-4',
};

// Flex utilities for common patterns
export const FLEX = {
  between: 'flex items-center justify-between',
  center: 'flex items-center justify-center',
  startCenter: 'flex items-center',
  endCenter: 'flex items-center justify-end',
};

// Text and typography
export const TEXT = {
  title: 'text-2xl font-bold',
  subtitle: 'text-lg font-semibold text-foreground/90',
  body: 'text-base text-foreground',
  caption: 'text-sm text-muted-foreground',
  label: 'text-sm font-medium text-foreground',
};

// Spacing helpers
export const SPACING = {
  section: 'space-y-6',
  component: 'space-y-4',
  compact: 'space-y-2',
};

// Combine utilities
export const combineClasses = (...classes: (string | undefined | null | false)[]): string => {
  return classes.filter(Boolean).join(' ');
};
