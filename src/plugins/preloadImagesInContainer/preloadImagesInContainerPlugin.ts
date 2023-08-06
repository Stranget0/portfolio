import { inView } from "motion";
import { preloadImagesInContainerAttr } from "./constants";
import { preloadImage } from "./utils";

inView(`[${preloadImagesInContainerAttr}]`, (observerEntry) => {
	const images = observerEntry.target.querySelectorAll<HTMLImageElement>("img");

	images.forEach(({ src }) => preloadImage(src));
});
