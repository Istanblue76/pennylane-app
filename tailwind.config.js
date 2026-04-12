/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#1a1a1a',    
        secondary: '#f4e4c1',   
        accent: '#c9a861',      
        dark: '#0d0d0d',        
        textPrimary: '#ffffff', 
        textSecondary: '#b0b0b0' 
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'serif'],
        sans: ['Inter', 'sans-serif'],
      },
      animation: {
        fadeIn: 'fadeIn 0.6s ease-in',
        slideInUp: 'slideInUp 0.8s ease-out',
        glow: 'glow 2s ease-in-out infinite'
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideInUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        glow: {
          '0%, 100%': { boxShadow: '0 0 5px rgba(244, 228, 193, 0.4)' },
          '50%': { boxShadow: '0 0 20px rgba(244, 228, 193, 0.8)' },
        }
      }
    },
  },
  plugins: [],
}
