export const IntegerValidator = (value: any): void => {
	if (typeof value !== "number") throw new Error("Incorrect type. [number] expected.");
	if (!Number.isInteger(value)) throw new Error("Incorrect value. [integer] expected.");
	return;
};