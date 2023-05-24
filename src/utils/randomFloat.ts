export default function randomBetween(
	min: number,
	max: number,
	random = Math.random
): number {
	return random() * (max - min) + min;
}
