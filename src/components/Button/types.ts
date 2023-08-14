import type { HTMLTag, Polymorphic } from "astro/types";

export type CloseType = "any-click" | "non-interactive-click";

export type ButtonProps<T extends HTMLTag> = Polymorphic<{
	as: T;
}> & {
	visualType?: "simple" | "outline";
	size?: "default" | "small";
	invertColor?: boolean;
	classOverride?: string;
	targetSelector?: string;
	targetClassToggle?: string;
	closeType?: CloseType;
};
