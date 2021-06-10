module.exports = {
	mode: 'jit',
	purge: ['./src/**/*.{ts,tsx,html}'],
	darkMode: 'class', // or 'media' or 'class'
	theme: {
		extend: {
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
