---
'mongoose-advanced-soft-delete': patch
---

- Added `includeSoftDeleted` aggregate query option
- Added session support to `restore`; forward `options.session` to reads and writes in all delete/restore methods
