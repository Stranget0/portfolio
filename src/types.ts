import type { availableBreakpoints } from "./constants";
import type { SupportedLanguage } from "./i18n/types";

export interface Tab {
	id?: string
	href?: string;
	label: (urlOrLang: URL | SupportedLanguage) => string;
}
export interface Tabs {
	[k: string]: Tab;
}
export type AvailableBreakpoints = (typeof availableBreakpoints)[number];

export type BreakpointsDict = Record<
	(typeof availableBreakpoints)[number],
	MediaQueryList
>;

type Join<K, P> = K extends string | number
	? P extends string | number
		? `${K}${"" extends P ? "" : "."}${P}`
		: never
	: never;

export type Paths<T, D extends number = 10> = [D] extends [never]
	? never
	: T extends object
	? {
			[K in keyof T]-?: K extends string | number
				? `${K}` | Join<K, Paths<T[K]>>
				: never;
	  }[keyof T]
	: "";

export type Leaves<T, D extends number = 10> = [D] extends [never]
	? never
	: T extends object
	? { [K in keyof T]-?: Join<K, Leaves<T[K]>> }[keyof T]
	: "";
