import mongoose, {Schema, Document, models, model} from "mongoose";

export interface IUser extends Document{
    username: string;
    email: string;
    password: string;
    createdAt: Date;
    updatedAt: Date;
}

const UserSchema: Schema =new Schema<IUser>(
    {
        username: {
            type: String,
            required: true,
            trim: true,
        },
        email: {
            type: String,
            required: true,
            trim: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
        },
    },
    {
        timestamps: true, //adds createAt and updatedAt
    }
);

export const User = models.User || model<IUser>('User', UserSchema);
export default User;