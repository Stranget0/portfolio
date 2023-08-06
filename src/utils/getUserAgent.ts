export default function getUserAgent() {
	const agent = window.navigator.userAgent.toLowerCase();

	if (agent.indexOf("edge") > -1 || agent.indexOf("edg/") > -1) return "edge";
	if (agent.indexOf("opr") > -1 && "opr" in window) return "opera";
	if (agent.indexOf("chrome") > -1 && "chrome" in window) return "chrome";
	if (agent.indexOf("trident") > -1) return "ie";
	if (agent.indexOf("firefox") > -1) return "firefox";
	if (agent.indexOf("safari") > -1) return "safari";
	return "other";
}
