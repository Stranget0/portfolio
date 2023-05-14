import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader";
import { OnProgress, loadGLTF } from "./loadGLTF";

export function loadDracoGLTF(path: string, onProgress?: OnProgress) {
	const draco = new DRACOLoader();
	draco.setDecoderConfig({ type: "js" });
	draco.setDecoderPath("https://www.gstatic.com/draco/v1/decoders/");

	const gltfLoader = new GLTFLoader();
	gltfLoader.setDRACOLoader(draco);

	return loadGLTF(path, onProgress, gltfLoader);
}
