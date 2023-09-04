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
import {
	shake,
	marquee,
	backgroundSlow,
	textAppear,
	appear,
} from "./unoUtils/animations";

const shortcuts = {
	"text-title-1": "font-serif text-5xl font-extrabold tracking-.3em uppercase",
	"text-title-2": "font-serif text-4xl font-extrabold tracking-.3em uppercase",
	"text-subtitle-1": "font-serif text-3xl font-bold tracking-.3em uppercase",
	"text-subtitle-2": "font-serif text-xl font-bold tracking-.3em uppercase",
	"text-button": "font-serif text-lg font-normal tracking-2",
	"text-subtitle-3": "font-serif text-xl font-medium leading-140% tracking-0.5",
	"text-subtitle-4": "text-4 font-light leading-140% tracking-0.5",
	"text-body": "text-base font-extralight leading-140% tracking-0.5",
	"text-body-u": "text-body uppercase",
	"text-label": "text-xs font-thin tracking-2 lowercase",
	"text-sm": "text-sm font-thin",
	"text-xs": "text-xs font-thin",
	section: "px-4 py-10 lg:px-16 flex flex-col justify-center",
	"aspect-card": "aspect-[63/88]",
	"aspect-card-rotated": "aspect-[88/63]",
	"pseudo-full": "absolute inset-0 content",
	dialog:
		"rounded pt-1 px-4 pb-2 relative before:(pseudo-full rounded bg-primary-50 opacity-10 pointer-events-none)",
	"transition-interactive":
		"transform motion-safe:transition-transform hover:scale-105 focus-visible:scale-110 focus-within:scale-110 active:(scale-90 opacity-75)",
	"flex-center": "flex justify-center items-center",
	"flex-col-center": "flex-center flex-col",
	"glass-backdrop":
		"before:(pseudo-full opacity-80 bg-primary-100 -z-1) after:(pseudo-full backdrop-blur -z-1)",
	"circle-button":
		"p-4 rounded-full aspect-ratio-square text-label font-black uppercase",
	"absolute-center": "absolute top-50% left-50% -translate-50%",
};

const fontSizes = {
	lg: "clamp(1rem, 0.75vw + 1rem, 7rem)",
	xl: "clamp(1.25rem, 1vw + 1rem, 10.24rem)",
	"2xl": "clamp(1.5rem, 2vw + 1rem, 12.8rem)",
	"3xl": "clamp(1.875rem, 3vw + 1rem, 16rem)",
	"4xl": "clamp(2.25rem, 4vw + 1rem, 20rem)",
	"5xl": "clamp(2.8125rem, 5vw + 1rem, 25rem)",
};

