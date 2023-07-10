import initHeroController from "./foxRoot";
import { elementWaypointsInit } from "./modules/elementWaypoints/elementWaypointsInit";
import fog from "./modules/fog/fog";
import loadFox from "./modules/fox/fox";
import addLeaves from "./modules/leaves";
import lights from "./modules/lights/lights";
import orbit from "./modules/orbit";

const controller = initHeroController(
	loadFox,
	addLeaves,
	lights,
	orbit,
	fog,
	elementWaypointsInit
);

Promise.all([controller.orbit, controller.elementWaypoints]).then(
	([
		{ setLookAtOffset, setCameraSpatial: setCameraSpatialOffset },
		waypoints,
	]) => {
		waypoints.foxWaypointTarget.setWaypointTarget((vec) =>
			setLookAtOffset(vec)
		);

		waypoints.foxWaypointCameraSpatial.setWaypointTarget((vec) =>
			setCameraSpatialOffset(vec)
		);
	}
);

Promise.all([
	controller.fox,
	controller.leafs,
	controller.lights,
	controller.fog,
]).then(() => {
	controller.renderer.domElement.classList.remove("opacity-0");
	controller.startLoop();
});

export type FoxControllerType = typeof controller;
export default controller;
