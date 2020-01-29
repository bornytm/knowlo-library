export const StringValidator = (value: any): void => {
	if (typeof value !== "string") throw new Error("Incorrect type. [string] expected.");

	return;
};

export const StringNonEmptyValidator = (value: any): void => {
	StringValidator(value);
	if (!value.trim().length) throw new Error("Non-empty [string] expected.");

	return;
};