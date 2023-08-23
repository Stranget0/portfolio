import { defineConfig } from "cypress";
import getCompareSnapshotsPlugin from "cypress-visual-regression/dist/plugin";
import * as fs from "fs"
export default defineConfig({
	projectId: "vk47ob",
	experimentalWebKitSupport: true,
	trashAssetsBeforeRuns: true,screenshotsFolder: './cypress/snapshots/actual',
  video: false,
  e2e: {
    setupNodeEvents(on, config) {
      getCompareSnapshotsPlugin(on, config);

      on("task", {
        doesExist: path => fs.existsSync(path)
      })
    },
  },

	env: {
		type:"actual",
		failSilently: false,
	},
});
