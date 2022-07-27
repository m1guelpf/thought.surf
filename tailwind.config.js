const colors = require('tailwindcss/colors')

/** @type {import('tailwindcss/tailwind-config').TailwindConfig} */
module.exports = {
	content: ['./src/**/*.{js,ts,jsx,tsx}'],
	darkMode: 'class',
	theme: {
		extend: {
			colors: {
				'soft-black': '#141415',
				gray: colors.neutral,
			},
			animation: {
				loading: 'loading 2s linear infinite',
			},
			boxShadow: {
				card: '0 8px 30px rgba(0, 0, 0, 0.12)',
			},
			keyframes: {
				loading: {
					to: { strokeDashoffset: '0px' },
				},
			},
		},
	},
	plugins: [require('@tailwindcss/typography'), require('@tailwindcss/line-clamp')],
}
