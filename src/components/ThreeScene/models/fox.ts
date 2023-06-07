import { loadDracoGLTF } from "@utils/loadDracoGLTF";
import type { BufferGeometry, Mesh, MeshStandardMaterial } from "three";

export default async function loadFox() {
	const foxGLTF = await loadDracoGLTF("models/fox/foxLowNoAnimsDraco.glb");
	const fox = foxGLTF.scene as Mesh<BufferGeometry, MeshStandardMaterial>;
	fox.matrixAutoUpdate = false;
	fox.receiveShadow = true;
	fox.castShadow = true;

	const animationManagerP = Promise.all([
		loadDracoGLTF("models/fox/foxAnimations.glb"),
		import("../foxAnimations"),
	]).then(([{ animations }, { default: startFoxAnimations }]) =>
		startFoxAnimations(fox, animations)
	);

	return [fox, animationManagerP] as const;
}
