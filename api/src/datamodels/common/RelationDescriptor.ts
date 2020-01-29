import { RelationTypes } from "../graph-model/RelationTypes";
import { EntityTypes } from "../graph-model/EntityTypes";
import { PropertyDescriptor } from "../common/properties/PropertyDescriptor";
import { RelationshipTypes } from "./RelationshipTypes";

export interface RelationDescriptor {
	type: RelationTypes;
	required: boolean;
	relationType: RelationshipTypes;

	relatedEntityType: EntityTypes;
	deleteOnDeleteRelated: boolean;

	properties: Array<PropertyDescriptor>;
}