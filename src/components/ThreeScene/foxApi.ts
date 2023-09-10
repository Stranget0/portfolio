import { setBottomStatus } from "../BottomStatus/state";
import type { FoxControllerType } from "./controller/controller";

let foxPromise: null | Promise<FoxControllerType> = null;

setBottomStatus("scroll");
document.addEventListener("scroll", load, { once: true });

function load() {
	setBottomStatus("spinner");
	foxPromise = import("./controller/controller").then(({ default: d }) => d);
}

export default function getFoxController() {
	return foxPromise;
}
