import { audioBarAttr, fftSteps } from "./constants";

export default function visualizeAudio(audio: HTMLAudioElement) {
	const audioCtx = new AudioContext();
	const analyser = audioCtx.createAnalyser();
	analyser.fftSize = fftSteps;
	analyser.smoothingTimeConstant = 0.9;

	const source = audioCtx.createMediaElementSource(audio);
	source.connect(audioCtx.destination);
	source.connect(analyser);

	const bars = getBars();
	const barsData = new Uint8Array(fftSteps);

	let isCanceled = false;
	requestAnimationFrame(draw);

	function draw() {
		if (isCanceled) return;
		analyser.getByteFrequencyData(barsData);
		bars.forEach((b, i) => {
			const scale = normalizeBarData(barsData[i]);
			b.style.transform = `scaleY(${scale})`;
			b.style.transition = "";
		});
		requestAnimationFrame(draw);
	}

	function cancel() {
		isCanceled = true;
		bars.forEach((b) => {
			b.style.transform = "scaleY(0)";
			b.style.transition = "transform 300ms ease-out";
		});
	}

	return cancel;
}

function getBars() {
	const barsNodeList = document.querySelectorAll<HTMLElement>(
		`[${audioBarAttr}]`,
	);
	return Array.from(barsNodeList);
}
function normalizeBarData(value: number) {
	return value / 255;
}
