import { Request, Response, NextFunction } from "express";

import { config } from "../../../config";
import { ContextKeys } from "./context-keys";

import cls = require("cls-hooked");
const namespace = config.NAMESPACE;

export class ContextService {
	private static _instance: ContextService;
	public static get Instance(): ContextService {
		return this._instance || (this._instance = new this());
	}

	constructor() {
		cls.createNamespace(namespace);
	}

	public getMiddleware(req: Request, res: Response, next: NextFunction) {
		cls.getNamespace(namespace).run(() => next());
	}

	public set(key: ContextKeys, value: any): void {
		try {
			cls.getNamespace(namespace).set(key, value);
		} catch (err) {
			throw err;
		}
	}

	public get(key: ContextKeys): any {
		try {
			const entry: any = cls.getNamespace(namespace).get(key);
			return entry;
		} catch (err) {
			throw err;
		}
	}
}