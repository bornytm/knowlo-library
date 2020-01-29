import { PropertyTypes } from "./PropertyTypes";

export interface PropertyDescriptor {
	name: string;
	type: PropertyTypes;
	required?: boolean;
	unique?: boolean;
	translate?: boolean;
}