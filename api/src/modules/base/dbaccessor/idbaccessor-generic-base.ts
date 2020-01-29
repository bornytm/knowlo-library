import { BaseEntityDescriptor } from "../../../datamodels/base/BaseEntityDescriptor";
import { EntityTypes } from "../../../datamodels/graph-model/EntityTypes";
import { RelationTypes } from "../../../datamodels/graph-model/RelationTypes";
import { IDBConnectorOptions } from "../dbconnector/idbconnector";
import { Id } from "../../../datamodels/common/properties/types/IdType";
import { BaseDM } from "../../../datamodels/base/BaseDM";

export interface IDBAccessorGenericBase<T extends any> {
	DESCRIPTOR: BaseEntityDescriptor<T>;

	init(): Promise<void>;
}