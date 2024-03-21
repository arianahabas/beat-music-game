/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ["./src/**/*.{html,ts}"],
	daisyui: {
		themes: ["dracula", "cyberpunk", "light", "aqua", "acid", "cmyk"],
	},

	plugins: [require("daisyui")],
	
};
