import { Dynamic } from "solid-js/web";
import { Presence } from "@motionone/solid";
import { tooltipSignal } from "./utils";
import type { Tooltip } from "./types";
import {
	type Component,
	onCleanup,
	createSignal,
	createEffect,
} from "solid-js";
import PlayTextTooltip from "./options/PlayTextTooltip";
import initLerpPositions from "@utils/lerpPositions";
import onMouseMove from "@utils/mouse";
import NumberLerpable from "@utils/NumberLerpable";

const options: Partial<Record<string, Component>> = {
	"play-audio": PlayTextTooltip,
};

const startingX = globalThis.innerWidth / 2 || 0;
const startingY = globalThis.innerHeight / 2 || 0;

export default function Tooltip() {
	const [tooltip] = tooltipSignal;
	let ref: HTMLDivElement | undefined;

	const [mouseX, setMouseX] = createSignal(startingX);
	const [mouseY, setMouseY] = createSignal(startingY);

	createEffect(() => {
		const x = new NumberLerpable(0);
		const y = new NumberLerpable(0);
		const { startLerp: startLerpX, cancel: cancelX } = initLerpPositions(() => {
			setMouseX(x.value);
		});
		const { startLerp: startLerpY, cancel: cancelY } = initLerpPositions(() => {
			setMouseY(y.value);
		});

		const cancel = () => {
			cancelX();
			cancelY();
		};

		const cleanMouseMove = onMouseMove((e) => {
			if (tooltip()) {
				startLerpX(x, e.clientX);
				startLerpY(y, e.clientY);
			} else {
				setMouseX(x.value);
				setMouseY(y.value);
			}
		});

		onCleanup(() => {
			cancel();
			cleanMouseMove();
		});
	});

	return (
		<div
			ref={ref}
			id="tooltip"
			class="fixed left-0 top-0 z-15 pointer-events-none mix-blend-difference"
			style={{
				transform: `translate(-50%, -50%) translate(${mouseX()}px, ${mouseY()}px)`,
			}}
		>
			<Presence exitBeforeEnter>
				<Dynamic component={options[tooltip() || ""]} />
			</Presence>
		</div>
	);
}
