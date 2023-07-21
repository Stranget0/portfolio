import createCleanFunction from "@utils/createCleanFunction";
import groupBy from "lodash/groupBy";
import { z } from "zod";
import { createAwaitSequence } from "../../utils/createAwaitSequence";

type WordsData = {
	groups: [string, HTMLElement[]][];
	count: number;
};

const minDuration = 200;
const stageWordsMap = new WeakMap<HTMLElement, WordsData>();
const stages = document.querySelectorAll<HTMLElement>("[data-audio-timings]");

const { clean } = play(stages[0]);

setTimeout(clean, 2000);

function hasEndOfSentence(text: string) {
	return /[.!?$]/.test(text);
}

function play(stage: HTMLElement) {
	let timeout1 = -1;
	let timeout2 = -1;

	const wordData = getWordsFromStage(stage);

	const timingsRaw = stage.dataset.audioTimings || "";
	const isDebug = stage.dataset.debug === "true";
	const wordsReference = isDebug
		? (stage.dataset.audioReference || "").split(",")
		: null;

	const wordTimings = parseTimings(timingsRaw, wordData, wordsReference);

	let timeOffset = 0;
	let start = Date.now();

	const { runSequence, cancel: cancelSequence } = createAwaitSequence();

	const finishedPromise = runSequence(wordData.groups, ([_, words]) =>
		playWords(words)
	);

	const cleanMenago = createCleanFunction(() => {
		cancelSequence();
		clearTimeout(timeout1);
		clearTimeout(timeout2);
	});

	return { clean: cleanMenago.clean, finished: finishedPromise };

	function playWords(words: HTMLElement[]): Promise<void> {
		return new Promise<void>((resolve) => {
			let wordIndex = 0;
			let lastVisibleWord: HTMLElement | null = null;
			let hideBeforeWord: HTMLElement | null = null;
			let lastFinishedTransitionWord: HTMLElement | null = null;
			stage.classList.add("playing");
			stage.classList.remove("has-finished-words");
			stage.classList.remove("has-fading-words");

			playWord();

			function setter(
				currentValue: HTMLElement | null,
				word: HTMLElement | null,
				classToAdd: string,
				classToRemove = classToAdd
			) {
				if (currentValue === word) return word;
				currentValue?.classList.remove(classToRemove);
				word?.classList.add(classToAdd);
				return word;
			}

			function setLastVisibleWord(word: typeof lastVisibleWord) {
				lastVisibleWord = setter(lastVisibleWord, word, "word-last-visible");
			}

			function setHideBeforeWord(word: typeof hideBeforeWord) {
				hideBeforeWord = setter(hideBeforeWord, word, "word-hide-before");
			}

			function setLastFinishedTransitionWord(
				word: typeof lastFinishedTransitionWord
			) {
				stage.classList.add("has-fading-words");
				lastFinishedTransitionWord = setter(
					lastFinishedTransitionWord,
					word,
					"last-finished-transition"
				);
				stage.classList.add("has-finished-words");
			}

			function playWord(isNewSentence?: boolean) {
				const word = words[wordIndex];
				const wordDuration = wordTimings[wordIndex];
				const previousWord: HTMLElement | null = words[wordIndex - 1] || null;
				const nextWord: HTMLElement | null = words[wordIndex + 1] || null;

				setLastVisibleWord(word);
				if (isNewSentence) setLastFinishedTransitionWord(previousWord);
				const isEndOfSentence = hasEndOfSentence(word.textContent || "");

				timeout1 = window.setTimeout(() => {
					if (!nextWord) return resolve();
					wordIndex++;
					start += wordDuration;
					timeOffset = start - Date.now();
					playWord(isEndOfSentence);
				}, wordDuration + timeOffset);

				if (isEndOfSentence) {
					timeout2 = window.setTimeout(() => {
						setHideBeforeWord(nextWord);
					}, wordDuration - minDuration + timeOffset);
				}
			}
		});
	}
}

function parseTimings(
	timingsRaw: string,
	wordData: WordsData,
	wordReferences: string[] | null
) {
	const timings = timingsRaw.split(",");

	if (wordReferences) {
		debugWords(wordData, wordReferences);
	}

	return z
		.array(z.number().min(minDuration))
		.length(wordData.count)
		.parse(timings.map((time) => parseFloat(time)));
}

function debugWords(wordData: WordsData, wordReferences: string[]) {
	const nodeWords = wordData.groups.flatMap(([_, nodes]) =>
		nodes.map((n) => n.textContent || "")
	);
	nodeWords.forEach((w, i) => {
		const w1 = w.toLowerCase().trim();
		const w2 = (wordReferences[i] || "").toLowerCase().trim();
		if (w1 === w2) console.log(i, w1, w2);
		else console.error(i, w1, w2);
	});
}

function getWordsFromStage(stage: HTMLElement): WordsData {
	let lastGroup = 0;
	function parseGroup(group = "") {
		let numOrNan: number = parseInt(group, 10);
		if (isNaN(numOrNan)) numOrNan = ++lastGroup;
		return (lastGroup = numOrNan);
	}

	// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
	if (stageWordsMap.has(stage)) return stageWordsMap.get(stage)!;

	const wordsArr = Array.from(
		stage.querySelectorAll<HTMLElement>(".appearing-word")
	).filter((w) => w.textContent?.trim());
	const wordsGroup = groupBy(wordsArr, (w) =>
		parseGroup(w.dataset["data-appearing-group"])
	);
	const wordsEntriesSorted = Object.entries(wordsGroup).sort(
		([g1], [g2]) => parseInt(g1, 10) - parseInt(g2, 10)
	);
	const words: WordsData = {
		count: wordsArr.length,
		groups: wordsEntriesSorted,
	};
	stageWordsMap.set(stage, words);
	return words;
}
