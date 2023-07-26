import { createAwaitSequence } from "@utils/createAwaitSequence";
import { stageSelector } from "./constants";
import { playStage } from "./utils";
import createCleanFunction from "@utils/createCleanFunction";

let globalClean: VoidFunction | null = null;
const runGlobalClean = () => {
	globalClean?.();
	globalClean = null;
};

const stages = Array.from(
	document.querySelectorAll<HTMLElement>(stageSelector)
);

export async function playSingleStage(stage: HTMLElement) {
	runGlobalClean();
	const { clean, finished } = playStage(stage);
	globalClean = clean;
	await finished;
	runGlobalClean();
}

export async function playAllStages() {
	runGlobalClean();
	const { runSequence, cancel } = createAwaitSequence();
	const cleanMenago = createCleanFunction(cancel);
	globalClean = cleanMenago.clean;

	await runSequence(stages, (stage) => {
		const { finished, clean } = playStage(stage);
		cleanMenago.push(clean);
		return finished;
	});
	runGlobalClean();
}
