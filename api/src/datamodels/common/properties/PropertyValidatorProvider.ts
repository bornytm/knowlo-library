import { PropertyTypes } from "./PropertyTypes";
import { StringValidator, StringNonEmptyValidator } from "./validators/StringValidator";
import { BaseValidator } from "./validators/BaseValidator";
import { IntegerValidator } from "./validators/IntegerValidator";
import { BooleanValidator } from "./validators/BooleanValidator";

export const PropertyValidatorProvider = (type: PropertyTypes) => {
	if (type === PropertyTypes.STRING) return StringValidator;
	if (type === PropertyTypes.STRING_NON_EMPTY) return StringNonEmptyValidator;
	if (type === PropertyTypes.INTEGER) return IntegerValidator;
	if (type === PropertyTypes.BOOLEAN) return BooleanValidator;
	return BaseValidator;
};