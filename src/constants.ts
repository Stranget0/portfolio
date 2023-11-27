import { useTranslations } from "./i18n/utils";
import type { Tabs } from "./types";

export const TEXT_NODE = 3;

export const mainpageTabs = {
	hero: {
		id: "hero-website-tab",
		label: (url) => useTranslations(url)("sections.hero"),
	},
	play: {
		id: "play-website-tab",
		label: (url) => useTranslations(url)("sections.play"),
	},
	aboutMe: {
		id: "about-me-tab",
		label: (url) => useTranslations(url)("sections.about-me"),
	},
	services: {
		id: "services-tab",
		label: (url) => useTranslations(url)("sections.services"),
	},
	projects: {
		id: "projects-tab",
		label: (url) => useTranslations(url)("sections.projects"),
	},
	skills: {
		id: "skills-tab",
		label: (url) => useTranslations(url)("sections.skills"),
	},
	contact: {
		id: "contact-tab",
		label: (url) => useTranslations(url)("sections.contact-me"),
	},
} satisfies Tabs;

export const availableBreakpoints = [756, 1024] as const;

export const isDev = import.meta.env?.DEV ?? true;
