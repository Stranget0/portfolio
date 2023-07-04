import initHeroController from "./heroThree";
import fog from "./modules/fog";
import loadFox from "./modules/fox";
import addLeaves from "./modules/leaves";
import lights from "./modules/lights";
import orbit from "./modules/orbit";

const controller = initHeroController(loadFox, addLeaves, lights, orbit, fog);
export default controller;

await Promise.all([
	controller.fox,
	controller.leafs,
	controller.lights,
	controller.fog,
]);
controller.renderer.domElement.classList.remove("opacity-0");
controller.startLoop();
