import { defineConfig } from "astro/config";
import image from "@astrojs/image";
import UnoCSS from "unocss/astro";
import { visualizer } from "rollup-plugin-visualizer";

// https://astro.build/config
export default defineConfig({
	integrations: [
		UnoCSS(),
		image({
			serviceEntryPoint: "@astrojs/image/sharp",
		}),
	],
	vite:{
		plugins: [visualizer({
      template: "treemap",
      open: true,
      gzipSize: true,
      brotliSize: true,
      filename: "generated/bundle.html",
    })]
	}
});
