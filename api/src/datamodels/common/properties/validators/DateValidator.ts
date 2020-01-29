import { StringValidator } from "./StringValidator";

export const DateValidator = (value: any): void => {
	StringValidator(value);

	const date = new Date(value);
	if (isNaN(date.getTime()))  throw new Error("Incorrect type. [Date] expected.");

	return;
};