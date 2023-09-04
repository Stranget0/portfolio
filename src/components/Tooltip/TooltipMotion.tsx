import { Motion } from "@motionone/solid";
import classNames from "classnames";
import type { ParentProps } from "solid-js";

export default function TooltipMotion(props: ParentProps<{ class?: string }>) {
	return (
		<Motion
			animate={{ scale: [0, 1] }}
			exit={{ scale: 0 }}
			class={classNames(
				"circle-button bg-primary-50 text-primary-950",
				props.class,
			)}
		>
			{props.children}
		</Motion>
	);
}
