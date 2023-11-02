import { createAwaitSequence } from "@utils/createAwaitSequence";
import { stageSelector } from "./constants";
import { getWordClasses, isStageContentSmall, playStage } from "./utils";
import createCleanFunction from "@utils/createCleanFunction";
import runOnEachPage from "@/utils/runOnEachPage";
import { pointerMedia } from "@/medias";

let stages: HTMLElement[];
let scrollCount = 0;
let scrollTimeout = -1;
let globalClean: VoidFunction | null = null;

const wordClasses = getWordClasses(
	["transform-scale-150"],
	["opacity-50"],
	["opacity-10", "filter-blur-2"],
);

runOnEachPage(() => {
	stages = Array.from(document.querySelectorAll<HTMLElement>(stageSelector));
});

addCancelListeners();

export function cancelPlayingStages() {
	scrollCount = 0;
	globalClean?.();
	globalClean = null;
}

export async function playSingleStage(stage: HTMLElement) {
	cancelPlayingStages();

	try {
		const { clean, finished } = playStage(stage, { classes: wordClasses });
		globalClean = clean;
		await finished;
	} catch (e) {
		console.error(e);
	} finally {
		cancelPlayingStages();
	}
}

export async function playAllStages() {
	cancelPlayingStages();

	try {
		const { runSequence, cancel } = createAwaitSequence();
		const cleanMenago = createCleanFunction(cancel, () => {
			globalClean = null;
		});

		globalClean = cleanMenago.clean;

		await runSequence(stages, (stage, stageIndex) => {
			let delay = stageIndex === 0 ? 0 : 2000;
			if (delay > 0 && isStageContentSmall(stage)) delay = 500;

			const { finished, clean } = playStage(stage, {
				classes: wordClasses,
				delay,
			});
			cleanMenago.push(clean);
			return finished;
		});
	} catch (e) {
		console.error(e);
	} finally {
		cancelPlayingStages();
	}
}

function addCancelListeners() {
	// If has pointer
	if (pointerMedia.matches) {
		cancelOnWheel();
	} else {
		cancelOnTouch();
	}
}

function cancelOnTouch() {
	window.addEventListener(
		"touchstart",
		() => {
			window.addEventListener("touchmove", cancelPlayingStages, {
				once: true,
			});
		},
		{ passive: true },
	);
}

function cancelOnWheel() {
	window.addEventListener(
		"wheel",
		() => {
			clearTimeout(scrollTimeout);
			scrollCount++;
			if (scrollCount > 6) cancelPlayingStages();
			else {
				scrollTimeout = window.setTimeout(() => {
					scrollCount = 0;
				}, 2500);
			}
		},
		{ passive: true },
	);
}
