export const TEXT_NODE = 3;

export const pointerMedia = matchMedia("(pointer:fine)");
export const motionSafeMedia = matchMedia(
	"(prefers-reduced-motion: no-preference)"
);

export const mainpageTabs = {
	aboutMe: { id: "aboutMe", label: "about me" },
	projects: { id: "projects", label: "projects" },
	contact: { id: "contact", label: "contact me" },
};
