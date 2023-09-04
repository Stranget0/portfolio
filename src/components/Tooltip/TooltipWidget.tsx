import { Match, Switch } from "solid-js/web";
import { Presence } from "@motionone/solid";
import { tooltipSignal } from "./utils";
import type { Tooltip } from "./types";
import { onCleanup, createSignal, createEffect } from "solid-js";
import PlayTextTooltip from "./options/PlayTextTooltip";
import initLerpPositions from "@utils/lerpPositions";
import onMouseMove from "@utils/mouse";
import NumberLerpable from "@utils/NumberLerpable";

const startingX = globalThis.innerWidth / 2 || 0;
const startingY = globalThis.innerHeight / 2 || 0;

const [tooltipX, setTooltipX] = createSignal(startingX);
const [tooltipY, setTooltipY] = createSignal(startingY);

export default function Tooltip() {
	const [tooltip] = tooltipSignal;
	let ref: HTMLDivElement | undefined;

	createEffect(() => {
		const x = new NumberLerpable(startingX);
		const y = new NumberLerpable(startingY);
		const { startLerp: startLerpX, cancel: cancelX } = initLerpPositions(() => {
			setTooltipX(x.value);
		});
		const { startLerp: startLerpY, cancel: cancelY } = initLerpPositions(() => {
			setTooltipY(y.value);
		});

		const cancel = () => {
			cancelX();
			cancelY();
		};

		const cleanMouseMove = onMouseMove((e) => {
			if (tooltip()) {
				startLerpX(x, e.clientX, 0.08);
				startLerpY(y, e.clientY, 0.08);
			} else {
				setTooltipX(x.value);
				setTooltipY(y.value);
			}
		});

		onCleanup(() => {
			cancel();
			cleanMouseMove();
		});
	});

	const style = () => ({
		transform: `translate(-50%, -50%) translate(${tooltipX()}px, ${tooltipY()}px)`,
	});
	createEffect(() => console.log(tooltip()));
	return (
		<div
			ref={ref}
			id="tooltip"
			class="fixed left-0 top-0 z-15 pointer-events-none mix-blend-difference"
			style={style()}
		>
			<Presence exitBeforeEnter>
				<Switch>
					<Match when={tooltip() === "play-audio"}>
						<PlayTextTooltip />
					</Match>
				</Switch>
			</Presence>
		</div>
	);
}
