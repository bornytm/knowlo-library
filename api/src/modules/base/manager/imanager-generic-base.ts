import { BaseDM } from "../../../datamodels/base/BaseDM";
import { IRelationshipRequest, IGetRequest, IGetObjectRequest } from "../dbaccessor/idbaccessor-generic-base";

export interface IManagerGenericBase<T extends BaseDM> {
    add(entity: Partial<T>): Promise<T>;
    getById(id: string): Promise<T | null>;
    getByFilters(request?: IGetRequest<T>): Promise<Array<T>>;
    getByContext(request?: IGetRequest<T>): Promise<Array<T>>;
    getObjectById(request: IGetObjectRequest<T>): Promise<T | null>;
    update(item: Partial<T>, context: Partial<T>): Promise<T | null>;
    delete(request: T): Promise<void>;
    postDelete(entity: T): Promise<void>;

    findRelationship(request: IRelationshipRequest): Promise<boolean>;
}