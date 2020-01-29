import { ApiTypes } from "../../../datamodels/api/api-types";
import { RouterBase } from "./router-base";
import { IManagerGenericBase } from "../manager/imanager-generic-base";
import { HttpCodes } from "../../../datamodels/common/HttpCodes";
import { BaseDM } from "../../../datamodels/base/BaseDM";
import { TransactionTypes } from "../../../datamodels/common/TransactionTypes";
import { Request, Response, NextFunction } from "express";

export class RouterGenericBase<T extends BaseDM> extends RouterBase {

	constructor(apiUriPath: ApiTypes, manager: IManagerGenericBase<T>) {
		super();

		this.router.post(apiUriPath,
			async (req, res, next) => {
				try {
					this.openTransaction(TransactionTypes.WRITE);
					const item = <T> req.body;
					const response = await manager.add(item);
					this.returnCreated(res, next, response);
				} catch (err) {
					res.status(HttpCodes.BAD_REQUEST);
					this.returnError(next, err);
				}
			},
		);
	}
}