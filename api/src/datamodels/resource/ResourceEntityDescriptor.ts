import { BaseEntityDescriptor } from "../base/BaseEntityDescriptor";
import { PropertyTypes } from "../common/properties/PropertyTypes";
import { EntityTypes } from "../graph-model/EntityTypes";
import { ResourceDM } from "./ResourceDM";
import { RelationTypes } from "../graph-model/RelationTypes";
import { RelationshipTypes } from "../common/RelationshipTypes";

export class ResourceEntityDescriptor extends BaseEntityDescriptor<ResourceDM> {
	public readonly entityType = EntityTypes.RESOURCE;

	constructor() {
		super();

		this.properties = [...this.properties,
			{
				name: "name",
				type: PropertyTypes.STRING_NON_EMPTY,
				required: true,
				unique: true,
			},
		];

		this.relations = [...this.relations,
			{
				type: RelationTypes.TAGGED_WITH,
				relatedEntityType: EntityTypes.SYN_SET,
				deleteOnDeleteRelated: false,
				relationType: RelationshipTypes.ONE_TO_MANY,
				required: false,
				properties: [],
			},
		];
	}
}