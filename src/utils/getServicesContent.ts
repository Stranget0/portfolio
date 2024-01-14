import { getCollection } from "astro:content";
import type { SupportedLanguage } from "../i18n/types";

export default async function getServicesContent(lang: SupportedLanguage) {
	return (
		await getCollection("services", ({ slug }) => slug.startsWith(lang))
	).sort(({ data: a }, { data: b }) => a.order - b.order);
}
