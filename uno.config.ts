import {
	defineConfig,
	presetAttributify,
	presetIcons,
	presetTypography,
	presetUno,
	presetWebFonts,
	transformerDirectives,
	transformerVariantGroup,
	toEscapedSelector as e,
} from "unocss";

import Color from "color";

function generateVariableColor(colorName: string) {
	const validShades = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950];
	const shades: Record<number, string> = {};
	for (const shade of validShades) {
		shades[shade] = `var(--${colorName}-${shade})`;
	}
	return { [colorName]: shades };
}

export default defineConfig({
	shortcuts: {
		section: "px-4 lg:px-36 h-screen flex flex-col justify-center",
		"aspect-card": "aspect-[63/88]",
		"aspect-card-rotated": "aspect-[88/63]",
		"pseudo-full": "absolute inset-0 content",
		"layer-noise":
			"relative isolate after:(pseudo-full bg-black filter-noise mix-blend-screen opacity-30)",
		"input-field":
			"rounded px-4 pb-2 relative isolate before:(pseudo-full rounded bg-primary-400 opacity-5 -z-1 pointer-events-none)",
		"transition-interactive":
			"transform motion-safe:transition-transform hover:scale-102 focus-visible:scale-102 focus-within:scale-102 active:(scale-98 opacity-30)",
	},
	theme: {
		colors: {
			...generateVariableColor("primary"),
			...generateVariableColor("accent"),
		},
		fontSize: {
			xl: "clamp(1.25rem, 1vw + 1rem, 10.24rem)",
			"2xl": "clamp(1.5rem, 2vw + 1rem, 12.8rem)",
			"3xl": "clamp(1.875rem, 3vw + 1rem, 16rem)",
			"4xl": "clamp(2.25rem, 4vw + 1rem, 20rem)",
			"5xl": "clamp(2.8125rem, 5vw + 1rem, 25rem)",
		},
	},
	presets: [
		presetUno(),
		presetAttributify(),
		presetIcons({
			extraProperties: {
				display: "inline-block",
				"vertical-align": "middle",
			},
		}),
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
				function fixLightColor(color: string, shade: number): string {
					const selectedColor = theme.colors[color][shade];
					const isFixIgnored =
						shade < 700 ||
						["slate", "gray", "zinc", "neutral", "stone"].includes(
							color.toLowerCase()
						);

					if (isFixIgnored) return selectedColor;
					return Color(selectedColor)
						.darken(shade / 1300)
						.rgb()
						.string();
				}

				const style: {
					[k in `--${string}-${number}`]: string;
				} = {};
				for (let i = 50; i <= 1000; i += i >= 100 && i < 900 ? 100 : 50) {
					style[`--primary-${i}`] = fixLightColor("fuchsia", i);
					style[`--accent-${i}`] = fixLightColor("cyan", i);
				}
				return style;
			},
		],
		[/^content$/, () => ({ content: '""' })],
		[
			/^filter-(noise|grunge)$/,
			([_, filterType]) => {
				return { filter: `url(#${filterType})` };
			},
		],
		[
			/^menu-opafocus(-option)?$/,
			(_) => {
				return `
			@media (prefers-reduced-motion: no-preference){
				:where(.menu-opafocus-option){
					transition: opacity .15s cubic-bezier(0, 0, 0.2, 1);
				}
			}
			:where(.menu-opafocus .menu-opafocus-option) {
				opacity: var(--opafocus-min-opacity, 0.5);
			}
			:where(.menu-opafocus .menu-opafocus-option:is(:hover, :focus-visible)) {
				opacity: var(--opafocus-max-opacity, 1);
			}`;
			},
		],
		[
			/^opafocus-(max|min)-opacity-(\d+)$/,
			([_, type, opacity], {}) => ({
				[`--opafocus-${type}-opacity`]: `${parseInt(opacity) / 100}`,
			}),
		],
		[
			/^dash-([a-z]+)-(\d+)$/,
			([_, color, shade], { theme, rawSelector }) => {
				const selectedColor = theme.colors[color];
				const bgColor = selectedColor?.[shade];
				const selector = e(rawSelector);

				return `
					${selector} {
						--dash-color: ${bgColor};
					}
				`;
			},
		],
		[
			/^dash-(top|bottom|both)$/,
			([_, type]) => {
				const borderTop = "2px solid var(--dash-color)";
				const borderBottom = "2px solid var(--dash-color)";

				return {
					"border-top": ["both", "top"].includes(type) ? borderTop : undefined,
					"border-bottom": ["both", "bottom"].includes(type)
						? borderBottom
						: undefined,
				};
			},
		],
		[
			/^btn-dash$/,
			() => {
				return `
				.btn-dash {
					@apply relative overflow-hidden;

					@media (prefers-reduced-motion: no-preference){
						&::after, &::before {
							@apply transition-transform ease-out duration-300;
						}
					}
					
					&::after, &::before{
						@apply absolute inset-0 opacity-10;
						content: '';
						background-color: var(--dash-color);
						transform: scaleX(.1) scaleY(.5);
					}

					&::before{
						bottom: 50%;
						transform-origin: top left;
					}
					
					&::after{
						top: 50%;
						transform-origin: bottom right;
					}

					&:focus-visible, &:hover{
						&::before, &::after{
							transform: scale(1);
						}
					}
					
				}
			`;
			},
		],
	],
});
