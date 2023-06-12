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
	"text-title-1": "font-serif text-5xl font-extrabold tracking-5 uppercase",
	"text-title-2": "font-serif text-4xl font-extrabold tracking-5 uppercase",
	"text-subtitle-1":
		"font-serif text-3xl font-bold tracking-3 leading-100% uppercase",
	"text-subtitle-2":
		"font-serif text-xl font-bold tracking-3 leading-100% uppercase",
	"text-button": "font-serif text-lg font-normal tracking-2",
	"text-body": "text-base font-extralight leading-110% tracking-0.5",
	"text-body-u": "text-body uppercase",
	"font-label": "text-sm font-thin tracking-2 lowercase",
	section: "px-4 lg:px-36 flex flex-col justify-center",
	"aspect-card": "aspect-[63/88]",
	"aspect-card-rotated": "aspect-[88/63]",
	"pseudo-full": "absolute inset-0 content",
	dialog:
		"rounded pt-1 px-4 pb-2 relative before:(pseudo-full rounded bg-primary-50 opacity-10 pointer-events-none)",
	"transition-interactive":
		"transform motion-safe:transition-transform hover:scale-102 focus-visible:scale-102 focus-within:scale-102 active:(scale-98 opacity-75)",
};

const fontSizes = {
	xl: "clamp(1.25rem, 1vw + 1rem, 10.24rem)",
	"2xl": "clamp(1.5rem, 2vw + 1rem, 12.8rem)",
	"3xl": "clamp(1.875rem, 3vw + 1rem, 16rem)",
	"4xl": "clamp(2.25rem, 4vw + 1rem, 20rem)",
	"5xl": "clamp(2.8125rem, 5vw + 1rem, 25rem)",
};

export default defineConfig({
	shortcuts,
	theme: {
		colors,
		fontSize: fontSizes,
		animation: {
			keyframes: { shake: shake.keyframes },
			durations: { shake: shake.duration },
			counts: { shake: shake.count },
			properties: { shake: shake.properties },
			timingFns: { shake: shake.easing },
		},
		spacing: Object.fromEntries(
			Object.entries(fontSizes).map(([k, v]) => [`font-${k}`, v])
		),
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
				sans: "Sora",
				serif: "Marcellus",
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
				const borderTop = "3px solid var(--dash-color)";
				const borderBottom = "3px solid var(--dash-color)";

				return {
					"border-top": ["both", "top"].includes(type) ? borderTop : undefined,
					"border-bottom": ["both", "bottom"].includes(type)
						? borderBottom
						: undefined,
				};
			},
		],
		// ***************************************************************************************
		[
			/^bleed-([a-z]+)-(\d+)$/,
			([_, colorVariant, shade], { theme, rawSelector }) => {
				const color = theme.colors[colorVariant]?.[shade];
				const selector = e(rawSelector);
				return `
			${selector} {
				background-color: ${color};
				box-shadow: 0 0 0 100vmax ${color};
				clip-path: inset(0 -100vmax);
			}`;
			},
		],
	],
});
