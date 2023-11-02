import { scrollToElement } from "@plugins/lerpScroll/lerpScrollPlugin";
import createCleanFunction, {
	type CleanMenago,
} from "@utils/createCleanFunction";
import groupBy from "lodash/groupBy";
import {
	nonWordifiedAttr,
	nonWordifiedDataKey,
	wordClasses,
} from "./constants";
import type { GroupEntry, Sentence, WordData, WordsGroups } from "./types";
import wait from "@utils/wait";
import { transformLineToWords } from "./transform";

const appearDuration = 200;
const toWordifySelector = `[${nonWordifiedAttr}]`;

export function isStageContentSmall(stage: HTMLElement): boolean {
	const contentLength = stage.textContent?.length || 0;
	return contentLength < 12;
}

export function playStage(stage: HTMLElement, delay?: number) {
	const audioPath = stage.dataset.audioPath;
	const audio = new Audio(`/audio/${audioPath}`);
	const scrollPosition = stage.dataset["audioScroll"] as ScrollLogicalPosition;

	wordifyStage(stage);
	const wordData = getWordsFromStage(stage);

	const cleanMenago = createCleanFunction(() =>
		changeWordsVisibility(wordData, "visible"),
	);

	const audioFinished = startAudio();

	audioFinished.finally(() => dewordifyStage(stage));

	return {
		clean: cleanMenago.clean,
		finished: audioFinished,
	};

	function startAudio() {
		return new Promise<void>((resolve, reject) => {
			async function onAudioReady() {
				try {
					const { cancel: cancelPlayTimeout } = wait(() => {
						audio.play();
					}, delay);

					cleanMenago.push(() => {
						audio.pause();
						cancelPlayTimeout();
					});

					if (!isStageContentSmall(stage))
						changeWordsVisibility(wordData, "invisible");

					const groupsFinishedPromise = Promise.all(
						wordData.groups.map(([_, sentences]) => playWords(sentences, scrollPosition, delay)
						)
					).then(() => {
						const { finished, cancel } = wait(
							() => changeWordsVisibility(wordData, "visible"),
							1000
						);
						cleanMenago.push(cancel);
						return finished;
					});

					await groupsFinishedPromise;
					resolve();
				} catch (e) {
					reject(e);
				}
			}

			const cancel = whenAudioReady(audio, onAudioReady, resolve);
			cleanMenago.push(cancel);
		});
	}

	async function playWords(
		sentences: Sentence[],
		scrollPosition?: ScrollLogicalPosition,
		delay?: number,
	): Promise<void> {
		const sentencesPromises = sentences.flatMap((sentence, sentenceIndex) => {
			const sentencePromise = Promise.all(
				sentence.map((word, wordIndex) => {
					const isFirstWord = wordIndex === 0;
					// It resolves when is shown
					return queueShowWord(
						word,
						scrollPosition,
						cleanMenago,
						delay,
						isFirstWord,
					).then(() => {
						const lastSentence = sentences[sentenceIndex - 1];
						const shouldNotHideLastSentence = !isFirstWord || !lastSentence;

						if (shouldNotHideLastSentence) return;
						lastSentence.forEach((w) => {
							hideWord(w);
						});
					});
				}),
			);
			return sentencePromise;
		});
		await Promise.all(sentencesPromises);
	}
}

function queueShowWord(
	word: WordData,
	scrollPosition: ScrollLogicalPosition | undefined,
	cleanMenago: CleanMenago,
	delay = 0,
	forceScroll = false,
) {
	return new Promise<void>((resolve) => {
		// Scroll if end of sentence
		const cleanScroll = handleScrollToLineOfWord(
			word,
			scrollPosition,
			word.timestamp,
			forceScroll,
		);

		const { cancel: cancelShowTimeout } = wait(() => {
			// Show word
			showWord(word);

			// Fade out
			const { cancel: fadeOutTimeout } = wait(() => {
				fadeOutWord(word);
			}, appearDuration);

			cleanMenago.push(fadeOutTimeout);
			resolve();
		}, word.timestamp + delay);

		if (cleanScroll) cleanMenago.push(cleanScroll);
		cleanMenago.push(cancelShowTimeout);
	});
}

function fadeOutWord(word: WordData) {
	word.node.style.transitionDuration = "";
	word.node.classList.remove(...wordClasses.all);
	word.node.classList.add(...wordClasses.semi);
}
function showWord(word: WordData) {
	word.node.style.transitionDuration = `${appearDuration}ms`;
	word.node.classList.remove("opacity-0");
	word.node.classList.add(...wordClasses.high);
}
function hideWord(w: WordData) {
	w.node.classList.remove(...wordClasses.all);
	w.node.classList.add(...wordClasses.low);
}

function handleScrollToLineOfWord(
	word: WordData,
	scrollPosition?: ScrollLogicalPosition,
	delay = 0,
	forceScroll = false,
) {
	if (!word.isEndOfSentence && !forceScroll) return;
	const timeout = setTimeout(() => {
		scrollToElement(word.node, {
			block: scrollPosition,
			inline: scrollPosition,
		});
	}, delay);

	return () => clearTimeout(timeout);
}

