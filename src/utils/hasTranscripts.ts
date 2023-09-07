import type { SupportedLanguage } from "@/i18n/types";
import { getCollection } from "astro:content";

export default async function hasTranscripts(
	lang: SupportedLanguage,
): Promise<boolean> {
	const transcripts = await getCollection(
		"transcripts",
		({ id, data }) =>
			id.startsWith(lang) && data.audio && data.results.length > 0,
	);
	return transcripts.length > 0;
}
