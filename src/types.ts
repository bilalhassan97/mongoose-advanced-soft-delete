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
