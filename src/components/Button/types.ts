import type { HTMLTag, Polymorphic } from "astro/types";

export type ButtonProps<T extends HTMLTag = "button"> = Polymorphic<{
	as: T;
}> & {
	visualType?: "simple" | "outline";
	size?: "default" | "small";
	invertColor?: boolean;
	classOverride?: string;
};
