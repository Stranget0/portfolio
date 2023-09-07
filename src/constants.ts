import { getLangFromUrl, useTranslations } from "./i18n/utils";
import type { Tabs } from "./types";
import hasTranscripts from "./utils/hasTranscripts";

export const TEXT_NODE = 3;

export const mainpageTabs = {
	play: {
		id: "play-website-tab",
		label: (url) => useTranslations(url)("sections.play"),
		filter: (url) =>
			hasTranscripts(typeof url === "string" ? url : getLangFromUrl(url)),
	},
	aboutMe: {
		id: "about-me-tab",
		label: (url) => useTranslations(url)("sections.about-me"),
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
