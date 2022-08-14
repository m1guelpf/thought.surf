const colors = require('tailwindcss/colors')
const plugin = require('tailwindcss/plugin')
const defaultTheme = require('tailwindcss/defaultTheme')

/** @type {import('tailwindcss/tailwind-config').TailwindConfig} */
module.exports = {
	content: ['./src/**/*.{js,ts,jsx,tsx}'],
	darkMode: 'class',
	theme: {
		extend: {
			fontFamily: {
				rbk: ['RubikVariable', ...defaultTheme.fontFamily.sans],
				sans: ['Inter', ...defaultTheme.fontFamily.sans],
			},
			colors: {
				'soft-black': '#141415',
				gray: colors.neutral,
			},
			animation: {
				loading: 'loading 2s linear infinite',
				'scale-in': 'scale-in 0.2s ease-in-out',
				'rainbow-colors': 'rainbow-colors 1s linear 0s infinite',
				'slide-down': 'slide-down 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
				'slide-up': 'slide-up 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
			},
			boxShadow: {
				card: '0 8px 30px rgba(0, 0, 0, 0.12)',
				border: 'inset 0 0 1px 1px rgba(0, 0, 0, 0.015)',
			},
			keyframes: {
				loading: {
					to: { strokeDashoffset: '0px' },
				},
				'scale-in': {
					'0%': { opacity: 0, transform: 'scale(0)' },
					'100%': { opacity: 1, transform: 'scale(1)' },
				},
				'slide-down': {
					'0%': { opacity: 0, transform: 'translateY(-10px)' },
					'100%': { opacity: 1, transform: 'translateY(0)' },
				},
				'slide-up': {
					'0%': { opacity: 0, transform: 'translateY(10px)' },
					'100%': { opacity: 1, transform: 'translateY(0)' },
				},
				'rainbow-colors': {
					'0%, 100%': {
						color: '#6666ff',
						borderColor: '#6666ff',
					},
					'10%': {
						color: '#0099ff',
						borderColor: '#0099ff',
					},
					'50%': {
						color: '#00ff00',
						borderColor: '#00ff00',
					},
					'75%': {
						color: '#ff3399',
						borderColor: '#ff3399',
					},
				},
			},
		},
	},
	plugins: [
		require('@tailwindcss/typography'),
		require('@tailwindcss/line-clamp'),
		require('tailwindcss-radix')({ variantPrefix: false }),
		plugin(({ addVariant }) => addVariant('selected', "&[aria-selected='true']")),
	],
}
