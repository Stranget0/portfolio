const pointerMedia = matchMedia("(pointer:fine)");

if (pointerMedia.matches) {
	import("@utils/initLerpScroll").then(({ default: initLerpScroll }) => {
		initLerpScroll(window, 0.075, 0.75);
	});
}
