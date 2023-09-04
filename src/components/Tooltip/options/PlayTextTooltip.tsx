import { type Component } from "solid-js";
import TooltipMotion from "../TooltipMotion";
import classNames from "classnames";
import { appearingTextState } from "@/components/AppearingText/state";

const PlayTextTooltip: Component = () => {
	const isDefault = appearingTextState() === "default";

	return (
		<TooltipMotion class="flex-col-center">
			<div
				class={classNames(
					"w-8 h-8 mb-4",
					isDefault
						? "i-mingcute-finger-tap-fill?mask"
						: "i-mingcute-close-fill?mask",
				)}
			></div>
			<p>{isDefault ? "Play Audio" : "Cancel"}</p>
		</TooltipMotion>
	);
};

export default PlayTextTooltip;
