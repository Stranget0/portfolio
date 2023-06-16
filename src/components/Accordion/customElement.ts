export default class Accordion extends HTMLUListElement {
	connectedCallback() {
		if (!this.isConnected) return;

		const option = this.querySelector<HTMLElement>(".expanded");

		const activeAccordion = createAccordionOptionState(option);

		this.addEventListener("click", (e) => {
			const target = e.target as HTMLElement | null;
			const pressedAccordionOption =
				target?.closest<HTMLElement>(".accordion-panel");

			if (!pressedAccordionOption) return;

			activeAccordion.setOption(pressedAccordionOption);
		});
	}
}

customElements.define("accordion-container", Accordion, { extends: "ul" });

function switchAttribute(
	from: HTMLElement | undefined | null,
	to: HTMLElement | undefined | null,
	attr: string,
	value: boolean
) {
	from?.setAttribute(attr, `${!value}`);
	to?.setAttribute(attr, `${value}`);
}
function createAccordionOptionState(option?: HTMLElement | null) {
	return {
		_option: option,
		_trigger: option?.querySelector<HTMLElement>(".accordion-trigger"),
		_content: option?.querySelector<HTMLElement>(".accordion-content"),
		setOption(option: HTMLElement) {
			this._option?.classList.remove("expanded");
			option.classList.add("expanded");
			this._option = option;

			const trigger = option.querySelector<HTMLElement>(".accordion-trigger");
			switchAttribute(this._trigger, trigger, "aria-expanded", true);
			this._trigger = trigger;

			const content = option.querySelector<HTMLElement>(".accordion-content");
			switchAttribute(this._content, content, "aria-hidden", false);
			this._content = content;

			console.assert(trigger, "No trigger found for accordion");
			console.assert(content, "No content found for accordion");
		},
	};
}