function changeWordsVisibility(
	wordData: WordsGroups,
	visibility: "visible" | "invisible",
) {
	wordData.groups.forEach(([_, sentences]) => {
		sentences.forEach((words) => {
			words.forEach(({ node }) => {
				node.style.transitionDuration = "";
				node.classList.remove(...wordClasses.all);
				if (visibility === "invisible") node.classList.add("opacity-0");
				else node.classList.remove("opacity-0");
			});
		});
	});
}

function getWordsFromStage(stage: HTMLElement): WordsGroups {
	const wordNodes = Array.from(
		stage.querySelectorAll<HTMLElement>("[data-appearing-word]"),
	).filter((w) => w.textContent?.trim());

	const timings = parseTimings(stage, wordNodes);
	const wordsArr = wordNodes.map((node, i) => ({
		node,
		timestamp: timings[i],
	}));

	const wordsGroupSentences = groupAndSortToSentences(wordsArr);

	const words: WordsGroups = {
		count: wordNodes.length,
		groups: wordsGroupSentences,
	};
	return words;
}

function groupAndSortToSentences(wordsArr: WordData[]): GroupEntry[] {
	let lastGroup = -1;
	const wordsGroup = groupBy(wordsArr, (w) => {
		const nodeGroup = w.node.parentElement?.dataset.appearingGroup;
		return (lastGroup = parseInt(nodeGroup || lastGroup + ""));
	});

	const wordsGroupSorted = Object.entries(wordsGroup).sort(
		([g1], [g2]) => parseInt(g1, 10) - parseInt(g2, 10),
	);

	const wordsGroupSentences = wordsGroupSorted.map(
		(g) => [g[0], groupWordsToSentences(g[1])] as GroupEntry,
	);
	return wordsGroupSentences;
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
	const isDebug = typeof stage.dataset.debug === "string";
	const wordReferences = isDebug
		? (stage.dataset.audioReference || "").split(",")
		: null;
	const timings = timingsRaw.split(",");

	if (wordReferences) {
		debugWords(words, wordReferences);
	}

	if (words.length !== timings.length) {
		throwMismatchError(words, timings);
	}

	return timings.map((time) => parseFloat(time));
}

function throwMismatchError(words: HTMLElement[], timings: string[]) {
	throw new Error(
		`words and timings mismatch: ${words.length} !== ${timings.length}\n${words
			.map(({ textContent }) => textContent)
			.join(" ")}`,
	);
}

function groupWordsToSentences(words: WordData[]) {
	const sentences: Sentence[] = [[]];
	for (let i = 0; i < words.length; i++) {
		const w = words[i];
		sentences[sentences.length - 1].push(w);

		const isEndOfSentence =
			words[i + 1] &&
			hasEndOfSentence(
				w.node.textContent || "",
				sentences[sentences.length - 1].length,
			);

		if (isEndOfSentence) {
			sentences.push([]);
			w.isEndOfSentence = true;
		}
	}

	return sentences;
}
function hasEndOfSentence(text: string, sentenceLength?: number) {
	return (!sentenceLength || sentenceLength > 2) && /[,.!?$]/.test(text);
}

function wordifyStage(stage: HTMLElement) {
	const lines = stage.querySelectorAll<HTMLElement>(toWordifySelector);

	for (const line of lines) {
		const wordProps = getWordPropsFromLine(line);
		const words = transformLineToWords(line.textContent || "");
		const frag = document.createDocumentFragment();
		words.forEach((w) => {
			const n = document.createElement("span");
			assignAttributes(n, wordProps);
			n.textContent = w;
			frag.appendChild(n);
		});

		line.textContent = null;
		line.appendChild(frag);
	}
}

function dewordifyStage(stage: HTMLElement) {
	const lines = stage.querySelectorAll<HTMLElement>(toWordifySelector);
	for (const line of lines) {
		const text = line.textContent || "";
		for (const child of line.childNodes) child.remove();
		line.innerText = text;
	}
}

function getWordPropsFromLine(container: HTMLElement) {
	try {
		return JSON.parse(container.dataset[nonWordifiedDataKey] || "");
	} catch (e) {
		console.error(e);
		return Object.create(null);
	}
}

function assignAttributes(
	word: HTMLElement,
	attributes: { [k: string]: unknown },
) {
	for (const key of Object.keys(attributes)) {
		const value = attributes[key];
		word.setAttribute(
			key,
			typeof value === "string" ? value : JSON.stringify(value),
		);
	}
}

function whenAudioReady(
	audio: HTMLAudioElement,
	onAudioReady: () => Promise<void>,
	resolve: (value: void | PromiseLike<void>) => void,
) {
	audio.addEventListener("canplaythrough", onAudioReady, {
		once: true,
	});
	audio.addEventListener("error", (e) => {
		throw new Error(e.error);
	});

	const cancel = () => {
		resolve();
		audio.removeEventListener("canplaythrough", onAudioReady);
	};
	return cancel;
}
