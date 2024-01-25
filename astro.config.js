import { defineConfig } from "astro/config";
import UnoCSS from "unocss/astro";
import { visualizer } from "rollup-plugin-visualizer";
import mdx from "@astrojs/mdx";
import solidJs from "@astrojs/solid-js";
import partytown from "@astrojs/partytown";

import sitemap from "@astrojs/sitemap";
import { defaultLang, languageKeys } from "./src/i18n/constants";

// https://astro.build/config
export default defineConfig({
	integrations: [
		UnoCSS(),
		mdx(),
		solidJs(),
		partytown({
			config: {
				forward: ["dataLayer.push", "gtag"],
			},
		}),
		sitemap({
			i18n: {
				defaultLocale: defaultLang,
				locales: languageKeys,
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
