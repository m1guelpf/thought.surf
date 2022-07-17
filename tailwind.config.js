const colors = require('tailwindcss/colors')

/** @type {import('tailwindcss/tailwind-config').TailwindConfig} */
module.exports = {
	content: ['./src/**/*.{js,ts,jsx,tsx}'],
	darkMode: 'class',
	theme: {
		extend: {
			colors: {
				'soft-black': '#141415',
				gray: colors.slate,
			},
			animation: {
				loading: 'loading 2s linear infinite',
			},
			keyframes: {
				loading: {
					to: { strokeDashoffset: '0px' },
				},
			},
		},
	},
	plugins: [require('@tailwindcss/typography')],
}
