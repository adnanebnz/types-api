import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true },
    email: {
      type: String,
      unique: true,
      required: true,
    },
    authentification: {
      password: { type: String, required: true, select: false },
      sessionToken: { type: String, select: false },
    },
  },
  { timestamps: true }
);

export const User = mongoose.model("User", userSchema);

export const getUsers = () => User.find();

export const getUserByEmail = (email: string) => User.findOne({ email });

export const getUserBySessionToken = (sessionToken: string) =>
  User.findOne({ "authentification.sessionToken": sessionToken });

export const getUserById = (id: string) => User.findById(id);

export const createUser = (values: Record<string, any>) =>
  new User(values).save().then((user) => user.toObject());

export const deleteUser = (id: string) => User.findByIdAndDelete(id);

export const updateUser = (id: string, values: Record<string, any>) =>
  User.findByIdAndUpdate(id, values).then((user) => user.toObject());
