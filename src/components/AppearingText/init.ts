import { scrollToElement } from "@plugins/lerpScrollPlugin";
import createCleanFunction from "@utils/createCleanFunction";
import addSingleEventListener from "@utils/singleEvent";
import groupBy from "lodash/groupBy";
import { z } from "zod";
import { scrollToTargetAttr } from "./constants";

type WordData = {
	node: HTMLElement;
	timestamp: number;
};

type Sentence = WordData[];

type GroupEntry = [string, Sentence[]];

type WordsData = {
	groups: GroupEntry[];
	count: number;
};

const wordClasses = {
	low: ["opacity-10", "filter-blur-2"],
	semi: ["opacity-50"],
	high: ["transform-scale-150"],
	all: [] as string[],
};
wordClasses.all = [wordClasses.low, wordClasses.semi, wordClasses.high].flat();

const appearDuration = "200ms";

const minDuration = 200;
const stageWordsMap = new WeakMap<HTMLElement, WordsData>();
const stages = document.querySelectorAll<HTMLElement>("[data-audio-timings]");

setTimeout(() => play(stages[0]), 5000);

function hasEndOfSentence(text: string, sentenceLength: number) {
	return sentenceLength > 2 && /[,.!?$]/.test(text);
}

function play(stage: HTMLElement) {
	const scrollToTarget =
		stage.closest<HTMLElement>(`[${scrollToTargetAttr}]`) || stage;
	scrollToElement(scrollToTarget);
	const audioPath = stage.dataset.audioPath;
	const audio = new Audio(`audio/${audioPath}`);
	const wordData = getWordsFromStage(stage);

	const cleanMenago = createCleanFunction();

	const stagePromise = audio.addEventListener("canplaythrough", async () => {
		await audio.play();
		changeWordsVisibility(wordData, "invisible");

		const groupsFinishedPromise = Promise.all(
			wordData.groups.map(([_, sentences]) => playWords(sentences))
		).then(() => {
			setTimeout(() => changeWordsVisibility(wordData, "visible"), 1000);
		});

		return groupsFinishedPromise;
	});

	return { clean: cleanMenago.clean, finished: stagePromise };

	async function playWords(sentences: Sentence[]): Promise<void> {
		const sentencesPromises = sentences.flatMap((sentence, sentenceIndex) => {
			const sentencePromise = Promise.all(
				sentence.map((word, wordIndex) =>
					showWord(word, cleanMenago).then(() => {
						const lastSentence = sentences[sentenceIndex - 1];
						const isFirstWord = wordIndex === 0;
						const shouldNotHideLastSentence = !isFirstWord || !lastSentence;

						if (shouldNotHideLastSentence) return;
						lastSentence.forEach((w) => {
							w.node.classList.remove(...wordClasses.all);
							w.node.classList.add(...wordClasses.low);
						});
					})
				)
			);

			return sentencePromise;
		});
		await Promise.all(sentencesPromises);
	}
}

function showWord(
	word: WordData,
	cleanMenago: { push(f: VoidFunction): void; clean(): void }
) {
	return new Promise<void>((resolve) => {
		const timeout1 = setTimeout(() => {
			word.node.style.transitionDuration = appearDuration;
			word.node.classList.remove("opacity-0");
			word.node.classList.add(...wordClasses.high);

			cleanMenago.push(
				addSingleEventListener(word.node, "transitionend", () => {
					word.node.style.transitionDuration = "";
					word.node.classList.remove(...wordClasses.all);
					word.node.classList.add(...wordClasses.semi);
				})
			);
			resolve();
		}, word.timestamp);

		cleanMenago.push(() => clearTimeout(timeout1));
	});
}

function changeWordsVisibility(
	wordData: WordsData,
	visibility: "visible" | "invisible"
) {
	wordData.groups.forEach(([_, sentences]) => {
		sentences.forEach((words) => {
			words.forEach(({ node }) => {
				node.classList.remove(...wordClasses.all);
				if (visibility === "invisible") node.classList.add("opacity-0");
				else node.classList.remove("opacity-0");
			});
		});
	});
}

function getWordsFromStage(stage: HTMLElement): WordsData {
	// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
	if (stageWordsMap.has(stage)) return stageWordsMap.get(stage)!;

	const wordNodes = Array.from(
		stage.querySelectorAll<HTMLElement>("[data-appearing-word]")
	).filter((w) => w.textContent?.trim());

	const timings = parseTimings(stage, wordNodes);
	const wordsArr = wordNodes.map((node, i) => ({
		node,
		timestamp: timings[i],
	}));

	let lastGroup = -1;
	const wordsGroup = groupBy(wordsArr, (w) => {
		const nodeGroup = w.node.parentElement?.dataset.appearingGroup;
		return (lastGroup = parseInt(nodeGroup || lastGroup + ""));
	});

	const wordsGroupSorted = Object.entries(wordsGroup).sort(
		([g1], [g2]) => parseInt(g1, 10) - parseInt(g2, 10)
	);

	const wordsGroupSentences = wordsGroupSorted.map(
		(g) => [g[0], groupWordsToSentences(g[1])] as GroupEntry
	);

	const words: WordsData = {
		count: wordNodes.length,
		groups: wordsGroupSentences,
	};
	stageWordsMap.set(stage, words);
	return words;
}

function debugWords(words: HTMLElement[], wordReferences: string[]) {
	words.forEach((w, i) => {
		const w1 = w.textContent?.toLowerCase().trim();
		const w2 = (wordReferences[i] || "").toLowerCase().trim();
		if (w1 === w2) console.log(i, w1, w2);
		else console.error(i, w1, w2);
	});
}

function parseTimings(stage: HTMLElement, words: HTMLElement[]) {
	const timingsRaw = stage.dataset.audioTimings || "";
	const isDebug = stage.dataset.debug === "true";
	const wordReferences = isDebug
		? (stage.dataset.audioReference || "").split(",")
		: null;

	const timings = timingsRaw.split(",");

	if (wordReferences) {
		debugWords(words, wordReferences);
	}

	return z
		.array(z.number().min(minDuration))
		.length(words.length)
		.parse(timings.map((time) => parseFloat(time)));
}

function groupWordsToSentences(words: WordData[]) {
	const sentences: Sentence[] = [[]];
	for (let i = 0; i < words.length; i++) {
		const w = words[i];
		sentences[sentences.length - 1].push(w);
		if (
			words[i + 1] &&
			hasEndOfSentence(
				w.node.textContent || "",
				sentences[sentences.length - 1].length
			)
		)
			sentences.push([]);
	}

	return sentences;
}
