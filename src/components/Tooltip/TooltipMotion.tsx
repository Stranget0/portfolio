import { Motion } from "@motionone/solid";
import classNames from "classnames";
import type { ParentProps } from "solid-js";

export default function TooltipMotion(props: ParentProps<{ class?: string }>) {
	const className = () =>
		classNames("circle-button bg-primary-50 text-primary-950", props.class);

	return (
		<Motion
			initial={{ transform: "scale(0)" }}
			animate={{ transform: "scale(1)" }}
			exit={{ transform: "scale(0)" }}
			transition={{ duration: 0.15, easing: "ease-out" }}
			class={className()}
		>
			{props.children}
		</Motion>
	);
}
