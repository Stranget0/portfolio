import { defineCollection } from "astro:content";
import { projectSchema, technologySchema } from "../schemas";

export const collections = {
	technologies: defineCollection({ type: "content", schema: technologySchema }),
	projects: defineCollection({ type: "content", schema: projectSchema }),
};
