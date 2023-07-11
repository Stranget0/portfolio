import { z, reference } from "astro:content";

export const imagesSchema = z.array(z.tuple([z.string(), z.string()]));

export const projectSchema = z.object({
	title: z.string().optional(),
	description: z.string().optional(),
	floatingImages: imagesSchema.optional(),
	fullscreenImages: imagesSchema.optional(),
	audioTextTimings: z.array(z.number()).optional(),
	class: z.string().optional(),
	technologies: z.array(reference("technologies")).optional(),
	startYear: z.number(),
	endYear: z.number().optional(),
	draft: z.boolean(),
});

export const technologySchema = z.object({
	importance: z.number(),
	name: z.string(),
	color: z.string(),
	accent: z.string().optional(),
});

export const linkSchema = z.object({
	title: z.string(),
	href: z.string().url(),
	class: z.string().regex(/^i-/),
});
