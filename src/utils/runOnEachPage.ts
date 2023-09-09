import createCleanFunction from "./createCleanFunction";

type Push = (f:VoidFunction)=>void
export default function runOnEachPage(
	callback: (push: Push) => void,
) {
	const cleanMenago = createCleanFunction();
	callback(cleanMenago.push);
	document.addEventListener("astro:after-swap", () => {
		cleanMenago.clean();
		callback(cleanMenago.push);
	});
}
