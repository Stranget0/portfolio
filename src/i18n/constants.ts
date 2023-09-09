import type { SupportedLanguage, TranslationObject } from "./types";

export const supportedLanguages: SupportedLanguage[] = ["en", "pl"];

export const defaultLang: SupportedLanguage = "en";

export const languages: { [k in SupportedLanguage]: string } = {
	en: "English",
	pl: "Polski",
};

export const translations: { [k in SupportedLanguage]: TranslationObject } = {
	en: {
		titles: {
			loader: "Web development",
			"3d": ["My website", "my choice", "your website", "your choice"],
		},
		seo: {
			title: "Marcin Smarzewski - Web Development",
			description:
				"I'm a web development expert dedicated to crafting exceptional websites. Visit me to create your amazing online presence and hire a programmer!",
			keywords:
				"web developer, freelance web developer, frontend developer, web development, web design, UX/UI design, frontend, front-end",
		},
		profile: { github: "Github profile", linkedin: "LinkedIn profile" },
		info: {
			design: "design",
			experience: "experience",
			projects: "{0} projects",
			technologies: "{0} technologies",
		},
		common: {
			cancel: "cancel",
			"contact-me": "Contact me!",
			"play-audio": "Play audio",
			"play-website": "Play website!",
			scroll: "scroll",
			website: "website",
			loading: "loading...",
		},
		sections: {
			hero: "Fox",
			"about-me": "About me",
			"contact-me": "Contact me",
			play: "Play",
			projects: "Projects",
			skills: "Skills",
		},
		"about-me": {
			"profile-alt": "Picture of me",
			text: [
				"NICE TO MEET YOU!",
				"My name is Marcin and I am a Web Developer with a UX/UI side.",
				"My goal is to deliver functional, dynamic websites that will stand out from the ones that you see everyday.",
				"I believe that leaving good customer experience will make your brand recognizable.",
				"Now, wanna make some ",
				"good shit?",
			],
		},
		input: {
			email: "e-mail",
			message: "message",
			name: "name",
			submit: "submit",
		},
		header: {
			language: "Language",
			menu: "Menu",
		},
	},

	pl: {
		titles: {
			"3d": ["Moja strona", "mój wybór", "Twoja strona", "Twój wybór"],
			loader: "Web development",
		},
		seo: {
			title: "Marcin Smarzewski - Tworzenie stron internetowych",
			description:
				"Jestem ekspertem w dziedzinie tworzenia stron internetowych oddanym tworzeniu wyjątkowych witryn. Odwiedź mnie, aby stworzyć swoją niesamowitą tożsamość online i zatrudnij programistę!",
			keywords:
				"web developer, niezależny twórca stron internetowych, programista front-end, tworzenie stron internetowych, projektowanie stron internetowych, projektowanie UX/UI, frontend, front-end",
		},
		profile: { github: "Profil github", linkedin: "Profil linkedin" },
		info: {
			design: "projektowanie",
			experience: "doświadczenie",
			projects: "{0} projektów",
			technologies: "{0} technologii",
		},
		common: {
			cancel: "anuluj",
			"contact-me": "Napisz do mnie!",
			"play-audio": "Odtwórz",
			"play-website": "Odtwórz stronę!",
			scroll: "przewiń",
			website: "strona",
			loading: "ładowanie...",
		},
		sections: {
			hero: "Lis",
			"about-me": "O mnie",
			"contact-me": "Kontakt",
			play: "Odtwórz stronę",
			projects: "Projekty",
			skills: "Umiejętności",
		},
		"about-me": {
			"profile-alt": "Picture of me",
			text: [
				"MIŁO MI CIĘ POZNAĆ!",
				"Nazywam się Marcin i jestem profesjonalnym Web Developerem.",
				"Tworzę funkcjonalne, dynamiczne strony internetowe, które wyróżnią się spośród tych, które widzisz na co dzień.",
				"Wierzę, że sprawienie dobrego wrażenia u klienta sprawi, że Twoja marka się wyróżni.",
				"Więc jak tam, chcesz stworzyć coś ",
				"ciekawego?",
			],
		},
		input: {
			email: "e-mail",
			message: "wiadomość",
			name: "imie",
			submit: "wyślij",
		},
		header: { language: "Język", menu: "Menu" },
	},
};
