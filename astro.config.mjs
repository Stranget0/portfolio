import { defineConfig } from "astro/config";
import UnoCSS from "unocss/astro";
import { visualizer } from "rollup-plugin-visualizer";
import mdx from "@astrojs/mdx";
import solidJs from "@astrojs/solid-js";

import partytown from "@astrojs/partytown";

// https://astro.build/config
export default defineConfig({
	integrations: [
		UnoCSS(),
		mdx(),
		solidJs(),
		partytown({
			config: {
				forward: [
					"dataLayer.push",
					"hj",
					"hjBootstrap",
					"hjLazyModules",
					"hjSiteSettings",
					"_hjSettings",
					"_hjSettings.hjid",
					"_hjSettings.hjsv",
				],
			},
		}),
	],
	vite: {
		plugins: [
			visualizer({
				template: "sunburst",
				gzipSize: true,
				brotliSize: true,
				filename: "generated/bundle.html",
			}),
		],
	},
	site: "https://msmarzewski.pl",
	compressHTML: true,
});
