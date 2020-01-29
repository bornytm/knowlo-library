import { RelationDescriptor } from "./RelationDescriptor";
import { PropertyDescriptor } from "./properties/PropertyDescriptor";
import { PropertyValidatorProvider } from "./properties/PropertyValidatorProvider";
import { EntityTypes } from "../graph-model/EntityTypes";

export interface ValidateOptions {
	partial: boolean;
}

export abstract class EntityDescriptor {
	public abstract entityType: EntityTypes;

	public properties: Array<PropertyDescriptor>;
	public relations: Array<RelationDescriptor>;

	constructor() {
		this.properties = [];

		this.relations = [];
	}

	public validate(item: any, options: ValidateOptions): void {
		if (!item) throw new Error("Base validation failed. [item] is undefined");
		this.properties.forEach(prop => {
			if ((prop.required && !options.partial) && (item[prop.name] === null || item[prop.name] === undefined))
				throw new Error(`[${prop.name}] is required.`);

			if ((!prop.required || options.partial) && (item[prop.name] === null || item[prop.name] === undefined))
				return;

			const validator = PropertyValidatorProvider(prop.type);
			validator(item[prop.name]);
		});

		this.relations.forEach(rel => {
			if ((rel.required && !options.partial) && (item[rel.type] === null || item[rel.type] === undefined))
				throw new Error(`[${rel.type}] is required.`);

			if ((!rel.required && options.partial) && (item[rel.type] === null || item[rel.type] === undefined))
				return;
		});
	}
}