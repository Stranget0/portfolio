export default function trackObject<T extends object>(target: T) {
	return new Proxy(target, {
		set(target, prop, value) {
			const tProp = prop as keyof typeof target;
			if (prop !== "matrixWorldNeedsUpdate")
				console.log(
					`changed ${String(prop)} from ${target[tProp]} to ${value}`
				);
			target[tProp] = value;
			return true;
		},
	});
}
