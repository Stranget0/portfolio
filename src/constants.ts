export const TEXT_NODE = 3;

export const pointerMedia = matchMedia("(pointer:fine)");
export const motionSafeMedia = matchMedia(
	"(prefers-reduced-motion: no-preference)"
);

export const mainpageTabs = {
	play: { id: "play-website", label: "play" },
	aboutMe: { id: "about-me", label: "about me" },
	projects: { id: "projects", label: "projects" },
	skills: { id: "skills", label: "skills" },
	contact: { id: "contact", label: "contact me" },
};
