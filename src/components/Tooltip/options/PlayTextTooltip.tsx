import type { Component } from "solid-js";
import TooltipMotion from "../TooltipMotion";

const PlayTextTooltip: Component = () => {
	return (
		<TooltipMotion class="flex-col-center">
			<div class="w-8 h-8 i-mingcute-finger-tap-fill?mask mb-4"></div>
			<p>Play Audio</p>
		</TooltipMotion>
	);
};

export default PlayTextTooltip;
