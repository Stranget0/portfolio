import { pointerMedia } from "@/medias";
import { stageSelector } from "@components/AppearingText/constants";
import {
	appearingTextState,
	setAppearingTextState,
} from "@components/AppearingText/state";

function cancelPlayingStage() {
	if (appearingTextState() === "running")
		import("@components/AppearingText/lib").then(({ cancelPlayingStages }) =>
			cancelPlayingStages(),
		);
}

if (pointerMedia.matches) {
	import("./lib").then(({ default: attachTooltipListeners }) => {
		attachTooltipListeners(
			{
				"play-audio": (target) => {
					setAppearingTextState(
						appearingTextState() === "default" ? "loading" : "default",
					);
					import("@components/AppearingText/lib")
						.then(({ playSingleStage }) => {
							const stage = target.closest<HTMLElement>(stageSelector);
							if (!stage) throw new Error("No stage selected");
							setAppearingTextState("running");
							return playSingleStage(stage);
						})
						.finally(() => setAppearingTextState("default"));
				},
			},
			{ "play-audio": () => appearingTextState() !== "loading" },
		);
	});
} else {
	// cancel audio fallback
	window.addEventListener("click", cancelPlayingStage);
	window.addEventListener("touchstart", () => {
		window.addEventListener("touchmove", cancelPlayingStage, { once: true });
	});
}

window.addEventListener("wheel", cancelPlayingStage)