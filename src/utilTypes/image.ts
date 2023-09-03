import type { ImageMetadata } from "astro";

export type ImageString = [string, string];
export type ImageSrc = ImageMetadata | Promise<{ default: ImageMetadata }>;
