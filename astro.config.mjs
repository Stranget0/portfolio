import { defineConfig } from "astro/config";
import image from "@astrojs/image";
import UnoCSS from "unocss/astro";

// https://astro.build/config
export default defineConfig({
	integrations: [
		UnoCSS(),
		image({
			serviceEntryPoint: "@astrojs/image/sharp",
		}),
	],
});
