import {createSignal} from "solid-js"
import type { BottomStatusState } from "./types"

export const [bottomStatus, setBottomStatus] = createSignal<BottomStatusState>(null)