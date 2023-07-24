import type { Transcripts } from "src/schemas";
import { lerp } from "three/src/math/MathUtils";

export default function transcriptDataToTimestamps(data: Transcripts) {
	const dataToMap = data.results.flatMap(({ alternatives }) =>
		alternatives.flatMap(({ words }) =>
			words.map(({ word, startTime, endTime }) => ({
				word,
				timestamp: lerp(strStampToMs(startTime), strStampToMs(endTime), 0.5),
			}))
		)
	);

	const timestamps = dataToMap.map((entry) => entry.timestamp);
	const words = dataToMap.map((entry) => entry.word);
	return { timestamps, words };
}

function strStampToMs(strStamp: string) {
	return parseFloat(strStamp) * 1000;
}
