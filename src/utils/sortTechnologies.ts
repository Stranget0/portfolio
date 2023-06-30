import type { CollectionEntry } from "astro:content";

export default function sortTechnologies(
	arr: CollectionEntry<"technologies">[]
) {
	return arr.sort(({ data: a }, { data: b }) => a.importance - b.importance);
}
