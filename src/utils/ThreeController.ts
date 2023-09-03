import { Scene, WebGLRenderer, WebGLRendererParameters } from "three";
import type { PerspectiveCamera, OrthographicCamera } from "three";
// import Stats from "stats.js";
import Observable from "./Observable";

export type ThreeModule = (
	controller: ThreeController
) => Record<string, any> | void;

export type CameraOptions = PerspectiveCamera | OrthographicCamera;

type RendererOrArgs = WebGLRendererParameters | WebGLRenderer;
export interface ThreeControllerOptions {
	renderer?: RendererOrArgs;
}

const defaultRendererArgs: WebGLRendererParameters = {
	antialias: true,
	alpha: true,
};

// const stats = new Stats();
// stats.showPanel(2);

// document.body.appendChild(stats.dom);

export default class ThreeController<C extends CameraOptions = CameraOptions> {
	[k: string]: any;
	scene = new Scene();
	camera: C;
	renderer: WebGLRenderer;
	frameListeners: VoidFunction[] = [];

	isLooping = new Observable(false);
	private destroyObservable = new Observable(undefined);

	static createWithModules<C extends CameraOptions, Ms extends ThreeModule[]>(
		selector: string,
		camera: C,
		{ modules, renderer }: ThreeControllerOptions & { modules?: Ms } = {}
	) {
		const root = new ThreeController(selector, camera, { renderer });
		const controller = root as typeof root &
			UnionToIntersection<ReturnType<Ms[number]>>;
		modules?.forEach((m) => {
			const exposed = m(root);
			Object.assign(root, exposed);
		});
		return controller;
	}

	constructor(
		selector: string,
		camera: C,
		{ renderer: rendererOrRendererOptions }: ThreeControllerOptions
	) {
		const canvas = document.querySelector(selector);
		if (!canvas) throw new Error(`Can not find canvas ${selector}`);

		this.camera = camera;
		this.renderer =
			rendererOrRendererOptions instanceof WebGLRenderer
				? rendererOrRendererOptions
				: new WebGLRenderer({
						canvas,
						...defaultRendererArgs,
						...rendererOrRendererOptions,
						// eslint-disable-next-line no-mixed-spaces-and-tabs
				  });

		this.setSize(canvas.clientWidth, canvas.clientHeight);
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

	startLoop() {
		this.isLooping.setValue(true);
		this.renderer.setAnimationLoop(() => {
			// stats.begin();
			this.render();
			this.frameListeners.forEach((f) => f());
			// stats.end();
		});
		this.onDestroy(() => this.stopLoop());
	}
	stopLoop() {
		this.isLooping.setValue(false);
		this.renderer.setAnimationLoop(
			null
			// 	() => {
			// 	stats.begin();
			// 	stats.end();
			// }
		);
	}
	onDestroy(listener: VoidFunction) {
		return this.destroyObservable.on(listener);
	}

	destroy() {
		this.destroyObservable.runListeners();
	}
}
