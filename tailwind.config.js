/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        radar: {
          bg: '#F2F0F7',
          card: '#FFFFFF',
          text: '#17171D',
          muted: '#777780',
          border: '#E7E5EC',
          // Dark mode counterparts
          darkBg: '#0F0F13',
          darkCard: '#17171E',
          darkBorder: '#272732',
          darkMuted: '#9B9BA7',
        },
        category: {
          assignment: {
            DEFAULT: '#8B5CF6',
            light: '#F3EEFD',
            border: '#DDD2FA',
            dark: '#A78BFA'
          },
          quiz: {
            DEFAULT: '#3B82F6',
            light: '#EFF6FF',
            border: '#BFDBFE',
            dark: '#60A5FA'
          },
          exam: {
            DEFAULT: '#F59E0B',
            light: '#FEF3C7',
            border: '#FDE68A',
            dark: '#FBBF24'
          },
          lab: {
            DEFAULT: '#10B981',
            light: '#ECFDF5',
            border: '#A7F3D0',
            dark: '#34D399'
          },
          presentation: {
            DEFAULT: '#F43F5E',
            light: '#FFF1F2',
            border: '#FECDD3',
            dark: '#FB7185'
          },
          project: {
            DEFAULT: '#6366F1',
            light: '#EEF2FF',
            border: '#C7D2FE',
            dark: '#818CF8'
          },
          other: {
            DEFAULT: '#64748B',
            light: '#F1F5F9',
            border: '#CBD5E1',
            dark: '#94A3B8'
          }
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      boxShadow: {
        'soft': '0 2px 10px -2px rgba(17, 17, 26, 0.04), 0 1px 3px 0 rgba(17, 17, 26, 0.02)',
        'card': '0 4px 20px -2px rgba(23, 23, 29, 0.05), 0 1px 4px -1px rgba(23, 23, 29, 0.03)',
        'float': '0 20px 35px -10px rgba(23, 23, 29, 0.08), 0 1px 3px 0 rgba(23, 23, 29, 0.02)',
      }
    },
  },
  plugins: [],
}

