import type { Transcripts } from "src/schemas";

export default function transcriptDataToTimestamps(data: Transcripts) {
	return data.results.flatMap(({ alternatives }) =>
		alternatives.flatMap(({ words }) =>
			words.map(({ startTime, word }) => ({ word, timestamp: startTime }))
		)
	);
}
