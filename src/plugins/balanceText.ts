const isTextBalanceSupported = CSS.supports("text-wrap: balance");

if (!isTextBalanceSupported) {
	import("balance-text").then(({ default: balanceText }) =>
		balanceText(".text-balance")
	);
}
