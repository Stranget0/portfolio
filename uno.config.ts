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

import { colors, themeColorsRule } from "./unoUtils/colorsTheme";
import { shake } from "./unoUtils/animations";

const shortcuts = {
	"text-title-1": "text-5xl font-extrabold tracking-5",
	"text-title-2": "text-4xl font-extrabold tracking-5",
	"text-subtitle": "text-xl font-bold tracking-3 leading-14",
	"text-body": "text-lg font-extralight leading-7 tracking-1",
	"text-body-u": "text-body uppercase",
	section: "px-4 lg:px-36 h-screen flex flex-col justify-center",
	"aspect-card": "aspect-[63/88]",
	"aspect-card-rotated": "aspect-[88/63]",
	"pseudo-full": "absolute inset-0 content",
	"layer-noise": "relative after:(pseudo-full bg-black filter-noise)",
	dialog:
		"rounded pt-1 px-4 pb-2 relative before:(pseudo-full rounded bg-primary-50 opacity-10 pointer-events-none)",
	"transition-interactive":
		"transform motion-safe:transition-transform hover:scale-102 focus-visible:scale-102 focus-within:scale-102 active:(scale-98 opacity-75)",
};

export default defineConfig({
	safelist: ["filter-noise-appear"],
	shortcuts,
	theme: {
		colors,
		fontSize: {
			xl: "clamp(1.25rem, 1vw + 1rem, 10.24rem)",
			"2xl": "clamp(1.5rem, 2vw + 1rem, 12.8rem)",
			"3xl": "clamp(1.875rem, 3vw + 1rem, 16rem)",
			"4xl": "clamp(2.25rem, 4vw + 1rem, 20rem)",
			"5xl": "clamp(2.8125rem, 5vw + 1rem, 25rem)",
		},
		animation: {
			keyframes: { shake: shake.keyframes },
			durations: { shake: shake.duration },
			counts: { shake: shake.count },
			properties: { shake: shake.properties },
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
		themeColorsRule,
		// ***************************************************************************************

		[/^content$/, () => ({ content: '""' })],
		// ***************************************************************************************
		[
			/^filter-(noise|grunge|noise-appear)$/,
			([_, filterType]) => ({ filter: `url(#${filterType})` }),
		],

		// ***************************************************************************************
		[
			/^menu-opafocus(-option)?$/,

			() => {
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
		// ***************************************************************************************
		[
			/^opafocus-(max|min)-opacity-(\d+)$/,
			([_, type, opacity]) => ({
				[`--opafocus-${type}-opacity`]: `${parseInt(opacity) / 100}`,
			}),
		],
		// ***************************************************************************************
		[
			/^dash-([a-z]+)-(\d+)$/,
			([_, color, shade], { theme, rawSelector }) => {
				const selectedColor = theme.colors[color];
				const bgColor = selectedColor?.[shade];
				const selector = e(rawSelector);

				// throw new Error(JSON.stringify(theme, null, 2));

				return `
					${selector} {
						--dash-color: ${bgColor};
					}
				`;
			},
		],
		// ***************************************************************************************
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
	],
});
("{40%{opacity:1;transform:scale3d(0.475,0.475,0.475) translate3d(0,-60px,0);animation-timing-function:cubic-bezier(0.55,0.055,0.675,0.19)}to{opacity:0;transform:scale3d(0.1,0.1,0.1) translate3d(0,2000px,0);transform-origin:center bottom;animation-timing-function:cubic-bezier(0.175,0.885,0.32,1)}}");
