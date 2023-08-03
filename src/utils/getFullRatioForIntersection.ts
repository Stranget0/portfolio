export default function getFullRatioForIntersection(element: HTMLElement) {
	return Math.min(window.innerHeight / element.clientHeight / 1.1, 1);
}
