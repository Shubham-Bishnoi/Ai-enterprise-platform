/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive) / <alpha-value>)",
          foreground: "hsl(var(--destructive-foreground) / <alpha-value>)",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
      },
      borderRadius: {
        xl: "calc(var(--radius) + 4px)",
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        xs: "calc(var(--radius) - 6px)",
        '2xl': '16px',
        '3xl': '24px',
        '4xl': '28px',
      },
      boxShadow: {
        xs: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
        'glass': '0 24px 80px rgba(0,0,0,0.35)',
        'glass-hover': '0 32px 96px rgba(0,0,0,0.45)',
        'glass-elevated': '0 16px 48px rgba(0,0,0,0.30)',
        'glow-red': '0 0 40px rgba(239,35,60,0.15)',
        'glow-blue': '0 0 40px rgba(23,139,255,0.15)',
        'glow-green': '0 0 20px rgba(34,197,94,0.15)',
        'glow-amber': '0 0 20px rgba(245,158,11,0.15)',
        'btn-primary': '0 4px 24px rgba(239,35,60,0.25)',
        'btn-primary-hover': '0 4px 32px rgba(23,139,255,0.30)',
        'dropdown': '0 16px 48px rgba(0,0,0,0.40)',
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "caret-blink": {
          "0%,70%,100%": { opacity: "1" },
          "20%,50%": { opacity: "0" },
        },
        "card-enter": {
          from: { opacity: "0", transform: "translateY(20px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "pulse-glow": {
          "0%, 100%": { boxShadow: "0 0 8px var(--glow-color), 0 0 16px var(--glow-color)", opacity: "1" },
          "50%": { boxShadow: "0 0 16px var(--glow-color), 0 0 32px var(--glow-color)", opacity: "0.8" },
        },
        "gradient-sweep": {
          "0%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
          "100%": { backgroundPosition: "0% 50%" },
        },
        "progress-fill": {
          from: { width: "0%" },
          to: { width: "var(--target-width, 100%)" },
        },
        "shimmer-sweep": {
          from: { transform: "translateX(-100%)" },
          to: { transform: "translateX(200%)" },
        },
        "ambient-drift": {
          "0%, 100%": { transform: "translate(0, 0) scale(1)" },
          "33%": { transform: "translate(20px, -15px) scale(1.02)" },
          "66%": { transform: "translate(-10px, 10px) scale(0.98)" },
        },
        "fade-in": {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        "slide-up": {
          from: { opacity: "0", transform: "translateY(8px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "slide-in-right": {
          from: { opacity: "0", transform: "translateX(120%)" },
          to: { opacity: "1", transform: "translateX(0)" },
        },
        "slide-out-right": {
          from: { opacity: "1", transform: "translateX(0)" },
          to: { opacity: "0", transform: "translateX(20px)" },
        },
        "scale-in": {
          from: { opacity: "0", transform: "scale(0.8)" },
          to: { opacity: "1", transform: "scale(1)" },
        },
        "highlight-flash": {
          "0%": { backgroundColor: "rgba(23,139,255,0.05)" },
          "100%": { backgroundColor: "transparent" },
        },
        "spin": {
          from: { transform: "rotate(0deg)" },
          to: { transform: "rotate(360deg)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "caret-blink": "caret-blink 1.25s ease-out infinite",
        "card-enter": "card-enter 500ms cubic-bezier(0.16, 1, 0.3, 1) forwards",
        "pulse-glow": "pulse-glow 2s linear infinite",
        "gradient-sweep": "gradient-sweep 8s ease infinite",
        "progress-fill": "progress-fill 800ms cubic-bezier(0.16, 1, 0.3, 1) forwards",
        "shimmer-sweep": "shimmer-sweep 3s linear infinite",
        "ambient-drift": "ambient-drift 20s ease-in-out infinite",
        "fade-in": "fade-in 400ms cubic-bezier(0.16, 1, 0.3, 1) forwards",
        "slide-up": "slide-up 400ms cubic-bezier(0.16, 1, 0.3, 1) forwards",
        "slide-in-right": "slide-in-right 300ms cubic-bezier(0.16, 1, 0.3, 1) forwards",
        "slide-out-right": "slide-out-right 200ms ease-in forwards",
        "scale-in": "scale-in 200ms cubic-bezier(0.34, 1.56, 0.64, 1) forwards",
        "highlight-flash": "highlight-flash 1.5s ease-out forwards",
        "spin": "spin 1s linear infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}
