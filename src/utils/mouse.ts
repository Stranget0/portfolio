export default function onMouseMove(handler: (mouseData: MouseEvent) => void) {
	document.addEventListener("mousemove", handler);
	return () => document.removeEventListener("mousemove", handler);
}
