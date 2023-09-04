import { defineConfig } from "cypress";

export default defineConfig({
	projectId: "vk47ob",
	experimentalWebKitSupport: true,
	e2e: { supportFile: false, baseUrl: "http://localhost:4321" },
});