export default defineConfig({
	safelist: [
		"opacity-10",
		"opacity-50",
		"filter-blur-2",
		"transform-scale-150",
		"cursor-none",
		"rounded",
		"relative",
		"outline-offset-4",
		"transition-interactive",
		"w-full",
		"border-current",
		"no-underline",
		"disabled:(opacity-30",
		"scale-100",
		"bg-primary-500)",
		"p-4",
		"text-button",
		"px-2",
		"py-1",
		"text-xs",
		"bg-primary-100",
		"text-primary-950",
		"hover:bg-primary-50",
		"border-2",
		"filter-invert",
		"solid-shadow",
	],
	shortcuts,
	theme: {
		colors,
		fontSize: fontSizes,
		animation: {
			keyframes: {
				shake: shake.keyframes,
				marquee: marquee.keyframes,
				"bg-slow": backgroundSlow.keyframes,
				"text-appear": textAppear.keyframes,
				appear: appear.keyframes,
			},
			durations: {
				shake: shake.duration,
				marquee: marquee.duration,
				"bg-slow": backgroundSlow.duration,
				"text-appear": textAppear.duration,
				appear: appear.duration,
			},
			counts: {
				shake: shake.count,
				marquee: marquee.count,
				"bg-slow": backgroundSlow.count,
			},
			properties: {
				shake: shake.properties,
				"bg-slow": backgroundSlow.properties,
			},
			timingFns: { shake: shake.easing, "bg-slow": backgroundSlow.easing },
		},
		spacing: Object.fromEntries(
			Object.entries(fontSizes).map(([k, v]) => [`font-${k}`, v]),
		),
	},
	presets: [
		presetUno(),
		presetAttributify(),
		presetIcons({
			prefix: "i-",
			warn: true,
			collections: {
				mingcute: () => import("@iconify/json/json/mingcute.json"),
				"svg-spinners": () => import("@iconify/json/json/svg-spinners.json"),
			},
			extraProperties: {
				display: "inline-block",
				"vertical-align": "middle",
			},
		}),
		presetTypography(),
		presetWebFonts({
			provider: "google",
			fonts: {
				sans: [
					{
						name: "Sora",
						weights: [100, 200, 300, 400, 500, 600, 700, 800, 900],
					},
				],
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
					transition-property: opacity, scale;
					transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
					transition-duration: 150ms;
				}
			}
			:where(.menu-opafocus .menu-opafocus-option){
				opacity: 90%;
			}
			:where(.menu-opafocus:is(:hover, :focus-within) .menu-opafocus-option){
				opacity: var(--opafocus-min-opacity, 0.5) !important;
				scale: var(--opafocus-min-scale, 0.9);
			}
			:where(.menu-opafocus .menu-opafocus-option:is(:hover, :focus-visible)) {
				opacity: var(--opafocus-max-opacity, 1) !important;
				scale: var(--opafocus-max-scale, 1.1);
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
		[
			/^opafocus-(max|min)-scale-(\d+)$/,
			([_, type, scale]) => ({
				[`--opafocus-${type}-opacity`]: `${parseInt(scale) / 100}`,
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
			/^bleed$/,
			() => ({
				"background-color": "var(--bleed-color)",
				"box-shadow": "0 0 0 100vmax var(--bleed-color)",
				"clip-path": "inset(0 -100vmax)",
			}),
		],
		[
			/^bleed-([a-z]+)(?:-(\d+))?$/,
			([_, colorVariant, shade], { theme, rawSelector }) => {
				let color = theme.colors[colorVariant];
				if (shade !== undefined) color = color?.[shade];
				const selector = e(rawSelector);
				return `${selector} {
				--bleed-color: ${color};
			}`;
			},
		],
		// ***************************************************************************************
		[/^clip-full$/, () => ({ "clip-path": "inset(0)" })],
		// ***************************************************************************************
		// TODO: doesnt work, fix and replace the scss
		// [
		// 	/^animated-underline$/,
		// 	() => {
		// 		return `.animated-underline {
		// 		@apply relative before:(pseudo-full top-auto w-full h-0.1em scale-x-0) hover:before:scale-x-100 focus-visible:before:scale-x-1 motion-safe:before:transition-transform;

		// 		&::before{
		// 			background-color: var(--underline-color, currentColor);
		// 			transform-origin: var(--underline-origin, center bottom);
		// 		}
		// 	}`;
		// 	},
		// ],
		[
			/^animated-underline-(left|right|center)$/,
			([_, direction]) => {
				return {
					"--underline-origin": direction,
				};
			},
		],
		[
			/^animated-underline-([a-z]+)(?:-(\d+))$/,
			([_, colorVariant, shade], { theme }) => {
				let color = theme.colors[colorVariant];
				if (shade !== undefined) color = color?.[shade];

				return {
					"--underline-color": color,
				};
			},
		],
		// ***************************************************************************************
		[
			/^i-logo(\?mask)?$/,
			([_, mask]) => {
				const common = (type: "background" | "mask") => ({
					display: "inline-block",
					"vertical-align": "middle",
					[`${type}-size`]: "contain",
					[`${type}-position`]: "center",
					[`${type}-repeat`]: "no-repeat",
					[`${type}-image`]: "url(svg/fox.svg)",
				});
				if (mask) return common("mask");
				return common("background");
			},
		],
		// ***************************************************************************************
		[
			/^color-var-([a-z-]+)(?:-(\d+))$/,
			([_, colorVariant, shade], { theme }) => {
				let color = theme.colors[colorVariant];
				if (colorVariant.startsWith("#")) color = colorVariant;
				if (shade !== undefined) color = color?.[shade];
				if (!color) return;
				return { "--color-variable": color, color };
			},
		],
		// ***************************************************************************************
		[/^text-balance$/, () => ({ "text-wrap": "balance" })],
		// ***************************************************************************************
		[
			/^solid-shadow$/,
			() => ({ "box-shadow": "-.15em .15em 0px 0px currentColor" }),
		],
		[
			/^solid-text-shadow$/,
			() => {
				const max = 0.17;
				const steps = 4;
				return {
					"text-shadow": generateTextShadow(steps, max),
				};
			},
		],
		[
			/^solid-text-shadow-sm$/,
			() => {
				const max = 0.1;
				const steps = 2;
				return {
					"text-shadow": generateTextShadow(steps, max),
				};
			},
		],
		[
			/^solid-text-shadow-([a-z-]+)(?:-(\d+))$/,
			([_, colorVariant, shade], { theme }) => {
				let color = theme.colors[colorVariant];
				if (colorVariant.startsWith("#")) color = colorVariant;
				if (shade !== undefined) color = color?.[shade];
				if (!color) return;
				return { "--solid-text-shadow-color": color };
			},
		],
		// ***************************************************************************************
		[
			/^clip-circle-top-right(-full)?$/,
			([_, full]) => {
				const value = full ? "150vmax" : "0px";

				return {
					"clip-path": `circle(${value} at top right)`,
				};
			},
		],
		// ***************************************************************************************
		[
			/^no-transform-mobile$/,
			(_, { theme }) => {
				const lg = theme.breakpoints.lg;
				return `
			@media (max-width: ${lg}) {
				.no-transform-mobile{
					transform: none !important;
				}
			}
			`;
			},
		],
	],
});
function generateTextShadow(steps: number, max: number) {
	const textShadow: string[] = [];
	for (let i = 1; i <= steps; i++) {
		textShadow.push(
			`0 ${max / i}rem  0 var(--solid-text-shadow-color, #111111)`,
		);
	}

	const res = textShadow.join(", ");
	return res;
}
