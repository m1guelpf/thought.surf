const colors = require('tailwindcss/colors')

/** @type {import('tailwindcss/tailwind-config').TailwindConfig} */
module.exports = {
	content: ['./src/**/*.{js,ts,jsx,tsx}'],
	darkMode: 'class',
	theme: {
		extend: {
			boxShadow: theme => ({
				nav: '0 3px 0 #000',
				'nav-dark': `0 3px 0 ${theme('colors.gray.200')}`,
			}),
			colors: {
				'soft-black': '#141415',
				gray: colors.slate,
			},
		},
	},
	plugins: [],
}
