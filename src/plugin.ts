import {
  Schema,
  Model,
  FilterQuery,
  ProjectionType,
  QueryOptions,
  PipelineStage,
} from 'mongoose';
import { applyNotDeletedFilter } from './helper-functions';
import { SoftDeleteDocument } from './types';

export const softDeletePlugin = (schema: Schema): void => {
  schema.add({
    isDeleted: {
      type: Boolean,
      required: true,
      default: false,
    },
    deletedAt: {
      type: Date,
      default: null,
    },
  });

  schema.pre('find', applyNotDeletedFilter);
  schema.pre('findOne', applyNotDeletedFilter);
  schema.pre('countDocuments', applyNotDeletedFilter);

  schema.pre('aggregate', function () {
    //check if pipeline has a geoNear stage at the beginning
    const pipeline = this.pipeline();
    //for some reason its not considering geoNear as a stage so had to infer type as any
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const firstStage = pipeline[0] as any;
    if (firstStage && firstStage['$geoNear']) {
      //if geoNear stage is present, add isDeleted filter after that
      const geoNearStage = pipeline.shift() as PipelineStage;
      this.pipeline().unshift({ $match: { isDeleted: { $ne: true } } });
      this.pipeline().unshift(geoNearStage);
      return;
    }

    this.pipeline().unshift({ $match: { isDeleted: { $ne: true } } });
  });

  schema.static(
    'findDeleted',
    function (this: Model<SoftDeleteDocument>): Promise<SoftDeleteDocument[]> {
      return this.find({ isDeleted: true });
    },
  );

  schema.static(
    'findOneIncludingSoftDeleted',
    async function (
      this: Model<SoftDeleteDocument>,
      query: FilterQuery<SoftDeleteDocument>,
      projection?: ProjectionType<SoftDeleteDocument>,
      options?: QueryOptions<SoftDeleteDocument>,
    ): Promise<SoftDeleteDocument | null> {
      const document = await this.findOne(
        {
          ...query,
          fetchAllIncludingSoftDeletedRecords: true,
        },
        projection,
        options,
      );
      return document;
    },
  );

  schema.static(
    'findAllIncludingSoftDeleted',
    async function (
      this: Model<SoftDeleteDocument>,
      query: FilterQuery<SoftDeleteDocument>,
      projection?: ProjectionType<SoftDeleteDocument>,
      options?: QueryOptions<SoftDeleteDocument>,
    ): Promise<SoftDeleteDocument[]> {
      const documents = await this.find(
        {
          ...query,
          fetchAllIncludingSoftDeletedRecords: true,
        },
        projection,
        options,
      );
      return documents;
    },
  );

  schema.static(
    'restore',
    async function (
      this: Model<SoftDeleteDocument>,
      query: FilterQuery<SoftDeleteDocument>,
    ): Promise<{ restored: number }> {
      const deletedDocuments = await this.find({ ...query, isDeleted: true });
      if (!deletedDocuments) {
        throw new Error('Record not found');
      }
      let restored = 0;
      for (const deletedDocument of deletedDocuments) {
        if (deletedDocument.isDeleted) {
          deletedDocument.isDeleted = false;
          deletedDocument.deletedAt = null;
          await deletedDocument.save();
          restored++;
        }
      }
      return { restored };
    },
  );

  schema.static(
    'softDeleteById',
    async function (
      this: Model<SoftDeleteDocument>,
      id: string,
      options?: QueryOptions<SoftDeleteDocument>,
    ): Promise<{ deletedCount: number } | null> {
      const document = await this.findById(id);
      if (!document) {
        return null;
      }
      if (!document.isDeleted) {
        document.isDeleted = true;
        document.deletedAt = new Date();
        await document.save(options);
      }
      return { deletedCount: 1 };
    },
  );

  schema.static(
    'softDelete',
    async function (
      this: Model<SoftDeleteDocument>,
      query: FilterQuery<SoftDeleteDocument>,
      options?: QueryOptions<SoftDeleteDocument>,
    ): Promise<{ deletedCount: number } | null> {
      const documents = await this.find(query);
      if (!documents) {
        return null;
      }
      let deletedCount = 0;
      for (const document of documents) {
        if (!document.isDeleted) {
          document.isDeleted = true;
          document.deletedAt = new Date();
          await document.save(options);
          deletedCount++;
        }
      }
      return { deletedCount };
    },
  );

  schema.static(
    'softDeleteMany',
    async function (
      this: Model<SoftDeleteDocument>,
      query: FilterQuery<SoftDeleteDocument>,
      options?: QueryOptions<SoftDeleteDocument>,
    ): Promise<{ deletedCount: number } | null> {
      const documents = await this.find(query);
      if (!documents) {
        return null;
      }
      let deletedCount = 0;
      for (const document of documents) {
        if (!document.isDeleted) {
          document.isDeleted = true;
          document.deletedAt = new Date();
          await document.save(options);
          deletedCount++;
        }
      }
      return { deletedCount };
    },
  );
};
