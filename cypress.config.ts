import { defineConfig } from "cypress";
import getCompareSnapshotsPlugin from "cypress-visual-regression/dist/plugin";

export default defineConfig({
	projectId: "vk47ob",
	experimentalWebKitSupport: true,
	trashAssetsBeforeRuns: true,
	e2e: {
		supportFile: false,
		baseUrl: "http://localhost:3000",
		setupNodeEvents(on, config) {
			getCompareSnapshotsPlugin(on, config);
		},
		env: {
			failSilently: false,
		},
	},
});
