import { z, reference } from "astro:content";

export const projectSchema = z.object({
	title: z.string(),
	description: z.string(),
	images: z.array(z.tuple([z.string().url(), z.string()])),
	technologies: reference("technologies"),
	startYear: z.number(),
	endYear: z.number().optional(),
	draft: z.boolean(),
});

export const technologySchema = z.object({
	importance: z.number(),
	name: z.string(),
	color: z.string(),
});
