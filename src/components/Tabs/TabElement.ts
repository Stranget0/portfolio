const observer = new IntersectionObserver(
	(targets) => {
		for (const { isIntersecting, target } of targets) {
			if (isIntersecting) Tab.tabs[target.id].setActive();
		}
	},
	{
		threshold: 0,
		root: null,
		rootMargin: `${-window.innerHeight / 2.1}px 0px ${
			-window.innerHeight / 2.1
		}px 0px`,
	}
);

export default class Tab extends HTMLAnchorElement {
	static activeTab: Tab | null = null;
	static tabs: { [id in string]: Tab } = {};
	idRef = "";

	connectedCallback() {
		if (!this.isConnected) return;
		this.idRef = /#(.+)$/i.exec(this.href)?.[1] || "";
		const pointedElement =
			this.idRef && document.querySelector(`#${this.idRef}`);
		if (!pointedElement) {
			console.error(`No element with id ${this.idRef} found`);
			return;
		}
		observer.observe(pointedElement as HTMLElement);
		Tab.tabs[this.idRef] = this;
	}
	disconnectedCallback() {
		delete Tab.tabs[this.idRef];
	}

	setActive() {
		Tab.activeTab?.classList.remove(getActiveClass(Tab.activeTab));
		Tab.activeTab = this;
		this.classList.add(getActiveClass(Tab.activeTab));
	}
}

customElements.define("nav-tab", Tab, { extends: "a" });
function getActiveClass(tab: Tab): string {
	return tab.dataset["tabActiveClass"] || "";
}
