import randomBetween from "@utils/randomBetween";

/**
 * @param min inclusive
 * @param max inclusive
 * @returns {number} min-max
 */
export default function randomIntBetween(min: number, max: number) {
	return Math.round(randomBetween(min, max));
}
