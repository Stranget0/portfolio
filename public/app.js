import Swup from "swup";
import SwupProgressPlugin from "@swup/progress-plugin";
import SwupHeadPlugin from "@swup/head-plugin";
import SwupDebugPlugin from "@swup/debug-plugin";
import SwupA11yPlugin from "@swup/a11y-plugin";
import SwupSlideTheme from "@swup/slide-theme";

const swup = new Swup({
	plugins: [
		new SwupProgressPlugin(),
		new SwupHeadPlugin(),
		new SwupA11yPlugin(),
		new SwupSlideTheme(),
		new SwupDebugPlugin(),
	],
});
