import { v1 as neo4j } from "neo4j-driver";
import { Parameters } from "neo4j-driver/types/v1/statement-runner";

import { config } from "../../../config";
import { IDBConnector, IDBConnectorOptions} from "./idbconnector";
import { ContextService } from "../../utils/context/context-service";
import { ContextKeys } from "../../utils/context/context-keys";
import { TransactionTypes } from "../../../datamodels/common/TransactionTypes";
import { neo4jDateTimeToISOString } from "./type-utils/datetime";

export class DBConnector implements IDBConnector {
    private static _instance: DBConnector;
    public static get Instance(): DBConnector {
        return this._instance || (this._instance = new this());
    }

    private driver: neo4j.Driver;

    constructor() {
        try {
            this.driver = neo4j.driver(
                config.NEO4J_SETTINGS.uri,
                neo4j.auth.basic(config.NEO4J_SETTINGS.user, config.NEO4J_SETTINGS.password),
                {
                    logging: {
                        level: config.PRODUCTION_MODE ? undefined : "debug",
                        logger: (level, message) => {
                            // console.log(message);
                        },
                    },
                    connectionTimeout: 2000,
                    maxTransactionRetryTime: 2000,
                },
            );
        } catch (err) {
            throw err;
        }
    }

    public async runQuery(query: string, params: Parameters, options?: IDBConnectorOptions): Promise<neo4j.StatementResult> {
        console.log(query);
        console.log(params);

        if (options && options.localTx) {
            return await this.runUnmanagedTransaction(options.localTx, query, params);
        } else {
            const tx = <neo4j.Transaction> ContextService.Instance.get(ContextKeys.ACTIVE_TRANSACTION);
            const result = await tx.run(query, params);
            return result;
        }
    }

    public async runUnmanagedTransaction(type: TransactionTypes, query: string, params: Parameters): Promise<neo4j.StatementResult> {
        console.log(query);
        console.log(params);

        let session: neo4j.Session;
        if (type === TransactionTypes.READ) {
            session = this.driver.session("READ");
        } else {
            session = this.driver.session("WRITE");
        }
        const result = await session.run(query, params);
        session.close();
        return result;
    }

    public openTransaction(type: TransactionTypes): void {
        let session: neo4j.Session;
        if (type === TransactionTypes.READ) {
            session = this.driver.session("READ");
        } else {
            session = this.driver.session("WRITE");
        }
        const tx = session.beginTransaction();
        ContextService.Instance.set(ContextKeys.ACTIVE_SESSION, session);
        ContextService.Instance.set(ContextKeys.ACTIVE_TRANSACTION, tx);
    }

    public async commitTransaction(): Promise<void> {
        const session = <neo4j.Session> ContextService.Instance.get(ContextKeys.ACTIVE_SESSION);
        const tx = <neo4j.Transaction> ContextService.Instance.get(ContextKeys.ACTIVE_TRANSACTION);
        await tx.commit();
        session.close();
        return;
    }

    public async rollbackTransaction(): Promise<void> {
        const session = <neo4j.Session> ContextService.Instance.get(ContextKeys.ACTIVE_SESSION);
        const tx = <neo4j.Transaction> ContextService.Instance.get(ContextKeys.ACTIVE_TRANSACTION);
        await tx.rollback();
        session.close();
        return;
    }

    public static formatResult(result: any) {
        if (neo4j.isInt(result)) {
            return result.low;
        }

        for (const key in result) {
            if (key && result[key]) {
                const value = result[key];
                if (neo4j.isDateTime(value)) {
                    result[key] = neo4jDateTimeToISOString(value);
                }
                if (neo4j.isInt(value)) {
                    result[key] = value.low;
                }
            }
        }
        return result;
    }
}