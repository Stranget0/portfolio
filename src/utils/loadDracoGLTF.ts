import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader";
import { type OnProgress, loadGLTF } from "./loadGLTF";

const draco = new DRACOLoader();
draco.setDecoderConfig({ type: "js" });
draco.setDecoderPath("https://www.gstatic.com/draco/v1/decoders/");

const gltfLoader = new GLTFLoader();
gltfLoader.setDRACOLoader(draco);

export function loadDracoGLTF(path: string, onProgress?: OnProgress) {
	return loadGLTF(path, onProgress, gltfLoader);
}
