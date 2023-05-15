import { GUI } from "dat.gui";
import type { Object3D } from "three";

const gui = new GUI();

export default gui;

export function addLocationControls(mesh: Object3D, name: string) {
	const mainFolder = gui.addFolder(name);
	const rotation = mainFolder.addFolder("rotation");
	const position = mainFolder.addFolder("position");
	rotation.add(mesh.rotation, "x", -Math.PI, Math.PI).step(0.01);
	rotation.add(mesh.rotation, "y", -Math.PI, Math.PI).step(0.01);
	rotation.add(mesh.rotation, "z", -Math.PI, Math.PI).step(0.01);

	position.add(mesh.position, "x", -10, 10).step(0.01);
	position.add(mesh.position, "y", -10, 10).step(0.01);
	position.add(mesh.position, "z", -10, 10).step(0.01);

	return mainFolder;
}
