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

export type GenericSoftDeleteDocument<T> = T & SoftDeleteDocument;

export interface SoftDeleteModel<T>
  extends Model<GenericSoftDeleteDocument<T>> {
  findDeleted(): Promise<GenericSoftDeleteDocument<T>[]>;
  findAllIncludingSoftDeleted(
    query: FilterQuery<GenericSoftDeleteDocument<T>>,
    projection?: ProjectionType<GenericSoftDeleteDocument<T>>,
    options?: QueryOptions<GenericSoftDeleteDocument<T>>,
  ): Promise<GenericSoftDeleteDocument<T>[]>;
  findOneIncludingSoftDeleted: (
    query: FilterQuery<SoftDeleteDocument>,
    projection?: ProjectionType<SoftDeleteDocument>,
    options?: QueryOptions<SoftDeleteDocument>,
  ) => Promise<GenericSoftDeleteDocument<T> | null>;
  restore(
    query: FilterQuery<GenericSoftDeleteDocument<T>>,
    options?: QueryOptions<GenericSoftDeleteDocument<T>>,
  ): Promise<{ restored: number }>;
  softDeleteById(
    id: string,
    options?: QueryOptions<GenericSoftDeleteDocument<T>>,
  ): Promise<{ deletedCount: number } | null>;
  softDelete(
    query: FilterQuery<GenericSoftDeleteDocument<T>>,
    options?: QueryOptions<GenericSoftDeleteDocument<T>>,
  ): Promise<{ deletedCount: number } | null>;
  softDeleteMany(
    query: FilterQuery<GenericSoftDeleteDocument<T>>,
    options?: QueryOptions<GenericSoftDeleteDocument<T>>,
  ): Promise<{ deletedCount: number } | null>;
}
