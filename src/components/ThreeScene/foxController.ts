import initHeroController from "./foxRoot";
import elementWaypointsInit from "./modules/waypoints/elementWaypointsInit";
import fog from "./modules/fog/fog";
import loadFox from "./modules/fox/fox";
import addLeaves from "./modules/leaves/leaves";
import lights from "./modules/lights/lights";
import orbit from "./modules/orbit";
import renderObstacles from "./modules/renderObstacles/renderObstaclesInit";
import { foxObstacleAttr } from "./constants";

const controller = initHeroController(
	loadFox,
	addLeaves,
	renderObstacles,
	lights,
	orbit,
	fog,
	elementWaypointsInit
);

Promise.all([controller.orbit, controller.elementWaypoints])
	.then(([orbit, waypoints]) => {
		waypoints.foxWaypointTarget.setWaypointTarget((vec) =>
			orbit.setLookAtOffset(vec)
		);

		waypoints.foxWaypointCameraSpatial.setWaypointTarget((vec) =>
			orbit.setCameraSpatial(vec)
		);

		waypoints.foxWaypointStiffness.setWaypointTarget((vec) => {
			orbit.stiffness.x = vec.x;
			orbit.stiffness.y = vec.y;
		});
	})
	.catch((e) => console.error("Failed to load orbit", e));

Promise.all([
	controller.fox,
	controller.leafs,
	controller.lights,
	controller.fog,
])
	.then(() => {
		controller.renderer.domElement.classList.remove("opacity-0");
		controller.startLoop();
		controller.setObstacleSelector(`[${foxObstacleAttr}]`);
	})
	.catch((e) => console.error("Failed to load scene", e));

export type FoxControllerType = typeof controller;
export default controller;
