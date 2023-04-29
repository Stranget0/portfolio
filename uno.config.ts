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
	shortcuts: {
		section: "px-4 lg:px-36 h-screen flex items-center",
	},
	theme: {
		colors: {
			dblue: "#020417",
			dviolet: "#090416",
		},
		fontSize: {
			xl: "clamp(1.25rem, 1vw + 1rem, 10.24rem)",
			"2xl": "clamp(1.5rem, 2vw + 1rem, 12.8rem)",
			"3xl": "clamp(1.875rem, 3vw + 1rem, 16rem)",
			"4xl": "clamp(2.25rem, 4vw + 1rem, 20rem)",
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
			/^theme-default$/,
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
			/^(?:primary|secondary|tertiary)-(?:50|100|200|300|400|500|600|700|800|900|950|1000)$/,
			([m]) => ({
				color: `var(--${m})`,
				transition: ".25s color ease-out",
			}),
		],
	],
});
