import get from "lodash/get";
import type { SupportedLanguage, TVariable, TranslationPath } from "./types";
import { defaultLang, translations } from "./constants";

export function getLangFromUrl(url: URL): SupportedLanguage {
	const [, lang] = url.pathname.split("/");
	if (lang in translations) return lang as SupportedLanguage;
	return defaultLang;
}

export function getTargetLangUrl(url: URL, lang: SupportedLanguage): string {
	const pathArr = url.pathname.split("/");
	pathArr[1] = lang;
	return pathArr.join("/");
}

export function useTranslations(urlOrLang: URL | SupportedLanguage) {
	return function t(path: TranslationPath, variables: TVariable = {}) {
		const lang =
			urlOrLang instanceof URL ? getLangFromUrl(urlOrLang) : urlOrLang;

		const fullPath = `${lang}.${path}`;
		let str = get(translations, fullPath) || getDefault();

		if (typeof str !== "string")
			throw new Error(`undefined translation path ${fullPath}`);

		str = assignVariables(variables, str);

		return str;

		function getDefault(): string | undefined {
			return get(translations, `${defaultLang}.${path}`) as string | undefined;
		}
	};
}

function assignVariables(variables: TVariable, str: string): string {
	Object.entries(variables).forEach(([k, v]) => {
		const localRegExp = new RegExp(`\\{${k}\\}`, "g");
		str = str.replace(localRegExp, `${v}`);
	});

	return str;
}
