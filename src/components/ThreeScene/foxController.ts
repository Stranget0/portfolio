import initHeroController from "./foxRoot";
import { elementWaypointsInit } from "./modules/elementWaypoints/elementWaypointsInit";
import fog from "./modules/fog/fog";
import loadFox from "./modules/fox/fox";
import addLeaves from "./modules/leaves";
import lights from "./modules/lights/lights";
import orbit from "./modules/orbit";
import { Spherical, Vector3 } from "three";

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
		{ setLookAtOffset, setCameraOffset, setCameraSpatialOffset },
		waypoints,
	]) => {
		const spatialOffset = new Spherical();

		waypoints.foxWaypointTarget.setWaypointTarget((vec) =>
			setLookAtOffset(vec)
		);

		waypoints.foxWaypointCamera.setWaypointTarget((vec) =>
			setCameraOffset(vec)
		);

		waypoints.foxWaypointCameraSpatial.setWaypointTarget((vec) => {
			spatialOffset.set(...vec.toArray());
			setCameraSpatialOffset(spatialOffset);
		});
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
