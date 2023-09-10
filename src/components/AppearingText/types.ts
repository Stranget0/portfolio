export type TextTag =
	| "h1"
	| "h2"
	| "h3"
	| "h4"
	| "h5"
	| "h6"
	| "p"
	| "cite"
	| "abbr"
	| "code"
	| "del"
	| "strong"
	| "i"
	| "span"
	| "mark";

export type WordData = {
	node: HTMLElement;
	timestamp: number;
	isEndOfSentence?: boolean;
};

export type Sentence = WordData[];

export type GroupEntry = [string, Sentence[]];

export type WordsGroups = {
	groups: GroupEntry[];
	count: number;
};

export type States = "default" | "loading" | "running";
