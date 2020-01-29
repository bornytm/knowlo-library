import { Router, Request, Response, NextFunction } from "express";
import { HttpCodes } from "../../../datamodels/common/HttpCodes";

import { DBConnector } from "../dbconnector/dbconnector";
import { TransactionTypes } from "../../../datamodels/common/TransactionTypes";

export class RouterBase {

	public router: Router;

	constructor() {
		this.router = Router();
	}

	protected openTransaction(transactionType: TransactionTypes): void {
		DBConnector.Instance.openTransaction(transactionType);
		return;
	}

	protected returnResults(res: Response, next: NextFunction, results: object): void {
		DBConnector.Instance.commitTransaction()
		.then(() => {
			res.status(HttpCodes.OK).json(results);
		})
		.catch(e => {
			next(e);
		});
	}

	protected returnCreated(res: Response, next: NextFunction, results: object): void {
		DBConnector.Instance.commitTransaction()
		.then(() => {
			res.status(HttpCodes.CREATED).json(results);
		})
		.catch(e => {
			next(e);
		});
	}

	protected returnNoContent(res: Response, next: NextFunction): void {
		DBConnector.Instance.commitTransaction()
		.then(() => {
			res.status(HttpCodes.NO_CONTENT).end();
		})
		.catch(e => {
			next(e);
		});
	}

	protected returnError(next: NextFunction, err: Error): void {
		DBConnector.Instance.rollbackTransaction()
		.then(() => {
			next(err);
		})
		.catch(e => {
			next(e);
		});
	}
}
