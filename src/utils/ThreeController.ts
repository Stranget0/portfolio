import { Scene, WebGLRenderer } from "three";

import type { PerspectiveCamera, OrthographicCamera } from "three";

import Observable from "./Observable";

export type ThreeModule = (
	controller: ThreeController
) => Record<string, any> | void;

export type CameraOptions = PerspectiveCamera | OrthographicCamera;

export interface ThreeControllerOptions<Ms extends ThreeModule[]> {
	modules?: Ms;
}

export default class ThreeController<C extends CameraOptions = CameraOptions> {
	[k: string]: any;
	scene = new Scene();
	camera: C;
	renderer: WebGLRenderer;
	frameListeners: VoidFunction[] = [];
	frameId = -1;

	isLooping = new Observable(false);
	private destroyObservable = new Observable(undefined);

	static createWithModules<C extends CameraOptions, Ms extends ThreeModule[]>(
		selector: string,
		camera: C,
		{ modules }: ThreeControllerOptions<Ms> = {}
	) {
		const root = new ThreeController(selector, camera);
		const controller = root as typeof root &
			UnionToIntersection<ReturnType<Ms[number]>>;
		modules?.forEach((m) => {
			const exposed = m(root);
			Object.assign(root, exposed);
		});
		return controller;
	}

	constructor(selector: string, camera: C) {
		const canvas = document.querySelector(selector);
		if (!canvas) throw new Error(`Can not find canvas ${selector}`);

		this.camera = camera;
		this.renderer = new WebGLRenderer({ antialias: true, alpha: true, canvas });

		this.setSize(canvas.clientWidth, canvas.clientHeight);
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

	private raf() {
		this.frameId = requestAnimationFrame(() => this.raf());
		this.render();
		this.frameListeners.forEach((f) => f());
	}

	startLoop() {
		this.stopLoop();
		this.isLooping.setValue(true);
		this.raf();
		this.onDestroy(() => this.stopLoop());
	}
	stopLoop() {
		this.isLooping.setValue(false);
		cancelAnimationFrame(this.frameId);
	}
	onDestroy(listener: VoidFunction) {
		return this.destroyObservable.on(listener);
	}

	destroy() {
		this.destroyObservable.runListeners();
	}
}
