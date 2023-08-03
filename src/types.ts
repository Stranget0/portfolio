export interface Tab {
	id: string;
	label: string;
}
export interface Tabs {
	[k: string]: Tab;
}
