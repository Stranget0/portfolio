import classNames from "classnames";
import type { ButtonProps } from "./types";

export function buttonClass({
	class: className,
	classOverride,
	invertColor,
	size,
	visualType,
}: Pick<
	ButtonProps<"button">,
	"classOverride" | "size" | "visualType" | "invertColor" | "class"
>) {
	return classNames(
		classOverride || [
			"rounded relative outline-offset-4 transition-interactive w-full border-current no-underline disabled:(opacity-30 scale-100 bg-primary-500)",
			size === "default" && "p-4 text-button",
			size === "small" && "px-2 py-1 text-xs",
			visualType === "simple" &&
				"bg-primary-100 text-primary-950 hover:bg-primary-50",
			visualType === "outline" && "border-2",
			invertColor && "filter-invert",
			className,
		]
	);
}
