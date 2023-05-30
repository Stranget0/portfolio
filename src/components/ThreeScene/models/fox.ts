import { loadDracoGLTF } from "@utils/loadDracoGLTF";
import type { BufferGeometry, Mesh, MeshStandardMaterial } from "three";

export default async function loadFox() {
	const foxGLTF = await loadDracoGLTF("models/fox/foxLowNoAnimsDraco.glb");
	const fox = foxGLTF.scene as Mesh<BufferGeometry, MeshStandardMaterial>;

	const animationManagerP = Promise.all([
		loadDracoGLTF("models/fox/foxAnimations.glb"),
		import("../startFoxAnimations"),
	]).then(([{ animations }, { default: startFoxAnimations }]) =>
		startFoxAnimations(fox, animations)
	);

	fox.receiveShadow = true;
	fox.castShadow = true;

	return [fox, animationManagerP] as const;
}
