import {
	defineConfig,
	presetAttributify,
	presetIcons,
	presetTypography,
	presetUno,
	presetWebFonts,
	transformerDirectives,
	transformerVariantGroup,
} from "unocss";

export default defineConfig({
	shortcuts: {},
	theme: {
		colors: {
			dblue: "#020417",
			dviolet: "#090416",
		},
	},
	presets: [
		presetUno(),
		presetAttributify(),
		presetIcons({ autoInstall: true, prefix: "i-", warn: true }),
		presetTypography(),
		presetWebFonts({
			provider: "google",
			fonts: {
				sans: "sora",
				serif: "Poltawski Nowy",
			},
		}),
	],
	transformers: [transformerDirectives(), transformerVariantGroup()],
	rules: [
		[
			/theme-default/,
			(_, { theme }) => {
				const style: {
					[k in `--${"primary" | "secondary" | "tertiary"}-${number}`]: string;
				} = {};
				for (let i = 50; i <= 1000; i += i >= 100 && i < 900 ? 100 : 50) {
					style[`--primary-${i}`] = theme.colors.blue[i];
					style[`--secondary-${i}`] = theme.colors.fuchsia[i];
					style[`--tertiary-${i}`] = theme.colors.teal[i];
				}
				return style;
			},
		],
		[
			/(?:primary|secondary|tertiary)-(?:50|100|200|300|400|500|600|700|800|900|950|1000)/,
			([m]) => ({
				color: `var(--${m})`,
				transition: ".25s color ease-out",
			}),
		],
	],
});
