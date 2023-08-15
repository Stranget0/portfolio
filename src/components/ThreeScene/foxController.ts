import initHeroController from "./foxRoot";
import elementWaypointsInit from "./modules/waypoints/elementWaypoints";
import fog from "./modules/fog";
import loadFox from "./modules/fox/fox";
import addLeaves from "./modules/leaves/leaves";
import lights from "./modules/lights";
import orbit from "./modules/orbit";
import renderObstacles from "./modules/renderObstacles/renderObstaclesInit";
import {
	foxClassOnLoadedAttr,
	foxClassOnLoadedDataKey,
	foxClassOnLoadingAttr,
	foxClassOnLoadingDataKey,
	foxObstacleAttr,
} from "./constants";
import { foxHandleOnClasses } from "./serverUtils";

const controller = initHeroController(
	loadFox,
	addLeaves,
	renderObstacles,
	lights,
	orbit,
	fog,
	elementWaypointsInit
);

controller.waypoints.foxWaypointTarget.setWaypointTarget((vec) =>
	controller.orbit.setLookAtOffset(vec)
);

controller.waypoints.foxWaypointCameraSpatial.setWaypointTarget((vec) =>
	controller.orbit.setCameraSpatial(vec)
);

controller.waypoints.foxWaypointStiffness.setWaypointTarget((vec) => {
	controller.orbit.stiffness.x = vec.x;
	controller.orbit.stiffness.y = vec.y;
});

Promise.all([controller.fox, controller.leafs])
	.then(() => {
		foxHandleOnClasses(
			foxClassOnLoadingAttr,
			foxClassOnLoadingDataKey,
			"remove"
		);
		foxHandleOnClasses(foxClassOnLoadedAttr, foxClassOnLoadedDataKey);
		controller.startLoop();
		controller.setObstacleSelector(`[${foxObstacleAttr}]`);
	})
	.catch((e) => console.error("Failed to load scene", e));

export type FoxControllerType = typeof controller;
export default controller;
