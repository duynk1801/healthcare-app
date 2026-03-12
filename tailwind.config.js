/** @type {import('tailwindcss').Config} */
module.exports = {
  // NativeWind v4 — scan all component files
  content: ['./app/**/*.{js,jsx,ts,tsx}', './src/**/*.{js,jsx,ts,tsx}'],

  presets: [require('nativewind/preset')],

  theme: {
    extend: {
      // ─── Colors (from Figma Healthcare Design System) ───
      colors: {
        primary: {
          50: '#E6F4FE',
          100: '#BAE0FC',
          200: '#8ECCFA',
          300: '#5CB6F7',
          400: '#3AA5F5',
          500: '#2196F3', // Default primary
          600: '#1E87E0',
          700: '#1A75C9',
          800: '#1664B3',
          900: '#0E4A8F',
        },
        success: {
          50: '#E8F5E9',
          100: '#C8E6C9',
          300: '#81C784',
          500: '#4CAF50', // Default
          700: '#388E3C',
          900: '#1B5E20',
        },
        teal: {
          50: '#E0F2F1',
          300: '#4DB6AC',
          500: '#009688', // Telemedicine accent
          700: '#00796B',
          900: '#004D40',
        },
        danger: {
          50: '#FFEBEE',
          300: '#E57373',
          500: '#F44336', // Error / End Call
          700: '#D32F2F',
          900: '#B71C1C',
        },
        warning: {
          50: '#FFF3E0',
          300: '#FFB74D',
          500: '#FF9800', // Warning
          700: '#F57C00',
        },
        purple: {
          50: '#F3E5F5',
          300: '#BA68C8',
          500: '#9C27B0', // PiP local video
          700: '#7B1FA2',
        },
        neutral: {
          50: '#FAFAFA',
          100: '#F5F5F5',
          200: '#EEEEEE',
          300: '#E0E0E0',
          400: '#BDBDBD',
          500: '#9E9E9E',
          600: '#757575',
          700: '#616161',
          800: '#424242',
          900: '#212121',
        },
      },

      // ─── Spacing (8px grid system) ───
      spacing: {
        0.5: '2px', // xxs
        1: '4px', // xs
        2: '8px', // sm
        3: '12px', // md
        4: '16px', // lg (Figma default)
        5: '20px', // xl
        6: '24px', // 2xl (card padding)
        8: '32px', // 3xl (section)
        10: '40px', // 4xl
        12: '48px', // 5xl (hero)
      },

      // ─── Border Radius (Figma: 16px) ───
      borderRadius: {
        xs: '4px',
        sm: '8px',
        md: '12px',
        lg: '16px', // Figma default
        xl: '20px',
        '2xl': '24px',
      },

      // ─── Typography (Accessible Large Fonts) ───
      fontSize: {
        xs: ['11px', { lineHeight: '16px' }],
        sm: ['13px', { lineHeight: '18px' }],
        base: ['15px', { lineHeight: '22px' }],
        lg: ['17px', { lineHeight: '24px' }],
        xl: ['20px', { lineHeight: '28px' }],
        '2xl': ['24px', { lineHeight: '32px' }],
        '3xl': ['28px', { lineHeight: '36px' }],
        '4xl': ['34px', { lineHeight: '42px' }],
      },

      // ─── Font Family ───
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['SpaceMono', 'monospace'],
      },

      // ─── Shadows ───
      boxShadow: {
        card: '0 2px 4px rgba(0, 0, 0, 0.08)',
        'card-lg': '0 4px 8px rgba(0, 0, 0, 0.12)',
      },
    },
  },

  plugins: [],
};
