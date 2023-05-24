import { loadDracoGLTF } from "@utils/loadDracoGLTF";

export default async function loadFox() {
	const { scene: fox } = await loadDracoGLTF("models/fox/foxNoAnimsDraco.glb");
	fox.receiveShadow = true;
	fox.castShadow = true;

	return fox;
}
