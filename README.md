# mongoose-advanced-soft-delete

## The Ultimate Soft Delete Plugin for Mongoose: The Only One You'll Ever Need

### Supports all the features and edge cases that can occur.

### Installation

```
npm install mongoose-advanced-soft-delete
yarn add mongoose-advanced-soft-delete
pnpm install mongoose-advanced-soft-delete
```

### Basic Example with nestjs and mongoose

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

## License

MIT

**Free Software, Hell Yeah!**
