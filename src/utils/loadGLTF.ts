import { GLTFLoader } from "three/addons/loaders/GLTFLoader";

export type OnProgress = (progress: number) => void;

export function loadGLTF(
	path: string,
	onProgress?: OnProgress,
	gltfLoader = new GLTFLoader()
) {
	return new Promise<GLTF["scene"]>((resolve, reject) => {
		gltfLoader.load(
			path,
			(gltf: GLTF) => {
				resolve(gltf.scene);
			},
			onProgress,
			reject
		);
	});
}
