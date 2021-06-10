module.exports = {
	mode: 'jit',
	purge: ['./src/**/*.{ts,tsx,html}'],
	darkMode: 'class', // or 'media' or 'class'
	theme: {
		extend: {},
	},
	variants: {
		extend: {},
		scrollbar: ['rounded'],
	},
	plugins: [require('@tailwindcss/line-clamp'), require('tailwind-scrollbar')],
};
