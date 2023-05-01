// @vitest-environment jsdom

import { describe, it, vitest, expect } from "vitest";
import buildEventSequence from "./sequencedEvents";

vitest.useFakeTimers();

describe("build sequenced events", () => {
	it("should handle chained wait correctly", () => {
		const fn = vitest.fn();
		buildEventSequence().wait(100, fn).wait(100, fn).wait(100, fn).run();
		expect(fn).toHaveBeenCalledTimes(0);
		vitest.advanceTimersByTime(100);
		expect(fn).toHaveBeenCalledTimes(1);
		vitest.advanceTimersByTime(100);
		expect(fn).toHaveBeenCalledTimes(2);
		vitest.advanceTimersByTime(100);
		expect(fn).toHaveBeenCalledTimes(3);
		vitest.advanceTimersByTime(100);
		expect(fn).toHaveBeenCalledTimes(3);
	});

	it("Should handle end event correctly", () => {
		const fn = vitest.fn();
		buildEventSequence()
			.wait(500, () => {})
			.wait(500, () => {})
			.onFinish(fn)
			.run();

		expect(fn).toHaveBeenCalledTimes(0);
		vitest.advanceTimersByTime(550);
		expect(fn).toHaveBeenCalledTimes(0);
		vitest.advanceTimersByTime(500);
		expect(fn).toHaveBeenCalled();
	});
});
