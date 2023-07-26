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
};

export type Sentence = WordData[];

export type GroupEntry = [string, Sentence[]];

export type WordsData = {
	groups: GroupEntry[];
	count: number;
};
