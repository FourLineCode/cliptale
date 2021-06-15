const colors = require('tailwindcss/colors');

module.exports = {
	mode: 'jit',
	purge: ['./src/**/*.{ts,tsx,html}'],
	darkMode: 'class', // or 'media' or 'class'
	theme: {
		extend: {
			colors: {
				brand: colors.blue,
				gray: colors.trueGray,
			},
			transitionProperty: {
				width: 'width',
			},
		},
	},
	variants: {
		extend: {},
		scrollbar: ['rounded'],
	},
	plugins: [require('@tailwindcss/line-clamp'), require('tailwind-scrollbar')],
};
