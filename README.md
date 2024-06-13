# mongoose-advanced-soft-delete

## The Ultimate Soft Delete Plugin for Mongoose: The Only One You'll Ever Need

## Features

- Soft delete documents by marking them as deleted without removing them from the database.
- Restore soft-deleted documents.
- Query only non-deleted documents by default.
- Query soft-deleted documents and all documents including soft-deleted ones.
- Supports aggregate pipeline
- Supports typescript

## Installation

`npm install mongoose-advanced-soft-delete`

## Usage

### ExpressJs

1.  Import the plugin and add it to your schema:

```
const mongoose = require('mongoose');
const { softDeletePlugin } = require('mongoose-advanced-soft-delete');

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
});

userSchema.plugin(softDeletePlugin);

const User = mongoose.model('User', userSchema);
```

2.  Usage with query

```
const deleted = await User.softDelete({ _id: test._id, email: 'testuser@gmail.com' }, options);
```

### In NestJS

#### Install Mongoose module and the plugin in your NestJS application:

`npm install @nestjs/mongoose mongoose mongoose-advanced-soft-delete`

1.  Apply the plugin in your Mongoose schema:

#### Schema File

```
import { softDeletePlugin } from 'mongoose-advanced-soft-delete';

@Schema({
  timestamps: true,
})
export class User {
  @Prop({ required: true })
  name: string;
}
export const UserSchema = SchemaFactory.createForClass(User);
UserSchema.plugin(softDeletePlugin);
```

2.  Usage with queries:

#### Service Class

```
import {
  SoftDeleteModel,
} from 'mongoose-advanced-soft-delete';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name)
  private userModel: SoftDeleteModel<User>,
  ) {}

  async deleteUser(id: string): Promise<string> {
    const user = await this.userModel.softDeleteById(id);
    if (!user || user.deletedCount < 1) {
      throw new NotFoundException('Record Not Found');
    }
    return 'Record Deleted Successfully';
  }
}
```

### Methods Provided by the Plugin

#### `softDeleteById(id: string, options?: object): Promise<{ deletedCount: number } | null>`

Soft delete a document by its ID.

`await User.softDeleteById('60d0fe4f5311236168a109ca');`

#### `softDelete(query: object, options?: object): Promise<{ deletedCount: number } | null>`

Soft delete documents matching the given query.

`await User.softDelete({ email: 'user@example.com' });`

#### `softDeleteMany(query: object, options?: object): Promise<{ deletedCount: number } | null>`

Soft delete multiple documents matching the given query.

`await User.softDeleteMany({ name: 'John Doe' });`

#### `restore(query: object): Promise<{ restored: number }>`

Restore soft-deleted documents matching the given query.

`await User.restore({ email: 'user@example.com' });`

#### `findDeleted(): Promise<T[]>`

Find all soft-deleted documents.

`const deletedUsers = await User.findDeleted();`

#### `findAllIncludingSoftDeleted(query: object, projection?: object, options?: object): Promise<T[]>`

Find all documents, including soft-deleted ones.

`const allUsers = await User.findAllIncludingSoftDeleted({});`

#### `findOneIncludingSoftDeleted(query: object, projection?: object, options?: object): Promise<T>`

Find one document, including soft-deleted ones.

`const user = await User.findOneIncludingSoftDeleted({ email: 'user@example.com' });`

## License

MIT

**Free Software, Hell Yeah!**
