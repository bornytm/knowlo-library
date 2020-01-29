import { DBAccessorGenericBase } from "../base/dbaccessor/dbaccessor-generic-base";
import { IResourcesAccessor } from "./resources-idbaccessor";

import { ResourceDM } from "../../datamodels/resource/ResourceDM";
import { ResourceEntityDescriptor } from "../../datamodels/resource/ResourceEntityDescriptor";

export class ResourcesAccessor extends DBAccessorGenericBase<ResourceDM> implements IResourcesAccessor {

	private static _instance: IResourcesAccessor;
	public static get Instance(): IResourcesAccessor {
		return this._instance || (this._instance = new this());
	}

	private constructor() {
		const descriptor = new ResourceEntityDescriptor();
		super(descriptor);
	}
}