import type { Config } from "tailwindcss";
import tailwindCssAnimate from "tailwindcss-animate";

const config: Config = {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{js,ts,jsx,tsx,mdx}",
		"./components/**/*.{js,ts,jsx,tsx,mdx}",
		"./app/**/*.{js,ts,jsx,tsx,mdx}",
	],
	theme: {
		extend: {
			colors: {
				main: {
					'1': '#328ef6',
					'2': '#32f7b9',
					'3': '#f6f032',
					'4': '#f733c6',
					'5': '#f74932',
					'6': '#57f633',
					'7': '#8033f7'
				},
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				chart: {
					'1': 'hsl(var(--chart-1))',
					'2': 'hsl(var(--chart-2))',
					'3': 'hsl(var(--chart-3))',
					'4': 'hsl(var(--chart-4))',
					'5': 'hsl(var(--chart-5))'
				},
				textSecondary: 'hsl(var(--text-secondary))',
				textGraycustom: 'hsl(var(--text-graycustom))',
			},
			backgroundImage: {
				'gradient-1': 'linear-gradient(135deg, #3B82F6, #1E40AF)',
				'gradient-1-light': 'linear-gradient(135deg, #60A5FA, #2563EB)',
				'gradient-1-dark': 'linear-gradient(135deg, #2563EB, #1E3A8A)',
				'gradient-2': 'linear-gradient(135deg, #10B981, #047857)',
				'gradient-2-light': 'linear-gradient(135deg, #34D399, #059669)',
				'gradient-2-dark': 'linear-gradient(135deg, #047857, #064E3B)',
				'gradient-3': 'linear-gradient(135deg, #F59E0B, #D97706)',
				'gradient-3-light': 'linear-gradient(135deg, #FCD34D, #F59E0B)',
				'gradient-3-dark': 'linear-gradient(135deg, #D97706, #92400E)',
				'gradient-4': 'linear-gradient(135deg, #6366F1, #4338CA)',
				'gradient-4-light': 'linear-gradient(135deg, #818CF8, #6366F1)',
				'gradient-4-dark': 'linear-gradient(135deg, #4338CA, #312E81)',
				'gradient-5': 'linear-gradient(135deg, #EF4444, #DC2626)',
				'gradient-5-light': 'linear-gradient(135deg, #FCA5A5, #EF4444)',
				'gradient-5-dark': 'linear-gradient(135deg, #DC2626, #991B1B)',
				'gradient-6': 'linear-gradient(135deg, #8B5CF6, #6D28D9)',
				'gradient-6-light': 'linear-gradient(135deg, #A78BFA, #8B5CF6)',
				'gradient-6-dark': 'linear-gradient(135deg, #6D28D9, #4C1D95)',
				'dark-gradient-1': 'linear-gradient(135deg, #1F2937, #111827)',
				'dark-gradient-2': 'linear-gradient(135deg, #111827, #0F172A)',
				main: 'linear-gradient(#E6F1FE, #CCE3FD)',
				'main-dark': 'linear-gradient(#1a2238, #17203a)'
			},
			textColor: {
				'gradient-1': 'bg-gradient-1 bg-clip-text text-transparent',
				'gradient-2': 'bg-gradient-2 bg-clip-text text-transparent',
				'gradient-3': 'bg-gradient-3 bg-clip-text text-transparent',
				'gradient-4': 'bg-gradient-4 bg-clip-text text-transparent',
				'gradient-5': 'bg-gradient-5 bg-clip-text text-transparent',
				'gradient-6': 'bg-gradient-6 bg-clip-text text-transparent'
			},
			boxShadow: {
				'gradient-1': '0 10px 15px -3px rgba(59, 130, 246, 0.4), 0 4px 6px -2px rgba(59, 130, 246, 0.2)',
				'gradient-2': '0 10px 15px -3px rgba(16, 185, 129, 0.4), 0 4px 6px -2px rgba(16, 185, 129, 0.2)',
				'gradient-3': '0 10px 15px -3px rgba(245, 158, 11, 0.4), 0 4px 6px -2px rgba(245, 158, 11, 0.2)',
				'gradient-4': '0 10px 15px -3px rgba(99, 102, 241, 0.4), 0 4px 6px -2px rgba(99, 102, 241, 0.2)',
				'gradient-5': '0 10px 15px -3px rgba(239, 68, 68, 0.4), 0 4px 6px -2px rgba(239, 68, 68, 0.2)',
				'gradient-6': '0 10px 15px -3px rgba(139, 92, 246, 0.4), 0 4px 6px -2px rgba(139, 92, 246, 0.2)'
			},
			screens: {
				'3/2xl': '1430px'
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
			}
		}
	},
	plugins: [tailwindCssAnimate],
};
export default config;
