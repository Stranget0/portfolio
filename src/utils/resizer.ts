import { createStore } from "zustand/vanilla";

interface State {
	width: number;
	height: number;
	onResized: VoidFunction;
}

const getScreenDimensions = () => ({
	width: window.innerWidth,
	height: window.innerHeight,
});

const resizeScreenStore = createStore<State>((set) => ({
	...getScreenDimensions(),
	onResized: () => set(getScreenDimensions()),
}));

const { subscribe: onResizeScreen, setState } = resizeScreenStore;

window.addEventListener("resize", () => setState(getScreenDimensions()));

export default onResizeScreen;
