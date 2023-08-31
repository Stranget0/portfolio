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

// Stworzenie obiektu ThreeController z modułami z pomocą helpera ustawiającego podstawowe parametry
const controller = initHeroController(
	loadFox,
	addLeaves,
	renderObstacles,
	lights,
	orbit,
	fog,
	elementWaypointsInit
);

// obracanie kamerą oraz tranzycja właściwości orbitowania w zależności od przewinięcia strony
controller.waypoints.foxWaypointTarget.setWaypointTarget((vec) =>
	controller.orbit.setLookAtOffset(vec)
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

// Gdy lis i liście zostaną załadowane...
Promise.all([controller.fox, controller.leafs])
	.then(() => {
		// Uruchom pętlę renderowania
		controller.startLoop();
		// Zainicjalizuj obstacleModule poprzez określenie selektora elementów zasłaniających
		controller.setObstacleSelector(`[${foxObstacleAttr}]`);
	})
	.catch((e) => console.error("Failed to load scene", e))
	.finally(() => {
		// Usuń i dodaj określone przez element klasy
		foxHandleOnClasses(
			foxClassOnLoadingAttr,
			foxClassOnLoadingDataKey,
			"remove"
		);
		foxHandleOnClasses(foxClassOnLoadedAttr, foxClassOnLoadedDataKey);
	});

export type FoxControllerType = typeof controller;
export default controller;
