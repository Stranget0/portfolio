import type { GLTF as GLTFType } from "src/utilTypes/gltf";

declare global {
	type GLTF = GLTFType;
	type AstroFC<P = Record<string, any>> = (_props: P) => void;
	type AstroComponentDict =  Record<string, AstroFC | undefined>
	type UnionToIntersection<T> = 
  (T extends any ? (x: T) => any : never) extends 
  (x: infer R) => any ? R : never
}
