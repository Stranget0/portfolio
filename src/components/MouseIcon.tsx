import type { JSX } from "solid-js";

export default function MouseIcon(props: JSX.HTMLAttributes<SVGSVGElement>) {
	return (
		<svg
			width="96"
			height="136"
			viewBox="0 0 96 136"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			{...props}
		>
			<rect
				x="2"
				y="2"
				width="92"
				height="132"
				rx="43.5"
				stroke="white"
				stroke-width="4"
			></rect>
			<rect
				class="motion-safe:animate-bounce"
				x="44"
				y="60"
				width="8"
				height="12"
				rx="4"
				fill="white"
			></rect>
		</svg>
	);
}
