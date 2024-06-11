import {
  Document,
  FilterQuery,
  Model,
  ProjectionType,
  QueryOptions,
} from 'mongoose';

export interface SoftDeleteDocument extends Document {
  isDeleted: boolean;
  deletedAt: Date | null;
}

export interface GenericSoftDeleteDocument<T> extends Document<T> {
  isDeleted: boolean;
  deletedAt: Date | null;
}

export interface SoftDeleteModel<T>
  extends Model<GenericSoftDeleteDocument<T>> {
  findDeleted(): Promise<T[]>;
  findAllIncludingSoftDeleted(
    query: FilterQuery<SoftDeleteDocument>,
    projection?: ProjectionType<SoftDeleteDocument>,
    options?: QueryOptions<SoftDeleteDocument>,
  ): Promise<T[]>;
  findOneIncludingSoftDeleted: (
    query: FilterQuery<SoftDeleteDocument>,
    projection?: ProjectionType<SoftDeleteDocument>,
    options?: QueryOptions<SoftDeleteDocument>,
  ) => Promise<T>;
  restore(query: object): Promise<{ restored: number }>;
  softDeleteById(
    id: string,
    options?: object,
  ): Promise<{ deletedCount: number } | null>;
  softDelete(
    query: object,
    options?: object,
  ): Promise<{ deletedCount: number } | null>;
  softDeleteMany(
    query: object,
    options?: object,
  ): Promise<{ deletedCount: number } | null>;
}
