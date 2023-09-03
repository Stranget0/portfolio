import randomBetween from "@utils/randomBetween";

/**
 * @returns <min-max>
 */
export default function randomIntBetween(min: number, max: number) {
	return Math.round(randomBetween(min, max));
}
