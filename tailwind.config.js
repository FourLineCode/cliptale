module.exports = {
	mode: 'jit',
	purge: ['./src/**/*.{ts,tsx,html}'],
	darkMode: false, // or 'media' or 'class'
	theme: {
		extend: {},
	},
	variants: {
		extend: {},
		scrollbar: ['rounded'],
	},
	plugins: [require('@tailwindcss/line-clamp'), require('tailwind-scrollbar')],
};
