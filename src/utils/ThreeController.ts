import { Scene, WebGLRenderer } from "three";

import type { PerspectiveCamera, OrthographicCamera } from "three";

import Observable from "./Observable";

export default class ThreeController<
	C extends PerspectiveCamera | OrthographicCamera =
		| PerspectiveCamera
		| OrthographicCamera
> {
	scene = new Scene();
	camera: C;
	renderer: WebGLRenderer;

	private destroyObservable = new Observable(undefined);

	constructor(selector: string, width: number, height: number, camera: C) {
		const canvas = document.querySelector(selector);
		if (!canvas) throw new Error(`Can not find canvas ${selector}`);

		this.camera = camera;
		this.renderer = new WebGLRenderer({ antialias: true, alpha: true, canvas });
		this.setSize(width, height);
		this.renderer.shadowMap.enabled = true;
		this.onDestroy(() => this.renderer.dispose());
	}

	render() {
		this.renderer.render(this.scene, this.camera);
	}

	setSize(width: number, height: number) {
		this.renderer.setPixelRatio(window.devicePixelRatio);
		if ("aspect" in this.camera) {
			this.camera.aspect = width / height;
			this.camera.updateProjectionMatrix();
		}
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
