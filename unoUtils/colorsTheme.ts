import Color from "color";
import type { Rule } from "unocss";

type ColorVariables = {
	[k in `--${string}-${number}`]: string;
};

const validShades = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950];

function darkenDarkColors(theme: any, color: string, shade: number): string {
	const selectedColor = theme.colors[color][shade];
	const isFixIgnored =
		shade < 700 ||
		["slate", "gray", "zinc", "neutral", "stone"].includes(color.toLowerCase());

	if (isFixIgnored) return selectedColor;
	return Color(selectedColor)
		.darken(shade / 1300)
		.rgb()
		.string();
}

export const themeColorsRule: Rule<any> = [
	/^theme-default$/,
	(_, { theme }) => {
		const style: ColorVariables = {};
		validShades.forEach((i) => {
			style[`--primary-${i}`] = theme.colors.gray[i];
			style[`--accent-${i}`] = theme.colors.orange[i];
			style[`--tertiary-${i}`] = theme.colors.green[i];
		});

		return style;
	},
];

function generateVariableColor(colorName: string) {
	const shades: Record<number, string> = {};
	for (const shade of validShades) {
		shades[shade] = `var(--${colorName}-${shade})`;
	}
	return { [colorName]: shades };
}

export const colors = {
	...generateVariableColor("primary"),
	...generateVariableColor("accent"),
	...generateVariableColor("tertiary"),
	var: "var(--color-variable)"
};
