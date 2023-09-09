import { createAwaitSequence } from "@utils/createAwaitSequence";
import { stageSelector } from "./constants";
import { isStageContentSmall, playStage } from "./utils";
import createCleanFunction from "@utils/createCleanFunction";
import runOnEachPage from "@/utils/runOnEachPage";

let globalClean: VoidFunction | null = null;
const runGlobalClean = () => {
	globalClean?.();
	globalClean = null;
};

let stages: HTMLElement[];

runOnEachPage(() => {
	stages = Array.from(document.querySelectorAll<HTMLElement>(stageSelector));
});

export async function playSingleStage(stage: HTMLElement) {
	runGlobalClean();

	try {
		const { clean, finished } = playStage(stage);
		globalClean = clean;
		await finished;
	} catch (e) {
		console.error(e);
	} finally {
		runGlobalClean();
	}
}

export async function playAllStages() {
	runGlobalClean();

	try {
		const { runSequence, cancel } = createAwaitSequence();
		const cleanMenago = createCleanFunction(cancel, () => {
			globalClean = null;
		});

		globalClean = cleanMenago.clean;

		await runSequence(stages, (stage, stageIndex) => {
			let delay = stageIndex === 0 ? 0 : 2000;
			if (delay > 0 && isStageContentSmall(stage)) delay = 500;

			const { finished, clean } = playStage(stage, delay);
			cleanMenago.push(clean);
			return finished;
		});
	} catch (e) {
		console.error(e);
	} finally {
		runGlobalClean();
	}
}

export function cancelPlayingStages() {
	runGlobalClean();
}
