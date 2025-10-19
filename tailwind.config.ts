
import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				},
			// Zapier-inspired colors (no yellow)
			orange: {
				50: '#FFF5F0',
				100: '#FFE6D9',
				200: '#FFCCB3',
				300: '#FFB38C',
				400: '#FF9966',
				500: '#FF7F40',
				600: '#FF6633',
				700: '#E65C2E',
				800: '#CC5229',
				900: '#B34824',
			},
			purple: {
				50: '#FAF5FF',
				100: '#F3E8FF',
				200: '#E9D5FF',
				300: '#D8B4FE',
				400: '#C084FC',
				500: '#A855F7',
				600: '#9333EA',
				700: '#7E22CE',
				800: '#6B21A8',
				900: '#581C87',
			},
			blue: {
				50: '#EFF6FF',
				100: '#DBEAFE',
				200: '#BFDBFE',
				300: '#93C5FD',
				400: '#60A5FA',
				500: '#3B82F6',
				600: '#2563EB',
				700: '#1D4ED8',
				800: '#1E40AF',
				900: '#1E3A8A',
			},
			green: {
				50: '#F0FDF4',
				100: '#DCFCE7',
				200: '#BBF7D0',
				300: '#86EFAC',
				400: '#4ADE80',
				500: '#22C55E',
				600: '#16A34A',
				700: '#15803D',
				800: '#166534',
				900: '#14532D',
			},
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out'
			},
			fontFamily: {
				sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
			},
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
