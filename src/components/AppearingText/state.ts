import { createSignal } from "solid-js";
import type { States } from "./types";

export const [appearingTextState, setAppearingTextState] = createSignal<States>(
	globalThis.window ? "default" : "loading",
);
