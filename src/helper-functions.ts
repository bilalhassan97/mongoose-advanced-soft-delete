import { FilterQuery } from 'mongoose';
import { SoftDeleteDocument } from './types';

export const applyNotDeletedFilter = function (
  this: FilterQuery<SoftDeleteDocument>,
  next: () => void,
): void {
  const filter = this.getFilter();
  if (filter.fetchAllIncludingSoftDeletedRecords) {
    delete filter.fetchAllIncludingSoftDeletedRecords;
  } else if (!filter.isDeleted) {
    this.setQuery({
      ...filter,
      isDeleted: { $ne: true },
    });
  }
  next();
};
