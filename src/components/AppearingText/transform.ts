export function transformLineToWords(rawText: string) {
	const textArr = rawText.split(/(\s)/);
	const text = [];
	for (const w of textArr) {
		if (/^\s$/.test(w)) text[text.length - 1] += w;
		else text.push(w);
	}

	return text;
}
