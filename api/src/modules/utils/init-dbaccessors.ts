import { ResourcesAccessor } from "../resources/resources-dbaccessor";

export const initDBAccessors = async () => {
	await ResourcesAccessor.Instance.init();

	console.log("DB accessors init done.");
};