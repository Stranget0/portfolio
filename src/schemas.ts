import { z, reference } from "astro:content";
import { translations } from "./i18n/constants";

export const imagesSchema = z.array(z.tuple([z.string(), z.string()]));

export const projectSchema = z.object({
	title: z.string().optional(),
	description: z.string().optional(),
	floatingImages: imagesSchema.optional(),
	fullscreenImages: imagesSchema.optional(),
	audioTextTimings: z.array(z.number()).optional(),
	class: z.string().optional(),
	titleClass: z.string().optional(),
	technologies: z.array(reference("technologies")).optional(),
	startYear: z.number(),
	endYear: z.number().optional(),
	importance: z.number().optional(),
	github: z.string().url().optional(),
	website: z.string().url().optional(),
	draft: z.boolean(),
});

export const technologySchema = z.object({
	importance: z.number(),
	name: z.string(),
	color: z.string(),
	accent: z.string().optional(),
});

const linkTitles = Object.keys(translations.en.profile).map(
	(k) => `profile.${k}`,
) as [
	`profile.${keyof typeof translations.en.profile}`,
	...`profile.${keyof typeof translations.en.profile}`[],
];
const linkTitle = z.enum(linkTitles);

export const linkSchema = z.object({
	title: linkTitle,
	href: z.string().url(),
	class: z.string().regex(/^i-/),
});

export const transcriptSchema = z.object({
	audio: z.string(),
	results: z.array(
		z.object({
			languageCode: z.string(),
			resultEndTime: z.string(),
			alternatives: z.array(
				z.object({
					confidence: z.number(),
					transcript: z.string(),
					words: z.array(
						z.object({
							endTime: z.string(),
							startTime: z.string(),
							word: z.string(),
						}),
					),
				}),
			),
		}),
	),
});

export type Transcript = z.infer<typeof transcriptSchema>;
export type Project = z.infer<typeof projectSchema>;
export type ProfileTranslations = z.infer<typeof linkTitle>;
