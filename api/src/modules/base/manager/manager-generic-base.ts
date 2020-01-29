import { BaseDM } from "../../../datamodels/base/BaseDM";
import { IManagerGenericBase } from "./imanager-generic-base";
import { IDBAccessorGenericBase, IRelationshipRequest, IGetRequest, IGetObjectRequest } from "../dbaccessor/idbaccessor-generic-base";
import { EntityTypes } from "../../../datamodels/graph-model/EntityTypes";

export abstract class ManagerGenericBase<T extends BaseDM> implements IManagerGenericBase<T> {

    protected static managers = new Map<EntityTypes, IManagerGenericBase<BaseDM>>();

    public readonly dbAccessor: IDBAccessorGenericBase<T>;

    public constructor(dbAccessor: IDBAccessorGenericBase<T>) {
        this.dbAccessor = dbAccessor;
    }

    public static registerManager(entityType: EntityTypes, manager: IManagerGenericBase<BaseDM>) {
        if (!this.managers.has(entityType)) {
            this.managers.set(entityType, manager);
        }
    }

    public static resolveManager(entityType: EntityTypes): IManagerGenericBase<BaseDM> {
        const result = this.managers.get(entityType);
        if (!result) throw new Error(`Can't find manager for ${entityType}`);
        return result;
    }

    public async add(entity: T): Promise<T> {
        return await this.dbAccessor.addItem(entity);
    }

    public async getById(id: string): Promise<T | null> {
        return await this.dbAccessor.getById(id);
    }

    public async getByFilters(request?: IGetRequest<T>): Promise<Array<T>> {
        return await this.dbAccessor.getByFilters(request);
    }

    public async getByContext(request: IGetRequest<T>): Promise<Array<T>> {
        return await this.dbAccessor.getByContext(request);
    }

    public async getObjectById(request: IGetObjectRequest<T>): Promise<T | null> {
        return await this.dbAccessor.getObjectById(request);
    }

    public async update(item: Partial<T>, context: Partial<T>): Promise<T | null> {
        return await this.dbAccessor.update(item, context);
    }

    public async delete(request: T): Promise<void> {
        const related = await this.dbAccessor.delete(request);
        const promises = [];
        for (let i = 0; i < related.length; i++) {
            const relEntity = related[i];
            const manager = ManagerGenericBase.resolveManager(relEntity.entityType);
            promises.push(manager.postDelete(relEntity.entity));
        }
        await Promise.all(promises);
        return;
    }

    public async postDelete(entity: T): Promise<void> {
        return;
    }

    public async findRelationship(request: IRelationshipRequest): Promise<boolean> {
        return await this.dbAccessor.findRelationship(request);
    }
}