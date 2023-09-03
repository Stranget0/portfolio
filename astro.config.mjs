import { defineConfig } from "astro/config";
import UnoCSS from "unocss/astro";
import { visualizer } from "rollup-plugin-visualizer";
import mdx from "@astrojs/mdx";
import solidJs from "@astrojs/solid-js";

import sitemap from "@astrojs/sitemap";

// https://astro.build/config
export default defineConfig({
  integrations: [UnoCSS(), mdx(), solidJs(), sitemap()],
	vite: {
    plugins: [visualizer({
      template: "sunburst",
      open: true,
      gzipSize: true,
      brotliSize: true,
      filename: "generated/bundle.html"
    })]
  },
  site: "https://msmarzewski.pl",
  compressHTML: true
});