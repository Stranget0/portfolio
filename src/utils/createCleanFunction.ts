export default function createCleanFunction(...cleanArr: VoidFunction[]) {
	return {
		push(f: VoidFunction) {
			cleanArr.push(f);
		},
		clean() {
			while (cleanArr.length) cleanArr.pop()?.();
		},
	};
}
