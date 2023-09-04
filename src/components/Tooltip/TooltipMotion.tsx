import { Motion } from "@motionone/solid";
import classNames from "classnames";
import type { ParentProps } from "solid-js";
import { tooltipSignal } from "./utils";

export default function TooltipMotion(props: ParentProps<{ class?: string }>) {
	const className = () =>
		classNames(
			"circle-button bg-primary-50 text-primary-950 motion-safe:animate-flip-in-x",
			props.class,
		);

	return (
		<Motion exit={{ scale: 0 }} class={className()}>
			{props.children}
		</Motion>
	);
}
