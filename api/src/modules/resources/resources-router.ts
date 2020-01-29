import { RouterGenericBase } from "../base/router/router-generic-base";
import { ApiTypes } from "../../datamodels/api/api-types";
import { Router } from "express";
import { ResourcesManager } from "./resources-manager";
import { ResourceDM } from "../../datamodels/resource/ResourceDM";

const router =
	new RouterGenericBase<ResourceDM>(
		ApiTypes.RESOURCES,
		ResourcesManager.Instance);

const ResourcesRouter: Router = router.router;

export {
	ResourcesRouter,
};