import mongoose, { model, Model, Schema } from 'mongoose';
import { SoftDeleteDocument, softDeletePlugin } from '../utils/softPlugin';
import { number } from 'zod';

export enum Permission {
  User,
  Moderator,
  Admin,
}

export interface IUser extends SoftDeleteDocument {
  name: string;
  username: string;
  email: string;
  password: string;
  companyId?: number | null;
  permissions: Permission[];
}

export interface UserModel extends Model<IUser> {
  findByUid(uid: number): Promise<IUser | null>;
  findManyByUids(uids: number[]): Promise<IUser[]>;
}

const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: true
    },
    username: {
      type: String,
      required: true,
      unique: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true
    },
    companyId: {
      type: Number,
      required: false,
      default: null
    },
    permissions: {
      type: [Number],
      enum: Object.values(Permission),
      default: [Permission.User]
    }
  },
  {
    timestamps: true
  }
);

userSchema.plugin(softDeletePlugin);

userSchema.index({ email: 1, active: 1, username: 1 }, { unique: true }); // Use createIndexes instead of ensureIndex

const User: UserModel = model<IUser, UserModel>('User', userSchema);

export default User;
