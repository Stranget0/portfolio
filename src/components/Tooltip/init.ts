import { stageSelector } from "@components/AppearingText/constants";
import {
	appearingTextState,
	setAppearingTextState,
} from "@components/AppearingText/state";
import attachTooltipListeners from "./lib";

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
