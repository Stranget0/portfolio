import randomColorBetween from "@utils/randomColorBetween";
import randomSpherePointsFromTo from "@utils/randomPoints";
import {
	BufferGeometry,
	Color,
	DoubleSide,
	Euler,
	InstancedMesh,
	Matrix4,
	Mesh,
	MeshStandardMaterial,
	Quaternion,
	SRGBColorSpace,
	Vector3,
} from "three";
import textureLoader from "@utils/textureLoader";
import mulberry32 from "@utils/seedableRandom";
import randomBetween from "@utils/randomBetween";
import { loadDracoGLTF } from "@utils/loadDracoGLTF";
import { animate } from "motion";

const goodLookingSeeds = [64, 342];
const random = mulberry32(
	goodLookingSeeds[Math.round(randomBetween(0, goodLookingSeeds.length - 1))]
);

export default async function loadLeafs(
	amount: number,
	radiusFrom: number,
	radiusTo: number,
	variants: number
) {
	const leafMeshes = await Promise.all(
		["05", "11"].map((n) => loadSingleLeaf(n))
	);

	const amountPerType = Math.floor(amount / leafMeshes.length);
	const instancedLeafTypes = makeLeafInstances(
		leafMeshes,
		amountPerType,
		variants
	);

	randomizeTransforms(instancedLeafTypes, amount, radiusFrom, radiusTo);

	return instancedLeafTypes;
}

async function loadSingleLeaf(num: string) {
	const [{ scene: leafS }, leafD, leafR, leafN] = await Promise.all([
		loadDracoGLTF(`models/leaves/leaf${num}.glb`),
		textureLoader.loadAsync(`models/leaves/leaf${num}_D.png`),
		textureLoader.loadAsync(`models/leaves/leaf${num}_R.png`),
		textureLoader.loadAsync(`models/leaves/leaf${num}_N.png`),
	]);

	[leafD, leafR, leafN].forEach((t) => {
		t.flipY = false;
		t.colorSpace = SRGBColorSpace;
	});

	return new Mesh(
		leafS.children[0].geometry,
		new MeshStandardMaterial({
			map: leafD,
			roughnessMap: leafR,
			normalMap: leafN,
			transparent: true,
			side: DoubleSide,
			alphaTest: 0.5,
		})
	);
}

function randomizeTransforms(
	instancedLeafTypes: InstancedMesh[],
	amount: number,
	radiusFrom: number,
	radiusTo: number
) {
	const matrix = new Matrix4();
	const randomPositions = randomSpherePointsFromTo(
		amount,
		radiusFrom,
		radiusTo,
		random
	);

	let index = 0;
	for (const instancedLeafs of instancedLeafTypes) {
		for (
			let instanceIndex = 0;
			instanceIndex < instancedLeafs.count;
			instanceIndex++
		) {
			randomizeMatrix(matrix, randomPositions[index]);
			instancedLeafs.setMatrixAt(instanceIndex, matrix);
			startAnimate(instancedLeafs, matrix, instanceIndex);

			index++;
		}
	}
}

function startAnimate(
	instances: InstancedMesh<BufferGeometry>,
	initialMatrix: Matrix4,
	index: number
) {
	const p = new Vector3().setFromMatrixPosition(initialMatrix);
	const p_initial = p.clone();
	const r = new Euler().setFromRotationMatrix(initialMatrix);
	const r_initial = r.clone();
	const q = new Quaternion();
	const s = new Vector3().setFromMatrixScale(initialMatrix);
	const m = initialMatrix.clone();
	const stagger = -index;

	requestIdleCallback(() => {
		animate(
			(factor) => {
				const value = factor * 2 - 1;
				p.y = p_initial.y + value / 8;
				update();
			},
			{
				delay: -5 + stagger,
				duration: 10,
				repeat: Infinity,
				direction: "alternate",
			}
		);

		animate(
			(factor) => {
				r.x = r_initial.x + factor * 2;
				r.y = r_initial.y + factor / 2;
				r.z = r_initial.z + factor / 2;
				q.setFromEuler(r);
				update();
			},
			{
				duration: 12.5,
				delay: -stagger,
				repeat: Infinity,
				direction: "alternate",
			}
		);
	});

	function update() {
		m.compose(p, q, s);
		instances.setMatrixAt(index, m);
		instances.instanceMatrix.needsUpdate = true;
	}
}

function makeLeafInstances(
	leafMeshes: Mesh<BufferGeometry, MeshStandardMaterial>[],
	amountPerType: number,
	variantsPerType: number
) {
	const instances: InstancedMesh[] = [];
	for (const leaf of leafMeshes) {
		let variants = variantsPerType;
		while (variants) {
			leaf.material.color = new Color(randomColorBetween(0xffffff, 0xff5555));
			const amountToCreate = Math.floor(amountPerType / variantsPerType);
			const leafInstance = new InstancedMesh(
				leaf.geometry,
				leaf.material.clone(),
				amountToCreate
			);
			instances.push(leafInstance);
			variants--;
		}
	}
	return instances;
}

function randomizeMatrix(matrix: Matrix4, position: Vector3) {
	const rotation = new Euler();
	const quaternion = new Quaternion();
	const scale = new Vector3();

	rotation.x = random() * 2 * Math.PI;
	rotation.y = random() * 2 * Math.PI;
	rotation.z = random() * 2 * Math.PI;

	quaternion.setFromEuler(rotation);

	scale.x = scale.y = scale.z = randomBetween(0.2, 0.25, random);

	matrix.compose(position, quaternion, scale);
}
