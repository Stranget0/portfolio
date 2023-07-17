export default function resolveImageImport(name: string) {
	const regexArr = /^(.+)\.([a-z]+)$/i.exec(name);
	if (!regexArr || !regexArr[0] || !regexArr[1])
		throw new Error("Something went wrong when matching " + name);
	const [_, fileName, ext] = regexArr;
	switch (ext) {
		case "png":
			return import(`../assets/${fileName}.png`);
		case "jpg":
			return import(`../assets/${fileName}.jpg`);
		case "gif":
			return import(`../assets/${fileName}.gif`);
		default:
			throw new Error("Extension not supported: " + name);
	}
}
