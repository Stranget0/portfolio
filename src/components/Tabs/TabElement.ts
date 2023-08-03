const observer = new IntersectionObserver((targets) => {
	for (const { isIntersecting, target } of targets) {
		if (isIntersecting) Tab.tabs[target.id].setActive();
	}
});

export default class Tab extends HTMLAnchorElement {
	static activeTab: Tab | null = null;
	static tabs: { [id in string]: Tab } = {};
	idRef = "";

	connectedCallback() {
		if (!this.isConnected) return;
		this.idRef = /#(\w+)$/i.exec(this.href)?.[1] || "";
		if (!this.idRef) return;
		observer.observe(document.querySelector(`#${this.idRef}`) as HTMLElement);
		Tab.tabs[this.idRef] = this;
	}
	disconnectedCallback() {
		delete Tab.tabs[this.idRef];
	}

	setActive() {
		Tab.activeTab?.classList.remove("active");
		Tab.activeTab = this;
		this.classList.add("active");
	}
}

customElements.define("nav-tab", Tab, { extends: "a" });
