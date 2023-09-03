import type { ButtonProps } from "@components/Button/types";
import { buttonClass } from "@components/Button/utils";
import classNames from "classnames";
import type { Component } from "solid-js";
import type { States } from "./types";
import { appearingTextState, setAppearingTextState } from "./state";
import { tooltipIgnore } from "../Tooltip/serverUtils";

interface Props extends ButtonProps<"button"> {
	stageId?: string;
	mainLabel?: string;
	direction?: "row" | "column";
	iconClass?: string;
}

const load = () => import("./lib");

const AppearingTextButton: Component<Props> = (props) => {
	const {
		class: className,
		stageId,
		classOverride,
		invertColor,
		size = "small",
		visualType,
		mainLabel = "Play audio",
		direction = "row",
		iconClass = "w-6 h-6",
		...other
	} = props;

	const labels: { [k in States]: string } = {
		default: mainLabel || "Play audio",
		loading: "Loading...",
		running: "Cancel",
	};

	const label = () => labels[appearingTextState()];

	const isDefault = () => appearingTextState() !== "default";
	const isLoading = () => appearingTextState() !== "loading";
	const isRunning = () => appearingTextState() !== "running";

	return (
		<button
			{...(other as any)}
			{...tooltipIgnore}
			aria-label={label()}
			class={classNames([
				className,
				"relative",
				buttonClass({
					class: "max-w-max max-h-max flex-center",
					classOverride,
					invertColor,
					size,
					visualType,
				}),
			])}
			onMouseEnter={load}
			onTouchStart={load}
			onClick={async () => {
				setAppearingTextState("loading");
				const stage =
					stageId && document.querySelector<HTMLElement>(`#${stageId}`);

				const { playAllStages, playSingleStage } = await load();

				setAppearingTextState("running");

				if (stage) await playSingleStage(stage);
				else if (!stageId) await playAllStages();
				else console.error(`No stage found #${stageId}`);

				setAppearingTextState("default");
			}}
		>
			<div
				class="gap-2 motion-safe:transition-transform-300"
				classList={{
					"scale-0": isDefault(),
					"flex-center": direction === "row",
					"flex-col-center": direction === "column",
				}}
				aria-hidden={!isDefault()}
			>
				{mainLabel}
				<div
					class="i-mingcute-volume-fill?mask"
					classList={{ [iconClass]: true }}
				></div>
			</div>

			<div
				class="absolute-center i-svg-spinners-gooey-balls-1?mask motion-safe:transition-transform-300"
				classList={{
					"scale-0": isLoading(),
					[iconClass]: true,
				}}
				aria-hidden={!isLoading()}
			></div>

			<div
				class="absolute-center gap-2 motion-safe:transition-transform-300"
				classList={{
					"scale-0": isRunning(),
					"flex-center": direction === "row",
					"flex-col-center": direction === "column",
				}}
			>
				Cancel
				<div
					class="i-mingcute-close-fill?mask"
					classList={{ [iconClass]: true }}
					aria-hidden={!isRunning()}
				></div>
			</div>
		</button>
	);
};

export default AppearingTextButton;
