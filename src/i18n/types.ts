import type { Leaves } from "@/types";

export interface TranslationObject {
	titles: { "3d": string[]; loader: string };

	profile: {
		github: string;
		linkedin: string;
	};

	info: {
		projects: string;
		technologies: string;
		design: string;
		experience: string;
	};

	common: {
		scroll: string;
		"play-audio": string;
		cancel: string;
		loading: string;
		"play-website": string;
		"contact-me": string;
		website: string;
	};

	sections: {
		play: string;
		"about-me": string;
		projects: string;
		skills: string;
		"contact-me": string;
		hero: string;
	};

	"about-me": { "profile-alt": string; text: string[] };

	input: {
		name: string;
		email: string;
		message: string;
		submit: string;
	};

	seo: {
		title: string;
		description: string;
		keywords: string;
	};

	header: {
		menu: string;
		language: string;
	};
}

export type SupportedLanguage = "en" | "pl";

export type TranslationPath = Leaves<TranslationObject>;

type Variable = string | number | undefined;
export type TVariable = { [k in string]: Variable } | Variable[];
