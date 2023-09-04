/* eslint-env node */
module.exports = {
	env: {
		browser: true,
		es2021: true,
	},
	plugins: ["@typescript-eslint", "jsx-a11y"],
	extends: [
		"eslint:recommended",
		"plugin:@typescript-eslint/recommended",
		"plugin:astro/recommended",
		"plugin:astro/jsx-a11y-recommended",
	],
	overrides: [
		{
			files: ["*.astro"],
			parser: "astro-eslint-parser",
			parserOptions: {
				parser: "@typescript-eslint/parser",
				extraFileExtensions: [".astro"],
			},
			rules: {
				"astro/no-unused-css-selector": 1,
				"no-mixed-spaces-and-tabs":0,
					
			},
		},
	],
	parser: "@typescript-eslint/parser",
	parserOptions: {
		ecmaVersion: "latest",
		sourceType: "module",
	},rules:{
		"@typescript-eslint/no-unused-vars":[1,{
			varsIgnorePattern:"_"
		}]		
	}
};
