import { v1 as neo4j } from "neo4j-driver";
import { Parameters } from "neo4j-driver/types/v1/statement-runner";
import { TransactionTypes } from "../../../datamodels/common/TransactionTypes";

export interface IDBConnector {
	openTransaction(type: TransactionTypes): void;
	runQuery(query: string, params: Parameters, options?: IDBConnectorOptions): Promise<neo4j.StatementResult>;
	commitTransaction(): Promise<void>;
	rollbackTransaction(): Promise<void>;
}

export interface IDBConnectorOptions {
	localTx?: TransactionTypes;
}