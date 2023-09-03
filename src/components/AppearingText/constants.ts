export const stageSelector = '[data-audio-timings*=","]';

export const wordClasses = {
	low: ["opacity-10", "filter-blur-2"],
	semi: ["opacity-50"],
	high: ["transform-scale-150"],
	all: [] as string[],
};

wordClasses.all = [wordClasses.low, wordClasses.semi, wordClasses.high].flat();

export const nonWordifiedAttr = "data-non-wordified";
export const nonWordifiedDataKey = "nonWordified";
