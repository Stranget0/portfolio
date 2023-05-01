/// <reference types="vitest" />
import { defineConfig } from "vite";
import path from "path";

export default defineConfig({
	resolve: {
		alias: {
			"@components": path.resolve(__dirname, "./src/components"),
			"@layouts": path.resolve(__dirname, "./src/layouts"),
			"@utils": path.resolve(__dirname, "./src/utils"),
		},
	},
});
