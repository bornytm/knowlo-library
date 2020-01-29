import { IResourcesManager } from "./resources-imanager";
import { ResourcesAccessor } from "./resources-dbaccessor";
import { ManagerGenericBase } from "../base/manager/manager-generic-base";
import { ResourceDM } from "../../datamodels/resource/ResourceDM";
import { IResourcesAccessor } from "./resources-idbaccessor";

export class ResourcesManager extends ManagerGenericBase<ResourceDM> implements IResourcesManager {

	protected static _instance: IResourcesManager;
	public static get Instance(): IResourcesManager {
		return this._instance || (this._instance = new this());
	}

	public readonly dbAccessor: IResourcesAccessor;

	protected constructor() {
		super(ResourcesAccessor.Instance);
		ManagerGenericBase.registerManager(this.dbAccessor.DESCRIPTOR.entityType, this);
	}
}