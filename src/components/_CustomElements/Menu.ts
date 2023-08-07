export default class Menu extends HTMLElement {
	timeoutId = -1;
	listElement: HTMLElement | null = null;
	toggleElement: HTMLElement | null = null;
	constructor() {
		super();

		this.handleCloseClick = this.handleCloseClick.bind(this);
		this.setIsOpen = this.setIsOpen.bind(this);
		this.getIsExpanded = this.getIsExpanded.bind(this);
		this.addListeners = this.addListeners.bind(this);
		this.removeListeners = this.removeListeners.bind(this);
	}

	connectedCallback() {
		if (!this.isConnected) return;

		const toggleElement = (this.toggleElement =
			this.querySelector<HTMLElement>("[data-menu-toggle]"));

		const listElement = (this.listElement = this.querySelector<HTMLElement>(
			"[data-expanded-class]"
		));

		if (!toggleElement || !listElement)
			throw new Error("missing required elements");

		toggleElement.addEventListener("click", () => {
			const willBeExpanded = this.getIsExpanded(toggleElement) === "false";
			this.setIsOpen(willBeExpanded);
		});
	}

	handleCloseClick(e: Event) {
		if (!e.target || !this.contains(e.target as Node)) {
			this.setIsOpen(false);
		}
	}

	setIsOpen(isOpen: boolean) {
		if (!this.listElement) return;
		const expandedClasses = this.listElement.dataset.expandedClass?.split(
			" "
		) || [""];

		this.toggleElement?.setAttribute("aria-expanded", `${isOpen}`);

		if (isOpen) {
			this.listElement.classList.add(...expandedClasses);
			this.timeoutId = window.setTimeout(this.addListeners);
		} else {
			clearTimeout(this.timeoutId);
			this.listElement.classList.remove(...expandedClasses);
			this.removeListeners();
		}
	}

	getIsExpanded(toggleElement: HTMLElement) {
		return toggleElement.getAttribute("aria-expanded");
	}
	addListeners() {
		window.addEventListener("click", this.handleCloseClick);
		window.addEventListener("touchend", this.handleCloseClick);
	}
	removeListeners() {
		window.removeEventListener("click", this.handleCloseClick);
		window.removeEventListener("touchend", this.handleCloseClick);
	}
}

customElements.define("toggled-menu", Menu);
