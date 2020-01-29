export const BooleanValidator = (value: any): void => {
	if (typeof value !== "boolean") throw new Error("Incorrect type. [boolean] expected.");
	return;
};