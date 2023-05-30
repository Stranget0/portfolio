/**
 * @param min inclusive
 * @param max inclusive
 * @returns {number} from-to
 */
export default function randomBetween(
	min: number,
	max: number,
	random = Math.random
): number {
	return random() * (max - min) + min;
}
