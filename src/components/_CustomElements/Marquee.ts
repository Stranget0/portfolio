import { throttle } from "lodash";

export default class Marquee extends HTMLElement {
	clean?: VoidFunction;
	constructor() {
		super();
		this.update = this.update.bind(this);
	}
	update() {
		const speed = parseFloat(this.dataset.marqueeSpeed || "") || 1;
		console.log(this.clientWidth);
		this.style.animationDuration = `${this.clientWidth / 35 / speed}s`;
	}
	connectedCallback() {
		if (!this.isConnected) return;
		const throttledUpdate = throttle(() => this.update(), 100);
		document.addEventListener("resize", throttledUpdate);
		this.clean = () => document.removeEventListener("resize", throttledUpdate);
		this.update();
		this.style.animationPlayState = "running";
	}
	disconnectedCallback() {
		this.clean?.();
	}
}

customElements.define("marquee-x", Marquee);
