import { PropertyTypes } from "../common/properties/PropertyTypes";
import { EntityDescriptor } from "../common/EntityDescriptor";

export abstract class BaseEntityDescriptor<T extends any> extends EntityDescriptor {
	constructor() {
		super();
		this.properties = [
			...this.properties,
			{
				name: "id",
				type: PropertyTypes.STRING_NON_EMPTY,
				required: true,
				unique: true,
			},
			{
				name: "createdAt",
				type: PropertyTypes.DATE,
				required: true,
				unique: false,
			},
			{
				name: "updatedAt",
				type: PropertyTypes.DATE,
				required: true,
				unique: false,
			},
		];

	}
}