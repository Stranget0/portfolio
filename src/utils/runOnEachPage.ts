export default function runOnEachPage(callback: VoidFunction) {
	callback();
	document.addEventListener("astro:after-swap", callback);
}
