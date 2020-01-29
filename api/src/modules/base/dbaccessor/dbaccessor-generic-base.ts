import { v4 } from "uuid";

import { IDBAccessorGenericBase } from "./idbaccessor-generic-base";
import { DBConnector } from "../dbconnector/dbconnector";
import { BaseEntityDescriptor } from "../../../datamodels/base/BaseEntityDescriptor";
import { TransactionTypes } from "../../../datamodels/common/TransactionTypes";
import { StringValidator } from "../../../datamodels/common/properties/validators/StringValidator";
import { IDBConnectorOptions } from "../dbconnector/idbconnector";
import { PropertyTypes } from "../../../datamodels/common/properties/PropertyTypes";
import { RelationshipTypes } from "../../../datamodels/common/RelationshipTypes";

export abstract class DBAccessorGenericBase<T extends any> implements IDBAccessorGenericBase<T> {
	public readonly DESCRIPTOR: BaseEntityDescriptor<T>;

	constructor(descriptor: BaseEntityDescriptor<T>) {
		if (!descriptor) throw new Error("Incorrect constructor - [DESCRIPTOR]");
		this.DESCRIPTOR = descriptor;
	}

	public async init(): Promise<void> {
		for (let i = 0; i < this.DESCRIPTOR.properties.length; i++) {
			const prop = this.DESCRIPTOR.properties[i];
			if (prop.unique) {
				const query =
				`CREATE CONSTRAINT ON (n:${this.DESCRIPTOR.entityType}) ASSERT n.${prop.name} IS UNIQUE `;
				await DBConnector.Instance.runUnmanagedTransaction(TransactionTypes.WRITE, query, {});
			}
		}
	}

	protected async generateId(item?: any): Promise<string> {
		return v4().toUpperCase();
	}
}