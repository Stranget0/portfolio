import { defineCollection } from "astro:content";
import {
	linkSchema,
	projectSchema,
	technologySchema,
	transcriptSchema,
} from "../schemas";

export const collections = {
	technologies: defineCollection({ type: "content", schema: technologySchema }),
	projects: defineCollection({ type: "content", schema: projectSchema }),
	links: defineCollection({ type: "content", schema: linkSchema }),
	transcripts: defineCollection({ type: "data", schema: transcriptSchema }),
};
