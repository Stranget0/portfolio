export interface CleanMenago {
	push: (f: VoidFunction) => void;
	clean: VoidFunction;
	length: () => number;
}

export default function createCleanFunction(
	...cleanArr: VoidFunction[]
): CleanMenago {
	return {
		push(f: VoidFunction) {
			cleanArr.push(f);
		},
		clean() {
			while (cleanArr.length) cleanArr.pop()?.();
		},
		length: () => cleanArr.length,
	};
}
