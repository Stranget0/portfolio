import initHeroController from "./foxRoot";
import { elementWaypointsInit } from "./modules/elementWaypoints/elementWaypointsInit";
import fog from "./modules/fog/fog";
import loadFox from "./modules/fox/fox";
import addLeaves from "./modules/leaves";
import lights from "./modules/lights/lights";
import orbit from "./modules/orbit";
import {
	foxWaypointRadiusKey,
	foxWaypointTargetKey,
} from "./modules/elementWaypoints/constants";
import { Vector3 } from "three";

const controller = initHeroController(
	loadFox,
	addLeaves,
	lights,
	orbit,
	fog,
	elementWaypointsInit
);

Promise.all([controller.orbit, controller.elementWaypoints]).then(
	([{ setLookAtOffset, setRadiusOffset }, waypoints]) => {
		const foxWaypointTarget = waypoints[foxWaypointTargetKey];
		const foxWaypointTargetRadius = waypoints[foxWaypointRadiusKey];

		foxWaypointTarget.setWaypointTarget(new Vector3(), (vec) =>
			setLookAtOffset(vec)
		);
		foxWaypointTargetRadius.setWaypointTarget(new Vector3(0), (v) =>
			setRadiusOffset(v.x)
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
