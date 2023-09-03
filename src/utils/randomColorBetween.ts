import { Color, type ColorRepresentation } from "three";

export default function randomColorBetween(
	color1: ColorRepresentation,
	color2: ColorRepresentation,
	random = Math.random,
) {
	return new Color().lerpColors(new Color(color1), new Color(color2), random());
}
