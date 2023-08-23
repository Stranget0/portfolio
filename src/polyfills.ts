if (!window.requestIdleCallback)
	window.requestIdleCallback = (f, o) => window.setTimeout(f, o?.timeout);
