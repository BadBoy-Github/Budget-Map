import type {Config} from 'tailwindcss';

export default {
  darkMode: ['class'],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        // Handwritten marker style for headings, legible hand for body copy
        body: ['"Patrick Hand"', 'cursive'],
        headline: ['Kalam', 'cursive'],
        code: ['monospace'],
      },
      colors: {
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        // Signature sketchy tokens
        postit: {
          DEFAULT: 'hsl(var(--postit))',
          foreground: 'hsl(var(--postit-foreground))',
        },
        tape: 'hsl(var(--tape))',
        chart: {
          '1': 'hsl(var(--chart-1))',
          '2': 'hsl(var(--chart-2))',
          '3': 'hsl(var(--chart-3))',
          '4': 'hsl(var(--chart-4))',
          '5': 'hsl(var(--chart-5))',
        },
        sidebar: {
          DEFAULT: 'hsl(var(--sidebar-background))',
          foreground: 'hsl(var(--sidebar-foreground))',
          primary: 'hsl(var(--sidebar-primary))',
          'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
          accent: 'hsl(var(--sidebar-accent))',
          'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
          border: 'hsl(var(--sidebar-border))',
          ring: 'hsl(var(--sidebar-ring))',
        },
      },
      /**
       * Wobbly, hand-drawn radii. There is no `rounded-full` in this design
       * system — `sm`/`md`/`lg` are remapped so every primitive inherits an
       * organic edge without one-off overrides.
       */
      borderRadius: {
        wobbly: '255px 15px 225px 15px / 15px 225px 15px 255px',
        wobblyLg: '340px 26px 300px 26px / 26px 300px 26px 340px',
        wobblySm: '22px 8px 20px 8px / 8px 20px 8px 22px',
        lg: '255px 15px 225px 15px / 15px 225px 15px 255px',
        md: '22px 8px 20px 8px / 8px 20px 8px 22px',
        sm: '14px 5px 13px 5px / 5px 13px 5px 14px',
      },
      /**
       * Hard offset shadows only — never blur. The offset change between
       * states produces the lift / press-flat interaction.
       */
      boxShadow: {
        sketch: '4px 4px 0px 0px hsl(var(--foreground))',
        'sketch-lg': '8px 8px 0px 0px hsl(var(--foreground))',
        'sketch-sm': '2px 2px 0px 0px hsl(var(--foreground))',
        'sketch-paper': '6px 6px 0px 0px hsl(var(--foreground) / 0.85)',
        'sketch-soft': '3px 3px 0px 0px hsl(var(--foreground) / 0.12)',
      },
      keyframes: {
        'accordion-down': {
          from: {
            height: '0',
          },
          to: {
            height: 'var(--radix-accordion-content-height)',
          },
        },
        'accordion-up': {
          from: {
            height: 'var(--radix-accordion-content-height)',
          },
          to: {
            height: '0',
          },
        },
        // Dialogs settle into place with a tiny hand-drawn wobble
        'sketch-pop': {
          '0%': {
            opacity: '0',
            transform: 'translate(-50%, -46%) scale(0.94) rotate(-0.8deg)',
          },
          '70%': {
            opacity: '1',
            transform: 'translate(-50%, -50%) scale(1.01) rotate(0.3deg)',
          },
          '100%': {
            opacity: '1',
            transform: 'translate(-50%, -50%) scale(1) rotate(0deg)',
          },
        },
        'sketch-pop-out': {
          from: {
            opacity: '1',
            transform: 'translate(-50%, -50%) scale(1) rotate(0deg)',
          },
          to: {
            opacity: '0',
            transform: 'translate(-50%, -48%) scale(0.95) rotate(0.6deg)',
          },
        },
        'sketch-fade-in': {
          from: {opacity: '0'},
          to: {opacity: '1'},
        },
        'sketch-fade-out': {
          from: {opacity: '1'},
          to: {opacity: '0'},
        },
        // Gentle idle bounce for decorative doodles
        'sketch-bounce': {
          '0%, 100%': {transform: 'translateY(0) rotate(-2deg)'},
          '50%': {transform: 'translateY(-8px) rotate(2deg)'},
        },
        'sketch-wiggle': {
          '0%, 100%': {transform: 'rotate(-1.5deg)'},
          '50%': {transform: 'rotate(1.5deg)'},
        },
        'sketch-draw': {
          from: {transform: 'scaleX(0)'},
          to: {transform: 'scaleX(1)'},
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'sketch-pop': 'sketch-pop 0.22s ease-out',
        'sketch-pop-out': 'sketch-pop-out 0.15s ease-in',
        'sketch-fade-in': 'sketch-fade-in 0.2s ease-out',
        'sketch-fade-out': 'sketch-fade-out 0.15s ease-in',
        'sketch-bounce': 'sketch-bounce 3s ease-in-out infinite',
        'sketch-wiggle': 'sketch-wiggle 4s ease-in-out infinite',
        'sketch-draw': 'sketch-draw 0.4s ease-out',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
} satisfies Config;
