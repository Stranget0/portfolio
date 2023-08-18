export const TEXT_NODE = 3;

export const pointerMedia = matchMedia("(pointer:fine)");
export const motionSafeMedia = matchMedia(
	"(prefers-reduced-motion: no-preference)"
);

export const mainpageTabs = {
	play: { id: "play-website-tab", label: "play" },
	aboutMe: { id: "about-me-tab", label: "about me" },
	projects: { id: "projects-tab", label: "projects" },
	skills: { id: "skills-tab", label: "skills" },
	contact: { id: "contact-tab", label: "contact me" },
};

export const availableBreakpoints = [756, 1024] as const;
export type AvailableBreakpoints = (typeof availableBreakpoints)[number];

export type BreakpointsDict = Record<
	(typeof availableBreakpoints)[number],
	MediaQueryList
>;

export const breakpoints = availableBreakpoints.reduce((acc, b) => {
	acc[b] = matchMedia(`(min-width: ${b}px)`);
	return acc;
}, {} as BreakpointsDict);
