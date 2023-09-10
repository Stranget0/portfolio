import initHeroController from "./_root";
import elementWaypointsInit from "../modules/waypoints/elementWaypoints";
import fog from "../modules/fog";
import loadFox from "../modules/fox/fox";
import addLeaves from "../modules/leaves/leaves";
import lights from "../modules/lights";
import orbit from "../modules/orbit";
import renderObstacles from "../modules/renderObstacles/renderObstaclesInit";
import { foxObstacleAttr } from "../constants";
import runOnEachPage from "@/utils/runOnEachPage";
import { handleLoadedStatus } from "../utils";
import { setBottomStatus } from "@/components/BottomStatus/state";

const controller = initHeroController(
	loadFox,
	addLeaves,
	renderObstacles,
	lights,
	orbit,
	fog,
	elementWaypointsInit,
);

controller.waypoints.foxWaypointTarget.setWaypointTarget((vec) =>
	controller.orbit.setLookAtOffset(vec),
);

let initialSpatial = true;
controller.waypoints.foxWaypointCameraSpatial.setWaypointTarget((vec) => {
	controller.orbit.setCameraSpatial(vec, !initialSpatial);
	initialSpatial = false;
});

controller.waypoints.foxWaypointStiffness.setWaypointTarget((vec) => {
	controller.orbit.stiffness.x = vec.x;
	controller.orbit.stiffness.y = vec.y;
});

runOnEachPage(() => {
	controller.updateWaypointsPositions();
});

// When models loaded
Promise.all([controller.fox, controller.leafs])
	.then(() => {
		// Start rendering loop
		controller.startLoop();
		// initialize obstacles stopping loop
		controller.setObstacleSelector(`[${foxObstacleAttr}]`);
		handleLoadedStatus();
	})
	.catch((e) => {
		setBottomStatus(null);
		console.error("Failed to load scene", e);
	});

export type FoxControllerType = typeof controller;
export default controller;
