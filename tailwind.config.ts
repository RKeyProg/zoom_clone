import type { Config } from "tailwindcss";

const config = {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: "2rem",
			screens: {
				"2xl": "1400px",
			},
		},
		extend: {
			colors: {
				dark: {
					1: "#1C1F2E",
					2: "#161925",
					3: "#252A41",
					4: "#1E2757",
				},
				blue: {
					1: "#0E78F9",
				},
				sky: {
					1: "#C9DDFF",
					2: "#ECF0FF",
					3: "#F5FCFF",
				},
				orange: {
					1: "#FF742E",
				},
				purple: {
					1: "#830EF9",
				},
				yellow: {
					1: "#F9A90E",
				},
			},
			keyframes: {
				"accordion-down": {
					from: { height: "0" },
					to: { height: "var(--radix-accordion-content-height)" },
				},
				"accordion-up": {
					from: { height: "var(--radix-accordion-content-height)" },
					to: { height: "0" },
				},
				"animate-bot-extend": {
					"0%": {
						borderRadius: "50%",
						width: "3.5rem",
					},

					"5%": {
						borderRadius: "20px",
					},

					"100%": {
						width: "25vw",
						height: "50vh",
						borderRadius: "10px",
					},
				},
				"pulse-slow": {
					"0%, 100%": {
						transform: "scale(1)",
						opacity: "1",
					},
					"50%": {
						transform: "scale(1.05)",
						opacity: "0.9",
					},
				},
				slideUp: {
					"0%": {
						transform: "translateY(20px)",
						opacity: "0",
					},
					"100%": {
						transform: "translateY(0)",
						opacity: "1",
					},
				},
				fadeIn: {
					"0%": {
						opacity: "0",
					},
					"100%": {
						opacity: "1",
					},
				},
			},
			animation: {
				"accordion-down": "accordion-down 0.2s ease-out",
				"accordion-up": "accordion-up 0.2s ease-out",
				"bot-extend": "animate-bot-extend 0.2s ease-in-out forwards",
				"pulse-slow": "pulse-slow 2s infinite ease-in-out",
				slideUp: "slideUp 0.3s ease forwards",
				fadeIn: "fadeIn 0.2s ease forwards",
			},
			backgroundImage: {
				hero: "url('/images/hero-background.png')",
			},
		},
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;

export default config;
