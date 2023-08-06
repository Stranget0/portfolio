export function preloadImage(src: string) {
	console.log("PRELOAD", src);

	new Image().src = src;
}
