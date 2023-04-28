const supportedLocales = ["pl", "us"] as const;
export type SupportedLocales = (typeof supportedLocales)[number];
export default supportedLocales;
