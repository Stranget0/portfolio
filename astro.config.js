import { defineConfig } from "astro/config";
import UnoCSS from "unocss/astro";
import { visualizer } from "rollup-plugin-visualizer";
import mdx from "@astrojs/mdx";
import solidJs from "@astrojs/solid-js";
import partytown from "@astrojs/partytown";

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
  image: {
     service: {
       entrypoint: 'astro/assets/services/noop'
    }
	}
});
