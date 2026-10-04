import mongoose, { Schema, model, models } from 'mongoose';

export interface IUser {
  _id?: mongoose.Types.ObjectId | string;
  userId: string; // 13-digit alphanumeric unique identifier
  email: string;
  password: string; // hashed
  name: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const UserSchema = new Schema<IUser>(
  {
    userId: { type: String, required: true, unique: true, length: 13 },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    name: { type: String, required: true },
  },
  { timestamps: true }
);

// Create index for faster lookups
UserSchema.index({ userId: 1 });
UserSchema.index({ email: 1 });

// Prevent model overwrite upon hot reload in development
const UserModel = models.User || model<IUser>('User', UserSchema);

export default UserModel;