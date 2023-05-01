type Target = HTMLElement | Document | Window;
type Ref<T> = { current: T };

export default function buildEventSequence() {
	const sequenceMap = new Map<number, VoidFunction>();
	let sequenesLength = 0;
	let onFinish: VoidFunction | null = null;

	const cancelRef: Ref<VoidFunction> = {
		current: () => console.error("Cancel not set!"),
	};

	const factoryMethods = {
		addSingleEventListener,
		wait,
		cancel: () => {
			cancelRef.current();
			sequenceMap.clear();
		},
		onFinish: (onFinishArg: VoidFunction) => {
			onFinish = onFinishArg;
		},
		run: () => sequenceMap.get(0)?.(),
	};

	return factoryMethods;

	function handleNextSequenceAfter(sequenceIndex: number) {
		const nextSequence = sequenceMap.get(sequenceIndex + 1);
		if (nextSequence) nextSequence();
		else {
			sequenceMap.clear();
			if (onFinish) onFinish();
		}
	}

	function addSingleEventListener(
		target: Target,
		eventName: string,
		listener: EventListener
	) {
		const sequenceIndex = sequenesLength;
		sequenesLength++;

		const handleEvent = (e: Event): void => {
			target.removeEventListener(eventName, handleEvent);
			sequenceMap.delete(sequenceIndex);
			listener(e);
			handleNextSequenceAfter(sequenceIndex);
		};

		sequenceMap.set(sequenceIndex, () => {
			target.addEventListener(eventName, handleEvent);
			cancelRef.current = () => {
				target.removeEventListener(eventName, handleEvent);
				sequenceMap.delete(sequenceIndex);
			};
		});

		return factoryMethods;
	}

	function wait(delay: number, listener: VoidFunction) {
		const sequenceIndex = sequenesLength;
		sequenesLength++;
		sequenceMap.set(sequenceIndex, () => {
			const timeoutId = setTimeout(() => {
				sequenceMap.delete(sequenceIndex);
				listener();
				handleNextSequenceAfter(sequenceIndex);
			}, delay);

			cancelRef.current = () => {
				clearTimeout(timeoutId);
				sequenceMap.delete(sequenceIndex);
			};
		});

		return factoryMethods;
	}
}
