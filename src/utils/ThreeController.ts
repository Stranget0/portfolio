import { Scene, PerspectiveCamera, WebGLRenderer } from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import Observable from "./Observable";

export default class ThreeController {
	scene = new Scene();
	camera: PerspectiveCamera;
	renderer: WebGLRenderer;

	private destroyObservable = new Observable(undefined);

	constructor(selector: string, width: number, height: number) {
		const canvas = document.querySelector(selector);
		if (!canvas) throw new Error(`Can not find canvas ${selector}`);

		this.camera = new PerspectiveCamera(75, width / height, 0.1, 1000);
		this.renderer = new WebGLRenderer({ antialias: true, alpha: true, canvas });
		this.renderer.setSize(width, height);
		this.renderer.shadowMap.enabled = true;
		// const controls = new OrbitControls(this.camera, this.renderer.domElement);
		this.onDestroy(() => this.renderer.dispose());
	}

	render() {
		this.renderer.render(this.scene, this.camera);
	}

	setSize(width: number, height: number) {
		this.camera.aspect = width / height;
		this.camera.updateProjectionMatrix();
		this.renderer.setPixelRatio(window.devicePixelRatio);
		this.renderer.setSize(width, height);
		this.render();
	}

	onDestroy(listener: VoidFunction) {
		return this.destroyObservable.on(listener);
	}

	destroy() {
		this.destroyObservable.call();
	}
}
