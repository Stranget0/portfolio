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
import { Vector2 } from "three";
import onMouseMove from "@utils/mouse";

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
		const vec = new Vector2();
		const to = new Vector2();
		const { startLerp, cancel } = initLerpPositions(() => {
			setMouseX(vec.x);
			setMouseY(vec.y);
		});
		const cleanMouseMove = onMouseMove((e) => {
			to.set(e.clientX, e.clientY);
			startLerp(vec, to);
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
