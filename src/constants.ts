import { useTranslations } from "./i18n/utils";
import type { Tabs } from "./types";

export const TEXT_NODE = 3;

export const mainpageTabs = {
	hero: {
		id: "hero-website-tab",
		href: "/#hero-website-tab",
		label: (url) => useTranslations(url)("sections.hero"),
	},
	play: {
		id: "play-website-tab",
		href: "/#play-website-tab",
		label: (url) => useTranslations(url)("sections.play"),
	},
	aboutMe: {
		id: "about-me-tab",
		href: "/#about-me-tab",
		label: (url) => useTranslations(url)("sections.about-me"),
	},
	services: {
		id: "services-tab",
		href: "/#services-tab",
		label: (url) => useTranslations(url)("sections.services"),
	},
	projects: {
		id: "projects-tab",
		href: "/#projects-tab",
		label: (url) => useTranslations(url)("sections.projects"),
	},
	skills: {
		id: "skills-tab",
		href: "/#skills-tab",
		label: (url) => useTranslations(url)("sections.skills"),
	},
	contact: {
		id: "contact-tab",
		href: "#contact-tab",
		label: (url) => useTranslations(url)("sections.contact-me"),
	},
} satisfies Tabs;

export const dialogTabs = {
	"about-me": {
		label: (url) => useTranslations(url)("sections.about-me"),
		id: "about-me-page",
		href: `/#${mainpageTabs.aboutMe.id}`,
	},
	projects: mainpageTabs.projects,
	skills: mainpageTabs.skills,
	teaching: {
		label: (url) => useTranslations(url)("sections.teaching"),
		id: "teaching",
		href: "/services#teaching",
	},
	freelance: {
		label: (url) => useTranslations(url)("sections.freelance"),
		id: "freelance",
		href: "/services#freelance",
	},
} satisfies Tabs;

export const availableBreakpoints = [756, 1024] as const;

export const isDev = import.meta.env?.DEV ?? true;
