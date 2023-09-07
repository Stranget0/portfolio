import runOnEachPage from "@/utils/runOnEachPage";

const isTextBalanceSupported = CSS.supports("text-wrap: balance");

if (!isTextBalanceSupported) {
	runOnEachPage(() => {
		import("balance-text").then(({ default: balanceText }) =>
			balanceText(".text-balance"),
		);
	});
}
